import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';

if (existsSync('.env')) loadEnvFile('.env');

const value = process.env.SITE_URL || 'https://example.invalid';
const url = new URL(value);
if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password ||
    url.pathname !== '/' || url.search || url.hash) {
  throw new Error('SITE_URL must be an HTTP(S) origin, e.g. https://your-domain.com (no path, credentials or query).');
}

export const siteOrigin = url.origin;
export const isPlaceholderOrigin = url.hostname === 'example.invalid';
