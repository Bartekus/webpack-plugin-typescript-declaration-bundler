const path = require('path');
const webpack = require('webpack');
const UglifyPlugin = require('uglifyjs-webpack-plugin');

const include = path.resolve(__dirname, 'src');
const libraryName = process.env.npm_package_name;

const minimize = process.env.npm_lifecycle_event.split('.')[1] === 'min';

module.exports = {
  mode: 'production',
  context: path.resolve(__dirname),
  devtool: 'source-map',
  entry: {
    [libraryName]: path.resolve('src/index.ts'),
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: "[name].js",
    libraryTarget: 'umd',
    library: libraryName,
    umdNamedDefine: true,
    globalObject: '(typeof global!=="undefined"?global:window)'
  },
  optimization: {
    minimize,
    minimizer: [
      new UglifyPlugin({
        uglifyOptions: {
          compress: true,
          mangle: true,
          output: {
            comments: false,
          },
        },
        sourceMap: false,
      })
    ],
    occurrenceOrder: true,
    namedModules: true,
    namedChunks: true,
    splitChunks: {
      minSize: 200 * 1024 * 1024,
    },
    removeAvailableModules: true,
    mergeDuplicateChunks: true,
    providedExports: true,
    usedExports: true,
    concatenateModules: true,
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'hex',
      hashDigestLength: 20
    }),
  ],

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        include
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        include
      },
    ]
  }
};
