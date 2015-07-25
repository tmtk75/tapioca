var path = require("path");
var webpack = require("webpack");

module.exports = {
  entry: {
    app: './js/entry.js',
  },
  output: {
    filename: 'bundle.js',
    path: 'assets',
    publicPath: 'http://localhost:8090/assets',
    filename: "bundle.[name].js",
  },
  module: {
    loaders: [
      { test: /\.css$/,  loader: "style!css" },
      { test: /\.styl$/, loader: "style-loader!css-loader!stylus-loader" },
      { test: /\.js?$/,  loader: 'babel-loader', exclude: /node_moduels/ },
    ]
  },
  externals: {
    'jquery': 'jQuery',
    'baconjs': 'Bacon',
    'react': 'React',
    'moment': 'moment',
    'lodash': '_',
    'immutable': 'Immutable',
  },
  resolve: {
    modulesDirectories: [
      ".",
    ],
    //root: [path.join(__dirname, "bower_components")],
    //extensions: ["", ".js"],
  },
  plugins: [
    //new webpack.ResolverPlugin(
    //  new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
    //),
    //new webpack.optimize.UglifyJsPlugin({
    //  compress: {warnings: false},
    //  mangle: {except: ['$super', '$', 'exports', 'require']}
    //}),
  ]
}
