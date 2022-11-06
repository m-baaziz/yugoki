const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/graphql-lambda.ts',
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
    path: path.resolve(__dirname, 'deploy/graphql-lambda'),
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'schema.graphql' }],
    }),
  ],
};
