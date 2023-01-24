import { resolve } from 'path';
import { Configuration } from 'webpack';
import WatchExternalFilesPluginCJS from '../../dist';
import WatchExternalFilesPluginESM from '../../dist/esm';
import { IPlugin } from '../types';

const outputDir = resolve(__dirname, '..', 'dist');

const getPlugins = (type: IPlugin) => {
  const plugins: Configuration['plugins'] = [];
  if (type === 'NONE') {
    return plugins;
  }
  const WatchExternalFilesPlugin =
    type === 'CJS' ? WatchExternalFilesPluginCJS : WatchExternalFilesPluginESM;
  plugins.push(
    new WatchExternalFilesPlugin({
      files: ['tests/files/external-file.js'],
    })
  );
  return plugins;
};

const getWebpackConfig = (type: IPlugin): Configuration => ({
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
  plugins: getPlugins(type),
});

export default getWebpackConfig;
