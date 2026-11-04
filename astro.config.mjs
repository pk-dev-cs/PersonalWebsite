import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { siteOrigin } from './config/site-origin.mjs';

export default defineConfig({
  site: siteOrigin,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404/') })],
  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },
});
