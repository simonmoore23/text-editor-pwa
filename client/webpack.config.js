const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

// TODO: Add and configure workbox plugins for a service worker and manifest file.
// TODO: Add CSS loaders and babel to webpack.

module.exports = () => {
  return {
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js',
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      //HtmlWebpackPlugin will generate the HTML file and inject the bundles
      new HtmlWebpackPlugin({
        template: './index.html',
        title: 'Text Editor',
      }),
      //injects custom SW for precaching
      new InjectManifest({
        swSrc: './src-sw.js',
        swDest: 'src-sw.js',
      }),
      // create manifest.json
      new WebpackPwaManifest({
        fingerprints: false,
        name: 'Text Editor',
        short_name: 'JATE',
        description: 'note taking PWA',
        background_color: '#272822',
        theme_color: '#272822',
        start_url: '/',
        publicPath: '/',
        icons: [
          {
            src: path.resolve('src/images/logo.png'),
            sizes: [96, 128, 192, 256, 384, 512],
            destination: path.join('assets', 'icons'),
          },
        ],
      }),
    ],

    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          //Load Babel to use ES6
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
                // /Compile object rest and spread to ES5
                '@babel/plugin-proposal-object-rest-spread',
                //all of the babel helpers will reference the module @babel/runtime instead of being attached to each file to avoid duplication across compiled output
                '@babel/transform-runtime',
              ],
            },
          },
        },
      ],
    },
  };
};