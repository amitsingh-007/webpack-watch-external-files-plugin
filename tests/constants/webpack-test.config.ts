import { resolve } from 'node:path';
import { type Configuration } from 'webpack';
import WatchExternalFilesPlugin from '../../src';

const outputDir = resolve(import.meta.dirname, '..', 'dist');

const getWebpackConfig = (files: string[] | null): Configuration => ({
  mode: 'production',
  name: 'test',
  entry: ['./tests/files/test-file.js'],
  output: {
    filename: () => `${Date.now()}.[name].js`,
    chunkFilename: '[name].[hash].js',
    path: outputDir,
  },
  resolve: {
    extensions: ['.js'],
  },
  devtool: false,
  watchOptions: {
    ignored: 'node_modules/**',
  },
  plugins: files ? [new WatchExternalFilesPlugin({ files })] : [],
});

export default getWebpackConfig;
