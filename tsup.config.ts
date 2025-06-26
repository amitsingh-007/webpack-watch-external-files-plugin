import { defineConfig } from 'tsup';

export default defineConfig({
  name: 'Build',
  dts: true,
  treeshake: true,
  clean: true,
  entry: ['src/index.ts'],
  splitting: false,
  target: 'node20',
  format: 'esm',
  env: {
    NODE_ENV: 'production',
  },
});
