import { defineConfig } from 'tsup';

export default defineConfig({
  name: 'Build',
  dts: true,
  minify: true,
  format: ['cjs', 'esm'],
  legacyOutput: true,
  treeshake: true,
  clean: true,
  entry: ['src/index.ts'],
  minifyWhitespace: true,
  target: 'node14',
  env: {
    NODE_ENV: 'production',
  },
});
