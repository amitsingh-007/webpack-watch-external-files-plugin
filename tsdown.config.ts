import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: 'esm',
  platform: 'node',
  target: 'node22',
  // platform: 'node' would otherwise force .mjs/.d.mts; this keeps the
  // published filenames as dist/index.js + dist/index.d.ts.
  fixedExtension: false,
  dts: true,
  clean: true,
  publint: true,
});
