const path = require('path')
//to use webpack
const webpack = require('webpack')
//to handle html from webpack
const HtmlWebPackPlugin = require("html-webpack-plugin")
//minimize styles files size on browser
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin =
require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
//to make server work offline
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
    entry: './src/client/index.js',
    //when use npm run build-prod ..this config file that will execute
    mode: 'production',
    optimization: {
        minimizer: [new TerserPlugin({}), new OptimizeCSSAssetsPlugin({})],
        },
    output: {
        libraryTarget: 'var',
        library: 'Client'
    },
    module: {
        rules: [
            {    //loader deal with js files to make browser understand any version of js"es6 ,es5 .."
                test: '/\.js$/',
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {    //css loader  that deal with scss &css ..convert scss to css in browser side &minimize style files size
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            }
        ]
    },
    plugins: [
        //html plugin
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
        }),
        //minimize styles plugin
        new MiniCssExtractPlugin({ filename: "[name].css" }),
        //service worker plugin
        new WorkboxPlugin.GenerateSW()
    ]
}
