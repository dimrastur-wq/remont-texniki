const siteUrl = 'https://master-tehniki74.store';

export async function GET() {
  const robots = `# Robots.txt — ${siteUrl}
# Центр восстановления бытовой техники

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /*.json$

Sitemap: ${siteUrl}/sitemap.xml

# Yandex
User-agent: Yandex
Allow: /
Disallow: /admin/
Disallow: /api/
Crawl-delay: 1
Host: ${siteUrl.replace('https://', '')}

# Google
User-agent: Googlebot
Allow: /
Disallow: /admin/
Disallow: /api/
`;

  return new Response(robots, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
