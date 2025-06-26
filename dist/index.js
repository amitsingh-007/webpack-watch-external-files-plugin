import { resolve } from 'path';
import { globSync } from 'glob';

// src/index.ts

// src/constants/plugin.ts
var PLUGIN_NAME = "WebpackWatchExternalFilesPlugin";

// src/index.ts
var getExternalFilesToWatch = (files) => {
  const { filesToWatch, filesToExclude } = files.reduce(
    (acc, pattern) => {
      if (pattern.startsWith("!")) {
        const files2 = globSync(pattern.slice(1));
        acc.filesToExclude.push(...files2);
      } else {
        const files2 = globSync(pattern);
        acc.filesToWatch.push(...files2);
      }
      return acc;
    },
    {
      filesToWatch: [],
      filesToExclude: []
    }
  );
  const watchedFilesSet = new Set(
    filesToWatch.filter((file) => !filesToExclude.includes(file))
  );
  const resolvedFilesToWatch = [...watchedFilesSet].map(
    (file) => resolve(file)
  );
  return resolvedFilesToWatch;
};
var WatchExternalFilesPlugin = class {
  files;
  constructor({ files }) {
    this.files = files;
  }
  apply(compiler) {
    const logger = compiler.getInfrastructureLogger(PLUGIN_NAME);
    compiler.hooks.initialize.tap(PLUGIN_NAME, () => {
      logger.info("Watching External Files:", this.files);
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
};
var index_default = WatchExternalFilesPlugin;

export { index_default as default };
