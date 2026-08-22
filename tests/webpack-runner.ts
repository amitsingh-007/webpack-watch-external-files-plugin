import { EventEmitter } from 'node:events';
import { join } from 'node:path';
import {
  type Compiler,
  type Configuration,
  type Watching,
  webpack,
} from 'webpack';
import WatchExternalFilesPlugin from '../src';

const outputDir = join(import.meta.dirname, 'dist');

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

type Closable = { close(callback: (error?: Error | null) => void): void };

const close = async (closable: Closable) =>
  new Promise<void>((resolve, reject) => {
    closable.close((error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });

class WebpackRunner {
  private readonly eventEmitter = new EventEmitter();
  private readonly compiler: Compiler;
  private readonly watching: Watching;
  private emitCount = 0;

  constructor(files: string[] | null) {
    this.compiler = webpack(getWebpackConfig(files));
    // Compiler.watch() returns undefined if the compiler is already running.
    const watching = this.compiler.watch({}, (error, stats) => {
      if (error) throw new Error(error.message);
      if (stats?.hasErrors()) throw new Error(stats.toString());
    });
    if (!watching) {
      throw new Error('Failed to start the webpack watcher.');
    }

    this.watching = watching;
    this.compiler.hooks.afterEmit.tap('test', () => {
      this.eventEmitter.emit('emit', ++this.emitCount);
    });
  }

  waitForEmit = async () =>
    new Promise<number>((resolve) => {
      this.eventEmitter.once('emit', resolve);
    });

  cleanup = async (): Promise<void> => {
    this.eventEmitter.removeAllListeners('emit');
    await Promise.all([close(this.watching), close(this.compiler)]);
  };
}

export default WebpackRunner;
