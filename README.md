<div align="center">
  <h1>Webpack Watch External Files Plugin</h1>
  <p>A Webpack Plugin having zero dependencies which allows you to watch external files which are not included in the webpack build. It triggers a webpack build if any external file changes.</p>
</div>

## Install

```bash
npm install webpack-watch-external-files-plugin --save-dev
# or
yarn add webpack-watch-external-files-plugin --dev
```

## Usage

```js
// webpack.config.js:

const WatchExternalFilesPlugin = require("webpack-watch-external-files-plugin");

module.exports = {
  plugins: [
    new WatchExternalFilesPlugin({
      files: ["/path/**/*.js", "/path/tofile.txt", "!./src/**/*.json"],
    }),
  ],
};
```

# Options

```js
new FileManagerPlugin({
  files: [],
});
```

**Options**

- files[`list<string>`] - a list of files or glob patterns
