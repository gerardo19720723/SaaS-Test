import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [svelte()],
  server: {
    host: '0.0.0.0',   // escucha en todas las interfaces
    port: 3000
  }
});