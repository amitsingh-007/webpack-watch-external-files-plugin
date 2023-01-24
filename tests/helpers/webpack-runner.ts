import { EventEmitter } from 'events';
import { Compiler, Watching, webpack } from 'webpack';
import getWebpackConfig from '../constants/webpack-test.config';
import { IPlugin } from '../types';

export const EVENTS = {
  EMIT: 'emit',
} as const;

class WebpackRunner {
  private readonly eventEmitter = new EventEmitter();
  private readonly compiler: Compiler;
  private readonly watching: Watching;
  private emitCount = 0;

  constructor(type: IPlugin) {
    const config = getWebpackConfig(type);
    this.compiler = webpack(config);
    this.watching = this.compiler.watch({}, (err, stats) => {
      if (err) throw new Error(err.message);
      if (stats?.hasErrors()) throw new Error(stats.toString());
      console.log('Webpack watching...');
    });
    this.addListeners();
  }

  private addListeners = () => {
    this.compiler.hooks.afterEmit.tap('test', () => {
      this.eventEmitter.emit(EVENTS.EMIT, ++this.emitCount);
    });
  };

  private closeWatching = async () =>
    new Promise<void>((resolve, reject) => {
      this.watching.close((closeErr) => {
        console.log('Watching ended.');
        return closeErr ? reject(closeErr) : resolve();
      });
    });

  private closeCompiler = async () =>
    new Promise<void>((resolve, reject) => {
      this.compiler.close((closeErr) => {
        console.log('Compiler ended.');
        return closeErr ? reject(closeErr) : resolve();
      });
    });

  waitForEmit = async () =>
    new Promise((resolve) => {
      this.eventEmitter.once(EVENTS.EMIT, resolve);
    });

  cleanup = async (): Promise<void> =>
    new Promise(async (resolve, reject) => {
      try {
        this.eventEmitter.removeAllListeners(EVENTS.EMIT);
        await Promise.all([this.closeWatching(), this.closeCompiler()]);
        console.log('Cleanup complete.');
        resolve();
      } catch (e) {
        reject(e);
      }
    });
}

export default WebpackRunner;
