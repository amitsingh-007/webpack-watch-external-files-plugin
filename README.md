<div align="center">
  <h1>Webpack Watch External Files Plugin</h1>
  <p>A Webpack Plugin having zero dependencies which allows you to watch external files which are not included in the webpack build. It triggers a webpack build if any external file changes.</p>
</div>

![npm](https://img.shields.io/npm/v/webpack-watch-external-files-plugin) ![bundlephobia](https://badgen.net/bundlephobia/min/webpack-watch-external-files-plugin) [![Node.js Package](https://github.com/amitsingh-007/webpack-watch-external-files-plugin/actions/workflows/ci.yaml/badge.svg)](https://github.com/amitsingh-007/webpack-watch-external-files-plugin/actions/workflows/ci.yaml) ![node-lts](https://img.shields.io/node/v-lts/webpack-watch-external-files-plugin) ![NPM](https://img.shields.io/npm/l/webpack-watch-external-files-plugin)

## Install

```bash
npm install webpack-watch-external-files-plugin --save-dev
# or
yarn add webpack-watch-external-files-plugin --dev
```

## Usage

```js
// webpack.config.js:

const WatchExternalFilesPlugin = require('webpack-watch-external-files-plugin');

module.exports = {
  plugins: [
    new WatchExternalFilesPlugin({
      files: ['/path/**/*.js', '/path/tofile.txt', '!./src/**/*.json'],
    }),
  ],
};
```

# Options

```js
new WatchExternalFilesPlugin({
  files: [],
});
```

- files[`list<string>`] - a list of files or glob patterns
