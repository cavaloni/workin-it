const path = require('path');

const webpack = require('webpack');

const context = path.resolve(__dirname, 'js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

require('babel-core/register')({
    presets: ['es2015', 'react'],
});

require.extensions['.scss'] = () => {};
require.extensions['.css'] = () => {};

const VENDOR_LIBS = ['react', 'react-dom', 'react-redux', 'redux', 'rxjs', 'lodash'];

module.exports = {
    context,
    entry: {
        bundle: [
            'babel-polyfill', path.resolve(__dirname, 'js/index.jsx'),
        ],
        vendor: VENDOR_LIBS,
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].[hash].js',
        publicPath: '/',
    },
    plugins: [
        new ExtractTextPlugin('index.css'),
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: path.resolve(__dirname, 'index.html'),
        }),
        new webpack
        .optimize
        .CommonsChunkPlugin({
            names: ['vendor', 'manifest'],
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
        }),
    ],
    resolve: {
        extensions: [
            '.js', '.jsx', '.css',
        ],
        modules: ['node_modules'],
    },
    devtool: 'cheap-module-source-map',
    module: {
        rules: [{
            include: path.resolve(__dirname, 'assets'),
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                loader: ['css-loader'],
            }),
            test: /\.css$/,
        }, {
            test: /\.css$/,
            include: path.resolve(__dirname, 'js'),
            exclude: /(node_modules)/,
            use: [
                'style-loader', 'css-loader?importLoader=1&modules&localIdentName=[path]___[name]__[local]___[has' +
                'h:base64:5]',
            ],
        }, {

            test: /\.jpe?g$|\.gif$|\.png$|\.svg$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 40000,
                },
            }, {
                loader: 'image-webpack-loader',
                query: {
                    interlaced: false,
                    pngquant: {
                        progressive: true,
                        optimizationLevel: 1,
                        quality: '90',
                        speed: 4,
                    },
                    mozjpeg: {
                        progressive: true,
                        optimizationLevel: 1,
                        quality: '90',
                        speed: 4,
                    },

                },
            }],
        }, {
            test: /\.(js|jsx)$/,
            include: path.resolve(__dirname, 'js'),
            use: {
                loader: 'babel-loader',
                query: {
                    plugins: [
                        'transform-react-jsx', ['react-css-modules', {
                            context,
                        }],
                    ],
                },
            },
        }],
    },
};
