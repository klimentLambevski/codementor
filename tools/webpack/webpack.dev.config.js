let webpack = require('webpack');
let path = require('path');
let wpConfig = require('./webpack.config.js');

import {paths} from '../config';

wpConfig.devtool = 'eval-source-map';

wpConfig.output = {
  filename: '[name].bundle.js',
  publicPath: '/',
  path: paths.client
};

wpConfig.plugins = wpConfig.plugins.concat([
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development')
  }),
  // Adds webpack HMR support. It act's like livereload,
  // reloading page after webpack rebuilt modules.
  // It also updates stylesheets and inline assets without page reloading.
  new webpack.HotModuleReplacementPlugin()
]);

module.exports = wpConfig;
