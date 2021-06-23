const path= require('path')
const HtmlWebpackPlugin= require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
//const { webpack } = require('webpack');

module.exports = {
    mode: 'development',
    entry: {
      vendor:[
          //require.resolve('./polyfills'),
          'react',
          'react-dom',
          'react-router-dom',
          './src/pages/class/Popup'
      ],
      //app: ['react-dev-utils/webpackHotDevClient', paths.appIndexJs]
      //dev: 'react-error-overlay',
      //'js/app': ['./src/index.js'],
      'js/app': ['./src/pages/app.jsx'],
      'login':['./src/pages/login.jsx'],
      'layout':['./src/pages/layout.jsx']
    },
    devtool:"eval-source-map",
    output: {
      path: path.resolve(__dirname, 'dist/'),
      publicPath: '/',
      filename: '[name].js',
      chunkFilename: '[name].chunk.js',
      clean:true
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: ['babel-loader'],
          exclude: /node_modules/,
        },
        {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"]
            //use:[MiniCssExtractPlugin.loader,'css-loader']
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          loader:'url-loader',
          options:{
            limit:7000,
          }
        }
      ],
    },
    
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: './views/index.html',
      }),
      new MiniCssExtractPlugin()
    ],

  };