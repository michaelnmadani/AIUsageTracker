import React from 'react';
import { Empty, Panel } from '../components/Panel';
import { api } from '../lib/api';
import { relativeTime } from '../lib/format';
import type { MailData } from '../../shared/types';

export function MailPanel({
  mail,
  error,
  onOpenSettings,
}: {
  mail: MailData | null;
  error?: string | null;
  onOpenSettings: () => void;
}) {
  if (!mail || mail.accounts.length === 0) {
    return (
      <Panel title="Important mail" problem={error}>
        <Empty>
          {error ?? 'No Google account connected yet.'}
          <br />
          <button className="btn btn--primary" style={{ marginTop: 10 }} onClick={onOpenSettings}>
            Connect Gmail
          </button>
        </Empty>
      </Panel>
    );
  }

  const failing = mail.accounts.filter((account) => account.error);
  const unread = mail.accounts.reduce((total, account) => total + account.unreadCount, 0);

  return (
    <Panel
      title="Important mail"
      problem={error}
      pulse={mail.updatedAt}
      meta={
        <>
          <span>{unread} unread in inbox</span>
          <span>·</span>
          <span>{relativeTime(mail.updatedAt)}</span>
        </>
      }
    >
      {failing.length > 0 ? (
        <div className="item__sub" style={{ color: 'var(--bad)', marginBottom: 8 }}>
          {failing.map((account) => `${account.label}: ${account.error}`).join(' · ')}
        </div>
      ) : null}

      {mail.messages.length === 0 ? (
        <Empty>Inbox zero on the important stuff.</Empty>
      ) : (
        <div className="list">
          {mail.messages.map((message) => (
            <div
              key={`${message.accountId}:${message.id}`}
              className="item item--clickable"
              onClick={() => void api.openExternal(message.link)}
              title={message.snippet}
            >
              <div
                className="todo__priority"
                style={{ background: message.unread ? 'var(--accent)' : 'transparent' }}
              />
              <div className="item__main">
                <div className="item__title">
                  {message.starred ? '★ ' : ''}
                  {message.subject}
                </div>
                <div className="item__sub">
                  {message.from} · {message.accountEmail}
                </div>
              </div>
              <div className="item__side">{relativeTime(message.receivedAt)}</div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}
