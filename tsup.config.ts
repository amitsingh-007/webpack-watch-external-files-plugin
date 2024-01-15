import { defineConfig } from 'tsup';

export default defineConfig({
  name: 'Build',
  dts: true,
  minify: true,
  treeshake: true,
  clean: true,
  entry: ['src/index.ts'],
  target: 'node16',
  env: {
    NODE_ENV: 'production',
  },
});
