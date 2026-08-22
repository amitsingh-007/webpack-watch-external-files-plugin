import { resolve } from 'node:path';
import { type Configuration } from 'webpack';
import WatchExternalFilesPlugin from '../../src';

const outputDir = resolve(import.meta.dirname, '..', 'dist');

const getPlugins = (withPlugin: boolean) => {
  const plugins: Configuration['plugins'] = [];
  if (!withPlugin) {
    return plugins;
  }

  plugins.push(
    new WatchExternalFilesPlugin({
      files: ['tests/files/external-file.js'],
    })
  );
  return plugins;
};

const getWebpackConfig = (withPlugin: boolean): Configuration => ({
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
  plugins: getPlugins(withPlugin),
});

export default getWebpackConfig;
