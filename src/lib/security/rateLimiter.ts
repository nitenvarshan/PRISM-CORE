import { getServerSupabase } from '../supabase/server';
import { mockDb } from '../supabase/mockDb';

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Serverless-safe persistent rate limiter.
 * Supports:
 * 1. Upstash Redis REST API (zero package overhead, purely via fetch)
 * 2. Supabase persistent `rate_limits` table
 * 3. Mock DB fallback for instant zero-dependency local demo
 */
export async function checkRateLimit(
  identifier: string,
  limit: number = 20,
  windowSeconds: number = 60
): Promise<RateLimitResult> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // Option A: Upstash Redis REST API if configured
  if (upstashUrl && upstashToken) {
    try {
      const key = `ratelimit:${identifier}`;
      const response = await fetch(`${upstashUrl}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', key],
          ['EXPIRE', key, windowSeconds],
        ]),
      });

      if (response.ok) {
        const data = await response.json();
        const count = data[0]?.result || 1;
        const remaining = Math.max(0, limit - count);
        return {
          success: count <= limit,
          limit,
          remaining,
          reset: Math.floor(Date.now() / 1000) + windowSeconds,
        };
      }
    } catch (err) {
      console.warn('Upstash rate limiter error, falling back to Supabase/Mock:', err);
    }
  }

  // Option B: Supabase rate_limits table via Postgres
  const supabase = getServerSupabase();
  if (supabase) {
    try {
      // Call atomic increment function defined in schema.sql
      const { data, error } = await supabase.rpc('increment_rate_limit', {
        p_key: identifier,
        p_window_seconds: windowSeconds,
        p_max_requests: limit,
      });

      if (!error && data && data.length > 0) {
        const row = data[0];
        return {
          success: row.allowed,
          limit,
          remaining: row.remaining,
          reset: Math.floor(Date.now() / 1000) + windowSeconds,
        };
      }
    } catch (err) {
      console.warn('Supabase rate limit RPC error, falling back to local store:', err);
    }
  }

  // Option C: Local persistent fallback store
  const res = mockDb.incrementRateLimit(identifier, windowSeconds, limit);
  return {
    success: res.allowed,
    limit,
    remaining: res.remaining,
    reset: Math.floor(Date.now() / 1000) + windowSeconds,
  };
}
