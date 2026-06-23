// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://master-tehniki74.store',
  trailingSlash: 'always',
  output: 'server',
  adapter: node({ mode: 'middleware' }),
  vite: {
    server: {
      allowedHosts: ['master-tehniki74.ru', 'master-tehniki74.store', 'localhost'],
    },
  },
});
