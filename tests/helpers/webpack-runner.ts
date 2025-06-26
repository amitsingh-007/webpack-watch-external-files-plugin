import { EventEmitter } from 'node:events';
import { type Compiler, type Watching, webpack } from 'webpack';
import getWebpackConfig from '../constants/webpack-test.config';
import { type IPlugin } from '../types';

export const EVENTS = {
  EMIT: 'emit',
} as const;

class WebpackRunner {
  // eslint-disable-next-line unicorn/prefer-event-target
  private readonly eventEmitter = new EventEmitter();
  private readonly compiler: Compiler;
  private readonly watching: Watching;
  private emitCount = 0;

  constructor(type: IPlugin) {
    const config = getWebpackConfig(type);
    this.compiler = webpack(config);
    this.watching = this.compiler.watch({}, (error, stats) => {
      if (error) throw new Error(error.message);
      if (stats?.hasErrors()) throw new Error(stats.toString());
      console.log('Webpack watching...');
    });
    this.addListeners();
  }

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
      } catch (error) {
        reject(error);
      }
    });

  private readonly addListeners = () => {
    this.compiler.hooks.afterEmit.tap('test', () => {
      this.eventEmitter.emit(EVENTS.EMIT, ++this.emitCount);
    });
  };

  private readonly closeWatching = async () =>
    new Promise<void>((resolve, reject) => {
      this.watching.close((closeError) => {
        console.log('Watching ended.');
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
        console.log('Compiler ended.');
        if (closeError) {
          reject(closeError);
        } else {
          resolve();
        }
      });
    });
}

export default WebpackRunner;
