import { CITIES, SERVICES } from '../data/services';

const siteUrl = 'https://master-tehniki74.store';

export async function GET() {
  const pages: { loc: string; changefreq: string; priority: string; lastmod?: string }[] = [];

  const today = new Date().toISOString().split('T')[0];

  pages.push({ loc: `${siteUrl}/`, changefreq: 'weekly', priority: '1.0', lastmod: today });
  pages.push({ loc: `${siteUrl}/zapchasti/`, changefreq: 'weekly', priority: '0.8' });
  pages.push({ loc: `${siteUrl}/tseny/`, changefreq: 'monthly', priority: '0.8' });
  pages.push({ loc: `${siteUrl}/b2b/`, changefreq: 'monthly', priority: '0.7' });
  pages.push({ loc: `${siteUrl}/admin/`, changefreq: 'monthly', priority: '0.3' });

  for (const city of Object.values(CITIES)) {
    pages.push({ loc: `${siteUrl}/${city.slug}/`, changefreq: 'weekly', priority: '0.9' });

    for (const service of Object.values(SERVICES)) {
      pages.push({ loc: `${siteUrl}/${city.slug}/${service.slug}/`, changefreq: 'monthly', priority: '0.8' });
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
${p.lastmod ? `    <lastmod>${p.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
