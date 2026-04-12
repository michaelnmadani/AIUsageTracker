import https from 'https';
import http from 'http';

/**
 * Anthropic Admin API client for fetching organization usage data.
 * Requires an Admin API key (sk-ant-admin-...) from the Claude Console.
 *
 * Docs: https://docs.anthropic.com/en/api/usage-cost-api
 */

const API_BASE = 'https://api.anthropic.com';
const API_VERSION = '2023-06-01';

// --- Response types ---

export interface UsageBucket {
  /** ISO timestamp for this bucket */
  started_at: string;
  ended_at: string;
  /** Model identifier (when grouped by model) */
  model?: string;
  /** Workspace ID (when grouped by workspace) */
  workspace_id?: string;
  /** Token counts */
  input_tokens: number;
  output_tokens: number;
  cache_read_input_tokens: number;
  cache_creation?: {
    ephemeral_1h_input_tokens?: number;
    ephemeral_5m_input_tokens?: number;
  };
}

export interface UsageReportResponse {
  data: UsageBucket[];
  has_more: boolean;
  next_page?: string;
}

export interface ClaudeCodeUsageBucket {
  date: string;
  user_id?: string;
  user_email?: string;
  input_tokens: number;
  output_tokens: number;
  cache_read_input_tokens?: number;
  cache_creation_input_tokens?: number;
  sessions?: number;
  lines_of_code?: number;
  commits?: number;
  pull_requests?: number;
}

export interface ClaudeCodeUsageResponse {
  data: ClaudeCodeUsageBucket[];
  has_more: boolean;
  next_page?: string;
}

// --- Client ---

export class AnthropicApiClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Validate the API key by making a lightweight request.
   * Returns true if the key is a valid admin key.
   */
  async validateKey(): Promise<{ valid: boolean; error?: string }> {
    try {
      // Try to fetch a minimal usage report (1 day, should be fast)
      const today = new Date().toISOString().slice(0, 10);
      const url = `${API_BASE}/v1/organizations/usage_report/messages?starting_at=${today}T00:00:00Z&ending_at=${today}T23:59:59Z&bucket_width=1d`;
      const response = await this.request(url);

      if (response.statusCode === 200) {
        return { valid: true };
      } else if (response.statusCode === 401 || response.statusCode === 403) {
        return { valid: false, error: 'Invalid or unauthorized API key. An Admin API key (sk-ant-admin-...) is required.' };
      } else {
        return { valid: false, error: `API returned status ${response.statusCode}: ${response.body}` };
      }
    } catch (err: any) {
      return { valid: false, error: `Connection failed: ${err.message}` };
    }
  }

  /**
   * Fetch Messages API usage for a date range, grouped by model and day.
   */
  async getMessagesUsage(startDate: string, endDate: string): Promise<UsageBucket[]> {
    const allBuckets: UsageBucket[] = [];
    let url: string | null = `${API_BASE}/v1/organizations/usage_report/messages?starting_at=${startDate}T00:00:00Z&ending_at=${endDate}T23:59:59Z&bucket_width=1d&group_by[]=model`;

    while (url) {
      const response = await this.request(url);
      if (response.statusCode !== 200) {
        console.error('[API] Messages usage request failed:', response.statusCode, response.body);
        break;
      }

      const data: UsageReportResponse = JSON.parse(response.body);
      allBuckets.push(...data.data);

      if (data.has_more && data.next_page) {
        url = data.next_page.startsWith('http') ? data.next_page : `${API_BASE}${data.next_page}`;
      } else {
        url = null;
      }
    }

    return allBuckets;
  }

  /**
   * Fetch Claude Code specific usage data for a date range.
   */
  async getClaudeCodeUsage(startDate: string, endDate: string): Promise<ClaudeCodeUsageBucket[]> {
    const allBuckets: ClaudeCodeUsageBucket[] = [];

    // The Claude Code analytics endpoint takes a single date per request
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().slice(0, 10);
      let url: string | null = `${API_BASE}/v1/organizations/usage_report/claude_code?starting_at=${dateStr}`;

      while (url) {
        try {
          const response = await this.request(url);
          if (response.statusCode !== 200) {
            console.warn('[API] Claude Code usage request failed for', dateStr, ':', response.statusCode);
            break;
          }

          const data: ClaudeCodeUsageResponse = JSON.parse(response.body);
          allBuckets.push(...data.data);

          if (data.has_more && data.next_page) {
            url = data.next_page.startsWith('http') ? data.next_page : `${API_BASE}${data.next_page}`;
          } else {
            url = null;
          }
        } catch (err) {
          console.warn('[API] Error fetching Claude Code usage for', dateStr, ':', err);
          url = null;
        }
      }
    }

    return allBuckets;
  }

  private request(url: string): Promise<{ statusCode: number; body: string }> {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 443,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': API_VERSION,
          'Content-Type': 'application/json',
        },
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ statusCode: res.statusCode || 0, body }));
      });

      req.on('error', reject);
      req.setTimeout(30000, () => {
        req.destroy(new Error('Request timed out'));
      });
      req.end();
    });
  }
}
