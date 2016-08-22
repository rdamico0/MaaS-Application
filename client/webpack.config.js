var path = require("path");
module.exports = {
  entry: './index.js',

  output: {
    publicPath: '',
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015&presets[]=react' }
    ]
  }
}
console.log(module.exports.output.path);
