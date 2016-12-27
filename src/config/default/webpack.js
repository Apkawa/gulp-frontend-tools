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
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var envs = require('../../libs/envs');

import webpackEntry from "../../libs/webpack_entry";

const eslint_options = {
    configFile: '{{ project.eslint.configFile }}',

    preLoaders: [
        {test: /\.jsx?$/, loaders: ['eslint-loader', 'source-map-loader'], exclude: /node_modules/}
    ],
}

var webpack_options = {
    cache: true,
    debug: true,
    watch: false,
    devtool: 'source-map',
    devServer: {
        hot: true,
    },
    entry: {},
    output: {
        path: "{{ project.path.dist.js }}",
        filename: '[name].js',
        publicPath: '{{ project.webpack.publicPath }}',
        sourceMapFilename: `../_maps/[file].map`
    },
    module: {
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
                loaders: ["style", "css", "sass", "import-glob"]
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
            '{{ project.project_root }}',
            "{{ project.path.node_modules }}",
        ],
        extensions: ['', '.js', '.jsx'],
        alias: {}
    }
    ,
    plugins: [
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            _: 'lodash',
            Promise: 'es6-promise',
            // fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        }),
        new StringReplacePlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons',
            filename: 'commons.js',
            minChunks: 3,
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    node: {
        fs: "empty",
        file: 'empty',
        directory: 'empty',
        debug: 'empty',
        net: 'empty'
    }
};


var webpack_options_production = _.assign({}, _.cloneDeep(webpack_options), {
    cache: false,
    debug: false,
    watch: false,
    devtool: null,
    plugins: [
        ...webpack_options.plugins,
        //https://habrahabr.ru/post/308926/
        new LodashModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            beautify: false,
            comments: false,
            sourceMap: true,
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        }),
    ],
});

if (envs.is_production) {
    webpack_options = webpack_options_production
}


function getOptions(config) {
    const {webpack:{options:webpack_options}} = config;
    const project_webpack = _.get(config, 'project.webpack', {})
    const defines = _.get(config, 'project.webpack.defines', {});

    webpack_options.entry = webpackEntry(config);
    if (project_webpack.hot && envs.debug) {
        webpack_options.entry = _.fromPairs(_.map(webpack_options.entry,
            (f, n) => [n, [
                f,
                'webpack/hot/dev-server',
                'webpack-hot-middleware/client',
            ]]
            )
        );
    }

    if (project_webpack.extract_css) {
        let {filename, options} = project_webpack.extract_css
        webpack_options.module.loaders = _.map(webpack_options.module.loaders, (o) => {
            const {test, loaders} = o
            if (test.test('.css') || test.test('.less') || test.test('.scss')) {
                return {
                    test, loader: ExtractTextPlugin.extract(
                        "style-loader",
                        _.map(_.slice(loaders, 1), (l) => `${l}-loader`)
                    ),
                }
            }
            return o
        })

        webpack_options.plugins.push(new ExtractTextPlugin(filename, options))
    }


    /*    webpack_options.resolve.modulesDirectories = [
     ...webpack_options.resolve.modulesDirectories,
     ...extra_modules,
     ]*/

    webpack_options.plugins.unshift(
        new webpack.DefinePlugin(defines),
    )
    if (project_webpack.eslint) {
        webpack_options.eslint = {configFile: eslint_options.configFile}
        webpack_options.module.preLoaders = eslint_options.preLoaders;
    }
    return webpack_options
}


module.exports = {
    getOptions,
    options: webpack_options,
};
