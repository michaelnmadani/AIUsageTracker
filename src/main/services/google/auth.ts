import { shell } from 'electron';
import crypto from 'crypto';
import http from 'http';
import type { AddressInfo } from 'net';
import type { Store } from '../../store';

const AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const USERINFO_ENDPOINT = 'https://openidconnect.googleapis.com/v1/userinfo';

export const GOOGLE_SCOPES = [
  'openid',
  'email',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/calendar.readonly',
];

export interface AuthResult {
  email: string;
  refreshToken: string;
}

interface CachedToken {
  accessToken: string;
  expiresAt: number;
}

function base64url(buffer: Buffer): string {
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const CLOSE_PAGE = `<!doctype html><meta charset="utf-8"><title>Command Centre</title>
<body style="font-family:system-ui;background:#10131a;color:#e6edf7;display:grid;place-items:center;height:100vh;margin:0">
<div style="text-align:center"><h2>Account connected</h2><p>You can close this tab and return to Command Centre.</p></div>`;

/**
 * OAuth for an installed ("desktop") client: PKCE plus a loopback redirect on a
 * random port. Refresh tokens live in the encrypted secret store, never in config.
 */
export class GoogleAuth {
  private tokens = new Map<string, CachedToken>();

  constructor(private store: Store) {}

  private clientCredentials(): { clientId: string; clientSecret?: string } {
    const clientId = this.store.getConfig().google.clientId.trim();
    if (!clientId) {
      throw new Error('No Google OAuth client id configured (Settings → Google).');
    }
    const clientSecret = this.store.getSecret('googleClientSecret');
    return { clientId, clientSecret };
  }

  /** Runs the browser consent flow and returns the account's email + refresh token. */
  async authorise(): Promise<AuthResult> {
    const { clientId, clientSecret } = this.clientCredentials();
    const verifier = base64url(crypto.randomBytes(32));
    const challenge = base64url(crypto.createHash('sha256').update(verifier).digest());
    const state = base64url(crypto.randomBytes(16));

    const { code, redirectUri, server } = await this.listenForCode(clientId, challenge, state);
    server.close();

    const body = new URLSearchParams({
      code,
      client_id: clientId,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
      code_verifier: verifier,
    });
    if (clientSecret) body.set('client_secret', clientSecret);

    const tokenResponse = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
    });
    const token = await tokenResponse.json();
    if (!tokenResponse.ok) {
      throw new Error(token.error_description || token.error || 'Token exchange failed');
    }
    if (!token.refresh_token) {
      throw new Error(
        'Google did not return a refresh token. Remove the app at myaccount.google.com/permissions and try again.'
      );
    }

    const profileResponse = await fetch(USERINFO_ENDPOINT, {
      headers: { authorization: `Bearer ${token.access_token}` },
    });
    const profile = await profileResponse.json();

    return { email: profile.email ?? 'unknown', refreshToken: token.refresh_token };
  }

  private listenForCode(
    clientId: string,
    challenge: string,
    state: string
  ): Promise<{ code: string; redirectUri: string; server: http.Server }> {
    return new Promise((resolve, reject) => {
      const server = http.createServer((req, res) => {
        const url = new URL(req.url ?? '/', 'http://127.0.0.1');
        const code = url.searchParams.get('code');
        const error = url.searchParams.get('error');
        const returnedState = url.searchParams.get('state');

        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        res.end(CLOSE_PAGE);

        if (error) {
          server.close();
          reject(new Error(`Google returned "${error}"`));
        } else if (code && returnedState === state) {
          const { port } = server.address() as AddressInfo;
          resolve({ code, redirectUri: `http://127.0.0.1:${port}`, server });
        }
      });

      server.on('error', reject);
      server.listen(0, '127.0.0.1', () => {
        const { port } = server.address() as AddressInfo;
        const params = new URLSearchParams({
          client_id: clientId,
          redirect_uri: `http://127.0.0.1:${port}`,
          response_type: 'code',
          scope: GOOGLE_SCOPES.join(' '),
          access_type: 'offline',
          prompt: 'consent select_account',
          code_challenge: challenge,
          code_challenge_method: 'S256',
          state,
        });
        void shell.openExternal(`${AUTH_ENDPOINT}?${params.toString()}`);
      });

      // Don't leave a listening socket around if the user abandons the browser tab.
      setTimeout(
        () => {
          if (server.listening) {
            server.close();
            reject(new Error('Timed out waiting for Google sign-in.'));
          }
        },
        5 * 60 * 1000
      ).unref();
    });
  }

  /** Returns a valid access token for an account, refreshing when needed. */
  async getAccessToken(accountId: string): Promise<string> {
    const cached = this.tokens.get(accountId);
    if (cached && cached.expiresAt > Date.now() + 60_000) {
      return cached.accessToken;
    }

    const refreshToken = this.store.getKeyedSecret('googleRefreshTokens', accountId);
    if (!refreshToken) {
      throw new Error('Account is not connected — reconnect it in Settings.');
    }

    const { clientId, clientSecret } = this.clientCredentials();
    const body = new URLSearchParams({
      client_id: clientId,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    });
    if (clientSecret) body.set('client_secret', clientSecret);

    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
    });
    const token = await response.json();
    if (!response.ok) {
      throw new Error(token.error_description || token.error || 'Token refresh failed');
    }

    const accessToken = token.access_token as string;
    this.tokens.set(accountId, {
      accessToken,
      expiresAt: Date.now() + (token.expires_in ?? 3600) * 1000,
    });
    return accessToken;
  }

  forget(accountId: string): void {
    this.tokens.delete(accountId);
    this.store.setKeyedSecret('googleRefreshTokens', accountId, null);
  }

  /** Authenticated GET against a Google API, returning parsed JSON. */
  async apiGet(accountId: string, url: string): Promise<any> {
    const accessToken = await this.getAccessToken(accountId);
    const response = await fetch(url, {
      headers: { authorization: `Bearer ${accessToken}`, accept: 'application/json' },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.error?.message ?? `${response.status} ${response.statusText}`);
    }
    return data;
  }
}
