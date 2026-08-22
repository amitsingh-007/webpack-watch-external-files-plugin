import { globSync } from 'node:fs';
import { resolve } from 'node:path';
import { type Compiler } from 'webpack';

const PLUGIN_NAME = 'WebpackWatchExternalFilesPlugin';

interface IOptions {
  files: string[];
}

const isExcluded = (pattern: string) => pattern.startsWith('!');

const getExternalFilesToWatch = (patterns: string[]) => {
  const excluded = new Set(
    globSync(patterns.filter(isExcluded).map((pattern) => pattern.slice(1)))
  );

  return globSync(patterns.filter((pattern) => !isExcluded(pattern)))
    .filter((file) => !excluded.has(file))
    .map((file) => resolve(file));
};

class WatchExternalFilesPlugin {
  private readonly files: string[];
  constructor({ files }: IOptions) {
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
        for (const file of filesToWatch) {
          compilation.fileDependencies.add(file);
        }
        callback();
      }
    );
  }
}

export default WatchExternalFilesPlugin;
