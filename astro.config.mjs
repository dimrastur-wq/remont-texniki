// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://master-tehniki74.store',
  trailingSlash: 'always',
  output: 'server',
  adapter: node({ mode: 'middleware' }),
});
