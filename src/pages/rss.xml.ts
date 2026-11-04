import rss from '@astrojs/rss';
import { site, profile } from '../config';
import { publishedPosts } from '../lib/blog';

export async function GET() {
  return rss({
    title: `${site.title} / notes`,
    description: profile.siteDescription,
    site: site.origin,
    items: (await publishedPosts()).map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: '<language>en</language>',
  });
}
