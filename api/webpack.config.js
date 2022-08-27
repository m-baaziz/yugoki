const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');

const { NODE_ENV = 'production' } = process.env;

module.exports = {
  mode: NODE_ENV,
  watch: NODE_ENV === 'development',
  entry: './src/main.ts',
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
    filename: 'src/main.js',
    path: path.resolve(__dirname, 'build'),
  },
  externals: [nodeExternals()],
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'schema.graphql' }],
    }),
  ],
};
