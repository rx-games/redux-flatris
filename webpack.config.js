const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const path = require('path');

module.exports = {
  entry: {
    "index": "./src/index.js",
  },
  output: {
    path: path.join(__dirname,'build'),
    filename: "[name].js"
  },
  plugins: [new UglifyJSPlugin()]
};
