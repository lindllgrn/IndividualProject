const webpack = require('webpack');
const path = require('path');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const basePlugins = require('./base-plugins');
const { outdir, IS_PRODUCTION } = require('../constants');

/**
 *
 * @param {webpack.Configuration} config
 * @param {boolean} [includeDefaultPlugins=true]
 * @returns {webpack.Configuration}
 */
module.exports = function setDefaults(config, includeDefaultPlugins = true) {
  /** @type webpack.Configuration */
  if (includeDefaultPlugins) {
    config.plugins = basePlugins(config.name).concat(config.plugins || []);
  }
  config.node = {
    __dirname: false,
    __filename: true,
    fs: 'empty',
    net: 'empty',
    child_process: 'empty',
    ...(config.node || {}),
  };

  config.optimization = config.optimization || {};
  if (IS_PRODUCTION) {
    config.optimization.minimize = true;
    config.optimization.minimizer = [
      new TerserJSPlugin({ terserOptions: { mangle: false, keep_classnames: true } }), // mangle false else mysql blow ups with "PROTOCOL_INCORRECT_PACKET_SEQUENCE"
      new OptimizeCSSAssetsPlugin({})
    ]
  } else {
    config.optimization.minimize = false;
    config.optimization.minimizer = undefined;
  }
  config.devtool = !IS_PRODUCTION ? 'source-map' : false;
  config.mode = IS_PRODUCTION ? 'production' : 'development';
  config.output = config.output || {};
  config.output.path = config.output.path || outdir;
  config.output.devtoolModuleFilenameTemplate = (info) => 'webpack:///'+path.relative(path.resolve(config.output.path || outdir, '..'), info.absoluteResourcePath),
  config.stats = 'minimal';
  config.node = {
    global: false,
  };
  config.externals = {
    vscode: 'commonjs vscode',
    ...(config.externals || {})
  }
  return config;
}