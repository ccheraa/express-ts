var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: './src/app/app.ts',
  target: 'node',
  output: {
    path: path.join(__dirname, 'output/dist'),
    filename: 'app.js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader'
      },
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".webpack.js", ".web.js", ".js", "."],
  },
  plugins: [new webpack.optimize.UglifyJsPlugin()],
  externals: nodeModules
}