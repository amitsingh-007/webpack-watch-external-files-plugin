import glob from 'glob';
import { resolve } from 'path';
import { Compiler } from 'webpack';
import { PLUGIN_NAME } from './constants/plugin';
import { IOptions } from './types/plugin';

const getExternalFilesToWatch = (files: string[]) => {
  const { filesToWatch, filesToExclude } = files.reduce<{
    filesToWatch: string[];
    filesToExclude: string[];
  }>(
    (obj, pattern) => {
      if (pattern[0] !== '!') {
        const files = glob.sync(pattern);
        obj.filesToWatch.push(...files);
      } else {
        const files = glob.sync(pattern.substr(1));
        obj.filesToExclude.push(...files);
      }
      return obj;
    },
    {
      filesToWatch: [],
      filesToExclude: [],
    }
  );

  const resolvedFilesToWatch = Array.from(
    new Set(filesToWatch.filter((file) => !filesToExclude.includes(file)))
  ).map((file) => resolve(file));

  return resolvedFilesToWatch;
};

class WatchExternalFilesPlugin {
  private files: string[];
  constructor({ files }: IOptions) {
    //TODO: add validation
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
