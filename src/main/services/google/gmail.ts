import type { GoogleAccountConfig, MailAccountState, MailData, MailMessage } from '../../../shared/types';
import type { GoogleAuth } from './auth';

const GMAIL = 'https://gmail.googleapis.com/gmail/v1/users/me';
const MAX_PER_ACCOUNT = 12;

export const DEFAULT_MAIL_QUERY = 'in:inbox is:unread (is:important OR is:starred) newer_than:14d';

function header(headers: any[], name: string): string {
  const match = headers?.find((h) => h.name?.toLowerCase() === name.toLowerCase());
  return match?.value ?? '';
}

/** "Ada Lovelace <ada@example.com>" → { name, email } */
function splitFrom(value: string): { name: string; email: string } {
  const match = value.match(/^\s*"?([^"<]*)"?\s*<([^>]+)>\s*$/);
  if (match) return { name: match[1].trim() || match[2], email: match[2] };
  return { name: value, email: value };
}

async function fetchAccount(
  auth: GoogleAuth,
  account: GoogleAccountConfig
): Promise<{ state: MailAccountState; messages: MailMessage[] }> {
  const state: MailAccountState = {
    accountId: account.id,
    email: account.email,
    label: account.label,
    unreadCount: 0,
    error: null,
  };

  try {
    const query = account.mailQuery?.trim() || DEFAULT_MAIL_QUERY;
    const listUrl = `${GMAIL}/messages?maxResults=${MAX_PER_ACCOUNT}&q=${encodeURIComponent(query)}`;
    const [list, inbox] = await Promise.all([
      auth.apiGet(account.id, listUrl),
      auth.apiGet(account.id, `${GMAIL}/labels/INBOX`).catch(() => null),
    ]);

    state.unreadCount = inbox?.messagesUnread ?? list.resultSizeEstimate ?? 0;

    const ids: string[] = (list.messages ?? []).map((m: any) => m.id);
    const details = await Promise.all(
      ids.map((id) =>
        auth
          .apiGet(
            account.id,
            `${GMAIL}/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`
          )
          .catch(() => null)
      )
    );

    const messages: MailMessage[] = [];
    for (const message of details) {
      if (!message) continue;
      const headers = message.payload?.headers ?? [];
      const labels: string[] = message.labelIds ?? [];
      const from = splitFrom(header(headers, 'From'));
      messages.push({
        id: message.id,
        accountId: account.id,
        accountEmail: account.email,
        threadId: message.threadId,
        from: from.name,
        fromEmail: from.email,
        subject: header(headers, 'Subject') || '(no subject)',
        snippet: (message.snippet ?? '').replace(/&#39;/g, "'").replace(/&quot;/g, '"'),
        receivedAt: Number(message.internalDate ?? Date.now()),
        unread: labels.includes('UNREAD'),
        starred: labels.includes('STARRED'),
        important: labels.includes('IMPORTANT'),
        link: `https://mail.google.com/mail/?authuser=${encodeURIComponent(account.email)}#all/${message.threadId}`,
      });
    }
    return { state, messages };
  } catch (error) {
    state.error = error instanceof Error ? error.message : String(error);
    return { state, messages: [] };
  }
}

export async function fetchMail(
  auth: GoogleAuth,
  accounts: GoogleAccountConfig[]
): Promise<MailData> {
  const enabled = accounts.filter((account) => account.enabled);
  const results = await Promise.all(enabled.map((account) => fetchAccount(auth, account)));

  return {
    accounts: results.map((r) => r.state),
    messages: results
      .flatMap((r) => r.messages)
      .sort((a, b) => b.receivedAt - a.receivedAt)
      .slice(0, 25),
    updatedAt: Date.now(),
  };
}
