/**
 * Created by apkawa on 28.08.16.
 */

'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _ = require('lodash');
var path = require('path');
var webpack = require('webpack');
var StringReplacePlugin = require('string-replace-webpack-plugin');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
var CompressionPlugin = require("compression-webpack-plugin");

var envs = require('../../libs/envs');

var webpack_options = {
    cache: true,
    watch: false,
    devtool: 'source-map',
    devServer: {
        hot: true
    },
    entry: {
        _dev: ['webpack/hot/dev-server', 'webpack-hot-middleware/client']
    },
    output: {
        path: "{{ project.path.dist.js }}",
        filename: '[name].js',
        publicPath: '{{ project.webpack.publicPath }}',
        sourceMapFilename: '_maps/[file].map'
    },
    module: {
        loaders: [{
            enforce: 'pre',
            test: /\.jsx?$/,
            loaders: ['eslint-loader?configFile={{ project.eslint.configFile }}', 'source-map-loader'],
            exclude: /node_modules/
        }, {
            test: /\.jsx?$/,
            exclude: [/node_modules/, /vendors/],
            loader: 'babel-loader',
            query: {
                presets: ['react', 'es2015'],
                plugins: ['transform-decorators-legacy', "transform-class-properties", "transform-object-rest-spread"]
            }
        }, {
            test: /\.css$/,
            loaders: ['style', 'css']
        }, {
            test: /\.less$/,
            loaders: ["style", "css", "less"]
        }, {
            test: /\.scss$/,
            loaders: ["style", "css", "sass"]
        }, { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=100000&mimetype=application/font-woff' }, { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=100000&mimetype=application/octet-stream' }, { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' }, { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=100000&mimetype=image/svg+xml' }, { test: /\.(png|jpe?g|gif)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=100000' }, { test: /\.swig$/, loader: "html" }, { test: /\.json$/, loader: "json" }],
        noParse: /\.min\.js/
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {},
        modules: ["{{ project.path.app.js }}", "{{ project.app_root }}", "{{ project.project_root }}", "{{ project.path.node_modules }}", "{{ envs.root }}"]
    },

    plugins: [new webpack.DefinePlugin({
        'STATIC_ROOT': '"{{ project.static_root }}"'
    }), new webpack.ProvidePlugin({
        jQuery: 'jquery',
        $: 'jquery',
        _: 'lodash'
    }),
    //new StringReplacePlugin(),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'commons',
        filename: 'commons.js',
        minChunks: 3
    }), new webpack.HotModuleReplacementPlugin()],
    node: {
        fs: "empty",
        file: 'empty',
        directory: 'empty',
        debug: 'empty'
    }
};

var webpack_options_production = _.assign({}, _.cloneDeep(webpack_options), {
    cache: false,
    watch: false,
    devtool: null,
    plugins: [].concat(_toConsumableArray(webpack_options.plugins), [

    //https://habrahabr.ru/post/308926/
    new LodashModuleReplacementPlugin(), new webpack.NoErrorsPlugin(), new webpack.optimize.DedupePlugin(), new webpack.optimize.OccurrenceOrderPlugin(), new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        beautify: false,
        comments: false,
        sourceMap: true,
        compress: {
            warnings: false,
            drop_console: true,
            unsafe: true
        }
    }), new CompressionPlugin({
        asset: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.js$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
    })])
});

if (envs.is_production) {
    webpack_options = webpack_options_production;
}

module.exports = webpack_options;