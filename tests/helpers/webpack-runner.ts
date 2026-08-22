import { EventEmitter } from 'node:events';
import { type Compiler, type Watching, webpack } from 'webpack';
import getWebpackConfig from '../constants/webpack-test.config';

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
    new Promise((resolve) => {
      this.eventEmitter.once('emit', resolve);
    });

  cleanup = async (): Promise<void> => {
    this.eventEmitter.removeAllListeners('emit');
    await Promise.all([this.closeWatching(), this.closeCompiler()]);
  };

  private readonly closeWatching = async () =>
    new Promise<void>((resolve, reject) => {
      this.watching.close((closeError) => {
        if (closeError) {
          reject(closeError);
        } else {
          resolve();
        }
      });
    });

  private readonly closeCompiler = async () =>
    new Promise<void>((resolve, reject) => {
      this.compiler.close((closeError) => {
        if (closeError) {
          reject(closeError);
        } else {
          resolve();
        }
      });
    });
}

export default WebpackRunner;
