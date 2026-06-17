import { CITIES, SERVICES, VILLAGES } from '../data/services';
import { BLOG_ARTICLES } from '../data/blog';
import { ERROR_CODES } from '../data/errors';
import { SERVICE_BRANDS, SEO_WORKS } from '../data/seo-pages';

const siteUrl = 'https://master-tehniki74.store';

export async function GET() {
  const pages: { loc: string; changefreq: string; priority: string; lastmod?: string }[] = [];

  const today = new Date().toISOString().split('T')[0];

  pages.push({ loc: `${siteUrl}/`, changefreq: 'weekly', priority: '1.0', lastmod: today });
  pages.push({ loc: `${siteUrl}/blog/`, changefreq: 'weekly', priority: '0.9' });
  pages.push({ loc: `${siteUrl}/b2b/`, changefreq: 'monthly', priority: '0.8' });
  pages.push({ loc: `${siteUrl}/zapchasti/`, changefreq: 'weekly', priority: '0.7' });
  pages.push({ loc: `${siteUrl}/kalkulator/`, changefreq: 'monthly', priority: '0.8' });
  pages.push({ loc: `${siteUrl}/status/`, changefreq: 'monthly', priority: '0.7' });
  pages.push({ loc: `${siteUrl}/baza-znanii/`, changefreq: 'weekly', priority: '0.8' });
  pages.push({ loc: `${siteUrl}/skupka/`, changefreq: 'weekly', priority: '0.8' });
  pages.push({ loc: `${siteUrl}/oshibki/`, changefreq: 'weekly', priority: '0.9' });
  pages.push({ loc: `${siteUrl}/remont-kofemashiny/`, changefreq: 'monthly', priority: '0.9', lastmod: today });
  pages.push({ loc: `${siteUrl}/karta-sajta/`, changefreq: 'weekly', priority: '0.6' });
  pages.push({ loc: `${siteUrl}/raboty/`, changefreq: 'weekly', priority: '0.7' });

  // SEO work pages
  for (const work of SEO_WORKS) {
    pages.push({ loc: `${siteUrl}/raboty/${work.slug}/`, changefreq: 'monthly', priority: '0.75' });
  }

  // Service pages (general)
  for (const service of Object.values(SERVICES)) {
    pages.push({ loc: `${siteUrl}/${service.slug}/`, changefreq: 'weekly', priority: '0.85' });
  }

  // Brand pages per service
  for (const [serviceSlug, brands] of Object.entries(SERVICE_BRANDS)) {
    for (const brand of brands) {
      pages.push({ loc: `${siteUrl}/${serviceSlug}/${brand.slug}/`, changefreq: 'weekly', priority: '0.8' });
    }
  }

  for (const err of ERROR_CODES) {
    pages.push({ loc: `${siteUrl}/oshibki/${err.slug}/`, changefreq: 'monthly', priority: '0.8', lastmod: today });
  }

  for (const village of Object.values(VILLAGES)) {
    pages.push({ loc: `${siteUrl}/posyolki/${village.slug}/`, changefreq: 'monthly', priority: '0.7' });
  }

  for (const city of Object.values(CITIES)) {
    pages.push({ loc: `${siteUrl}/skupka/${city.slug}/`, changefreq: 'weekly', priority: '0.8' });
  }

  for (const article of BLOG_ARTICLES) {
    pages.push({ loc: `${siteUrl}/blog/${article.slug}/`, changefreq: 'monthly', priority: '0.7', lastmod: article.date });
  }

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
    <priority>${p.priority}</priority>${p.lastmod ? `\n    <lastmod>${p.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
