import { Configuration } from "webpack";
import WatchExternalFilesPlugin from "../../index";
import { resolve } from "path";

const outputDir = resolve(__dirname, "..", "dist");

const getWebpackConfig = (usePlugin: boolean): Configuration => ({
  mode: "production",
  name: "test",
  entry: ["./tests/files/test-file.js"],
  output: {
    filename: () => `${Date.now()}.[name].js`,
    chunkFilename: "[name].[hash].js",
    path: outputDir,
  },
  resolve: {
    extensions: [".js"],
  },
  devtool: false,
  watchOptions: {
    ignored: "node_modules/**",
  },
  plugins: [
    usePlugin
      ? new WatchExternalFilesPlugin({
          files: ["tests/files/external-file.js"],
        })
      : null,
  ].filter(Boolean),
});

export default getWebpackConfig;
