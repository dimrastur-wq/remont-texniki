const siteUrl = 'https://master-tehniki74.store';

export async function GET() {
  const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml

User-agent: Yandex
Allow: /
Crawl-delay: 1

User-agent: Googlebot
Allow: /
`;

  return new Response(robots, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
