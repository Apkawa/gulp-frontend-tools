/**
 * Created by apkawa on 28.08.16.
 */

'use strict';
var _ = require('lodash');
var path = require('path');
var webpack = require('webpack');
var StringReplacePlugin = require('string-replace-webpack-plugin');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
var CompressionPlugin = require("compression-webpack-plugin");

var envs = require('../../libs/envs');


var webpack_options = {
    cache: true,
    debug: true,
    watch: false,
    devtool: 'source-map',
    devServer: {
        hot: false,
    },
    entry: {},
    output: {
        path: "{{ project.path.dist.js }}",
        filename: '[name].js',
        sourceMapFilename: 'source_maps/[file].map'
    },
    eslint: {
        configFile: '{{ envs.root }}/.eslintrc'
    },
    module: {
        preLoaders: [
            {test: /\.jsx?$/, loader: 'eslint-loader', exclude: /node_modules/}
        ],
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/, /vendors/],
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015'],
                    plugins: [
                        'transform-decorators-legacy',
                        "transform-class-properties",
                        "transform-object-rest-spread",
                    ],
                }
            },
            {
                test: /\.css$/,
                loaders: ['style', 'css']
            },
            {
                test: /\.less$/,
                loaders: ["style", "css", "less"]
            },
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            },

            {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=100000&mimetype=application/font-woff'},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=100000&mimetype=application/octet-stream'},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=100000&mimetype=image/svg+xml'},
            {test: /\.(png|jpe?g|gif)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=100000'},
            {test: /\.swig$/, loader: "html"},
            {test: /\.json$/, loader: "json"},
        ],
        noParse: /\.min\.js/
    },
    resolve: {
        root: [],
        modulesDirectories: [
            "{{ project.path.app.js }}",
            "{{ project.app_root }}",
            "{{ project.project_root }}/",
            path.join(envs.root, 'node_modules'),
            envs.root,
        ],
        extensions: ['', '.js', '.jsx', '.json'],
        alias: {}
    }
    ,
    plugins: [
        new webpack.DefinePlugin({
            'PROJECT_NAME': '"{{ envs.project }}"',
            'STATIC_ROOT': '"{{ project.static_root }}"',
        }),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            "window.jQuery": "jquery",
            _: 'lodash',
            u_: 'underscore'
        }),
        new StringReplacePlugin()
    ],
    node: {
        fs: "empty",
        file: 'empty',
        directory: 'empty',
        debug: 'empty'
    }
};


var webpack_options_production = _.assign({}, _.cloneDeep(webpack_options), {
    cache: false,
    debug: false,
    watch: false,
    devtool: null,
    plugins: webpack_options.plugins.concat([
        //https://habrahabr.ru/post/308926/
        new LodashModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            children: true,
            async: true,
        }),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            beautify: false,
            comments: false,
            sourceMap: false,
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        }),
    ]),
});

if (envs.is_production) {
    webpack_options = webpack_options_production
}

module.exports = webpack_options;