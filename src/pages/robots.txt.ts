import { site } from '../config';

export function GET() {
  return new Response(
    `User-agent: *\n${site.placeholderOrigin ? 'Disallow: /' : 'Allow: /'}\n\nSitemap: ${site.origin}/sitemap-index.xml\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
}
