// eslint-disable-next-line unicorn/prefer-node-protocol
import { resolve } from 'path';
import { globSync } from 'glob';
import { type Compiler } from 'webpack';
import { PLUGIN_NAME } from './constants/plugin';
import { type IOptions } from './types/plugin';

const getExternalFilesToWatch = (files: string[]) => {
  const { filesToWatch, filesToExclude } = files.reduce<{
    filesToWatch: string[];
    filesToExclude: string[];
  }>(
    (acc, pattern) => {
      if (pattern.startsWith('!')) {
        const files = globSync(pattern.slice(1));
        acc.filesToExclude.push(...files);
      } else {
        const files = globSync(pattern);
        acc.filesToWatch.push(...files);
      }

      return acc;
    },
    {
      filesToWatch: [],
      filesToExclude: [],
    }
  );

  const watchedFilesSet = new Set(
    filesToWatch.filter((file) => !filesToExclude.includes(file))
  );
  const resolvedFilesToWatch = [...watchedFilesSet].map((file) =>
    resolve(file)
  );

  return resolvedFilesToWatch;
};

class WatchExternalFilesPlugin {
  private readonly files: string[];
  constructor({ files }: IOptions) {
    // TODO: add validation
    this.files = files;
  }

  apply(compiler: Compiler) {
    const logger = compiler.getInfrastructureLogger(PLUGIN_NAME);
    compiler.hooks.initialize.tap(PLUGIN_NAME, () => {
      logger.info('Watching External Files:', this.files);
    });
    compiler.hooks.afterCompile.tapAsync(
      PLUGIN_NAME,
      (compilation, callback) => {
        const filesToWatch = getExternalFilesToWatch(this.files);
        filesToWatch.map((file) => compilation.fileDependencies.add(file));
        callback();
      }
    );
  }
}

export default WatchExternalFilesPlugin;
