import { getCollection } from 'astro:content';

export async function publishedPosts() {
  const now = new Date();
  return (await getCollection('blog', ({ data }) => !data.draft && data.pubDate <= now))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || a.id.localeCompare(b.id));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
  }).format(date);
}
