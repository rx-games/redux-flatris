const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const webpack = require('webpack');
const path = require("path");

module.exports = {
  entry: {
    index: "./src/index.js"
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js/,
        loaders: "babel-loader"
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': { 
        'NODE_ENV': JSON.stringify('production') 
      } 
    }),
    new UglifyJSPlugin()
  ]
};
