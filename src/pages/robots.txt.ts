const siteUrl = 'https://master-tehniki74.store';

export async function GET() {
  const robots = `# Robots.txt — ${siteUrl}
# ${siteUrl.replace('https://', '')}
# Центр восстановления бытовой техники

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /cart/
Disallow: /master/
Disallow: /status/
Disallow: /*.json$
Disallow: /*?*

Sitemap: ${siteUrl}/sitemap.xml

# Yandex — медленный crawl, Host директива
User-agent: Yandex
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /cart/
Disallow: /master/
Disallow: /status/
Disallow: /*.json$
Crawl-delay: 1
Host: ${siteUrl.replace('https://', '')}

# Google — без crawl-delay
User-agent: Googlebot
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /cart/
Disallow: /master/
Disallow: /status/
`;

  return new Response(robots, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
