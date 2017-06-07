import gutil from "gulp-util";
import webpack from "webpack";
import supportsColor from "supports-color";
import browserSync from "browser-sync";
import historyApiFallback from "connect-history-api-fallback";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import proxy from "http-proxy-middleware";

import {paths} from "../config";

export function gulpWebpackDist(cb) {
  const config = require('../webpack/webpack.dist.config.js');
  config.entry.app = [
    'babel-polyfill',
    paths.jsEntry
  ];

  webpack(config, (err, stats) => {
    if (err) {
      throw new gutil.PluginError("webpack", err);
    }

    gutil.log("[gulpWebpackDist]", stats.toString({
      colors: supportsColor,
      chunks: false,
      errorDetails: true
    }));

    cb();
  });
}

// todo: separate concerns
export function gulpWebpackServe() {
  const config = require('../webpack/webpack.dev.config.js');
  config.entry.app = [
    // this modules required to make HRM working
    // it responsible for all this webpack magic
    'webpack-hot-middleware/client?reload=true',
    'babel-polyfill',
    // application entry point
    paths.jsEntry
  ];

  let compiler = webpack(config);

  browserSync({
    port: process.env.PORT || 3000,
    open: false,
    server: {
      baseDir: paths.client,
      routes: {
        // "/node_modules": "node_modules",
        // "/themes": "node_modules/semantic-ui-css/themes",
        // "/fonts": "node_modules/font-awesome/fonts"
      }
    },
    middleware: [
      webpackDevMiddleware(compiler, {
        stats: {
          colors: supportsColor,
          chunks: false,
          modules: false
        },
        publicPath: config.output.publicPath
      }),
      webpackHotMiddleware(compiler),
      historyApiFallback(),
      proxy('/api', {
        target: 'http://localhost:3000',
        changeOrigin: true,
        onProxyReq: function (proxyReq, req, res) {
          // add custom header to request
          // proxyReq.setHeader('Host', 'http://localhost:8000');
          // or log the req
        }
      })
    ]
  });
}
