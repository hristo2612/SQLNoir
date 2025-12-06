import { blogPostsMeta } from "@/lib/blog-posts";

const siteUrl = "https://www.sqlnoir.com";

const generateRssItem = (post: (typeof blogPostsMeta)[number]) => {
  const pubDate = new Date(post.date).toUTCString();
  return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt}]]></description>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid>${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${post.author}</author>
    </item>
  `;
};

export async function GET() {
  const items = blogPostsMeta.map(generateRssItem).join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SQLNoir Detective's Journal</title>
    <description>SQL tutorials, tips, and learning resources from SQLNoir.</description>
    <link>${siteUrl}/blog</link>
    <atom:link href="${siteUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
