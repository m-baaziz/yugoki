const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');

const { NODE_ENV = 'production' } = process.env;

module.exports = {
  mode: NODE_ENV,
  entry: './src/lambda.ts',
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
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'handler.js',
    path: path.resolve(__dirname, 'deploy/lambda'),
  },
  externals: [nodeExternals()],
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'schema.graphql' }],
    }),
  ],
};
