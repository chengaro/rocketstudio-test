const path = require('path')

const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin') //installed via npm
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const buildPath = path.resolve(__dirname, 'dist')

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    filename: '[name].[hash:20].js',
    path: buildPath
  },
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true
            }
          }
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: false
            }
          },
          {
            loader: 'css-loader',
            options: {}
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              config: {
                path: `${__dirname}/postcss.config.js`,
                ctx: {
                  env: 'production'
                }
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {}
          }
        ]
      },
      {
        // Load all images as base64 encoding if they are smaller than 8192 bytes
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'images/[name].[hash:20].[ext]',
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.svg$/,
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]'
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: true,
      minify: true
    }),
    // new FaviconsWebpackPlugin({
    //     // Your source logo
    //     logo: './src/assets/icon.png',
    //     // The prefix for all image files (might be a folder or a name)
    //     prefix: 'icons-[hash]/',
    //     // Generate a cache file with control hashes and
    //     // don't rebuild the favicons until those hashes change
    //     persistentCache: true,
    //     // Inject the html into the html-webpack-plugin
    //     inject: true,
    //     // favicon background color (see https://github.com/haydenbleasel/favicons#usage)
    //     background: '#fff',
    //     // favicon app title (see https://github.com/haydenbleasel/favicons#usage)
    //     title: 'rs-test',

    //     // which icons should be generated (see https://github.com/haydenbleasel/favicons#usage)
    //     icons: {
    //         android: true,
    //         appleIcon: true,
    //         appleStartup: true,
    //         coast: false,
    //         favicons: true,
    //         firefox: true,
    //         opengraph: false,
    //         twitter: false,
    //         yandex: false,
    //         windows: false
    //     }
    // }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css'
    })
    // new OptimizeCssAssetsPlugin({
    //   cssProcessor: require('cssnano'),
    //   cssProcessorOptions: {
    //     map: {
    //       inline: false
    //     },
    //     discardComments: {
    //       removeAll: true
    //     },
    //     discardUnused: false
    //   },
    //   canPrint: true
    // })
  ]
}
