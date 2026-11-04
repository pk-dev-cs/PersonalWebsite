import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';
import { siteOrigin, isPlaceholderOrigin } from '../config/site-origin.mjs';

const dist = resolve('dist');

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory()
    ? filesIn(join(directory, entry.name))
    : join(directory, entry.name)))).flat();
}

const files = await filesIn(dist);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const read = (file) => readFile(join(dist, file), 'utf8');

test('all required routes and assets are built', async () => {
  for (const route of [
    'index.html', 'resume/index.html', 'contact/index.html', 'blog/index.html',
    '404.html', 'rss.xml', 'robots.txt', 'sitemap-index.xml', 'sitemap-0.xml',
    'favicon.svg', 'social-card.png',
  ]) {
    assert.ok((await stat(join(dist, route))).size > 0, route);
  }
});

test('production is static with no executable client JavaScript or remote dependencies', async () => {
  assert.equal(files.filter((file) => /\.(?:m?js|cjs)$/.test(file)).length, 0);
  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf8');
    const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
    assert.equal(scripts.length, 1, file);
    assert.match(scripts[0][1], /type="application\/ld\+json"/);
    assert.doesNotThrow(() => JSON.parse(scripts[0][2]));
    assert.doesNotMatch(html, /\bon(?:click|load|mouseover)\s*=|<astro-island|<script[^>]+src=/i);
    assert.doesNotMatch(html, /<(?:img|iframe)[^>]+src="https?:|<link[^>]+rel="stylesheet"[^>]+href="https?:/i);
    assert.doesNotMatch(html, /<form\b/i);
  }
});

test('semantic pages have four correct navigation destinations and unique SEO', async () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf8');
    assert.equal([...html.matchAll(/<h1(?:\s[^>]*)?>/g)].length, 1, file);
    assert.match(html, /<html lang="en"/);
    assert.match(html, /<main id="main"/);
    const nav = html.match(/<nav\b[^>]*>([\s\S]*?)<\/nav>/)[1];
    assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map((match) => match[1]),
      ['/', '/resume/', '/blog/', '/contact/']);
    assert.equal([...nav.matchAll(/aria-current="page"/g)].length, file.endsWith(`${sep}404.html`) ? 0 : 1);
    const title = html.match(/<title>(.*?)<\/title>/)[1];
    const description = html.match(/name="description" content="([^"]+)"/)[1];
    assert.ok(!titles.has(title), `Duplicate title: ${title}`);
    assert.ok(!descriptions.has(description), `Duplicate description: ${description}`);
    titles.add(title);
    descriptions.add(description);
    const canonical = html.match(/rel="canonical" href="([^"]+)"/)[1];
    assert.equal(new URL(canonical).origin, siteOrigin);
    assert.match(html, /property="og:image" content="[^"]+\/social-card\.png"/);
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
    assert.match(html, /rel="alternate" type="application\/rss\+xml"/);
    if (isPlaceholderOrigin || file.endsWith(`${sep}404.html`)) assert.match(html, /noindex, nofollow/);
    else assert.match(html, /index, follow/);
  }
});

test('every internal href and asset resolves to a production file', async () => {
  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf8');
    for (const match of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
      const url = new URL(match[1], siteOrigin);
      const path = decodeURIComponent(url.pathname).replace(/^\/+/, '');
      const target = join(dist, path, url.pathname.endsWith('/') ? 'index.html' : '');
      assert.ok(target.startsWith(`${dist}${sep}`), target);
      assert.ok((await stat(target)).isFile(), `${file}: ${match[1]}`);
    }
  }
});

test('About has two lightweight local WebP backgrounds without adding backgrounds to other pages', async () => {
  const html = await read('index.html');
  assert.match(html, /<main\b[^>]+class="main-with-background"/);
  const images = [...html.matchAll(/--main-background(?:-mobile)?:\s*url\((\/_astro\/[^)]+\.webp)\)/g)];
  assert.equal(images.length, 2);
  assert.notEqual(images[0][1], images[1][1]);
  for (const [, path] of images) {
    const image = await readFile(join(dist, path.slice(1)));
    assert.equal(image.subarray(0, 4).toString(), 'RIFF');
    assert.equal(image.subarray(8, 12).toString(), 'WEBP');
    assert.ok(image.length < 250_000, `${path} exceeds 250 KB`);
  }
  assert.ok(!files.some((file) => file.includes('main-background') && file.endsWith('.png')));
  for (const file of htmlFiles.filter((file) => file !== join(dist, 'index.html'))) {
    assert.doesNotMatch(await readFile(file, 'utf8'), /class="main-with-background"|--main-background:/);
  }
});

test('RSS and sitemap expose the same published article links', async () => {
  const feed = await read('rss.xml');
  const sitemap = await read('sitemap-0.xml');
  const index = await read('blog/index.html');
  assert.match(feed, /<rss[^>]+version="2.0"/);
  const links = [...index.matchAll(/href="(\/blog\/[^"]+\/)"/g)].map((match) => match[1]);
  assert.equal([...feed.matchAll(/<item>/g)].length, links.length);
  for (const link of links) {
    assert.ok(feed.includes(new URL(link, siteOrigin).href), link);
    assert.ok(sitemap.includes(new URL(link, siteOrigin).href), link);
    const html = await read(`${link.slice(1)}index.html`);
    const schema = JSON.parse(html.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1]);
    assert.ok(schema['@graph'].some((entry) => entry['@type'] === 'BlogPosting' && entry.datePublished));
    assert.match(html, /<time datetime="/);
  }
  assert.ok(!sitemap.includes('/404'));
  const robots = await read('robots.txt');
  assert.ok(robots.includes(`Sitemap: ${siteOrigin}/sitemap-index.xml`));
  assert.ok(robots.includes(isPlaceholderOrigin ? 'Disallow: /' : 'Allow: /'));
});

test('small pages and a real PNG social image are shipped', async () => {
  for (const file of htmlFiles) assert.ok((await stat(file)).size < 40_000, `${file} exceeds 40 KB raw HTML`);
  const css = files.filter((file) => file.endsWith('.css'));
  assert.ok(css.length > 0);
  let bytes = 0;
  for (const file of css) {
    bytes += (await stat(file)).size;
    assert.doesNotMatch(await readFile(file, 'utf8'), /@import|https?:\/\/|@font-face/);
    assert.doesNotMatch(await readFile(file, 'utf8'), /view-transition|page-fade|page-is-entering|page-is-leaving/);
  }
  assert.ok(bytes < 20_000, 'CSS exceeds 20 KB');
  const png = await readFile(join(dist, 'social-card.png'));
  assert.equal(png.subarray(1, 4).toString(), 'PNG');
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
});

test('resume contains extracted professional content as native HTML, not a PDF embed', async () => {
  const html = await read('resume/index.html');
  for (const text of [
    'Przemysław Kleszcz', 'Technical Lead', 'Caspio', 'Aon', 'Global Logic',
    'Aype Sp. z o.o', 'Tema Komputer Sp. z o.o', 'Andrychów',
    'Master of Science in Engineering', 'Cracow University of Technology',
    'OPC-UA', 'AUREA CRM', 'MSSQL', 'MySQL', 'Oracle', 'Polish', 'English',
  ]) assert.ok(html.includes(text), text);
  assert.equal([...html.matchAll(/class="experience-row"/g)].length, 5);
  assert.equal([...html.matchAll(/class="responsibilities"/g)].length, 5);
  assert.equal([...html.matchAll(/<time datetime="/g)].length, 9);
  assert.match(html, /<img[^>]+class="resume-photo"/);
  assert.match(html, /alt="Przemysław Kleszcz"/);
  assert.match(html, /width="176" height="220"/);
  assert.match(html, /srcset="[^"]+176w[^"]+352w"/);
  assert.doesNotMatch(html, /<iframe|<embed|<object|href="[^"]+\.pdf|href="tel:|Example Studio|Illustrative resume/i);
});
