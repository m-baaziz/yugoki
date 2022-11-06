const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/ws-lambda.ts',
  devtool: 'inline-source-map',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', 'mjs', '.js'],
    alias: {
      graphql$: path.resolve(__dirname, './node_modules/graphql/index.js'),
    },
  },
  output: {
    filename: 'handler.js',
    path: path.resolve(__dirname, 'deploy/ws-lambda'),
    libraryTarget: 'commonjs2',
  },
};
