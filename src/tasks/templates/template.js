'use strict';
import _ from "lodash";
import gutil from "gulp-util";

import debug from "gulp-debug";
import ignore from "gulp-ignore";
import plumber from "gulp-plumber";
import data from "gulp-data";
import path from "path";
import nunjucksRender from "gulp-nunjucks-render";

import loadData from "../../libs/load_data";
import ignoreTemplate from "../../libs/ignore_template";


export default function (gulp, config) {
    const browserSyncOptions = config.browserSync;
    const browserSync = browserSyncOptions.browserSync;

    const template_options = config.template;

    const TEMPLATE_ROOT = config.project.template.root;
    const CONTEXT_ROOT = config.project.template.context;
    const TEMPLATE_DIST_ROOT = _.get(config, 'project.template.dist');

    const getJsonData = function (file) {
        const parsed = path.parse(path.normalize(file.path));
        let dirname = _.slice(parsed.dir, path.normalize(TEMPLATE_ROOT).length).join('');
        dirname = dirname.replace('_jinja', '')
        const name = path.join(dirname, parsed.name);

        return loadData(name, CONTEXT_ROOT);
    };


    function errorHandler(err) {
        if (err) {
            // TODO bs-fullscreen
        }
        gutil.log(
            gutil.colors.cyan('Plumber') + gutil.colors.red(' found unhandled error:\n'),
            err.toString()
        );

    }

    gulp.task('templates:jinja2', function () {
        return gulp.src(TEMPLATE_ROOT + '/**/*.{jinja2,html,j2}', {base: TEMPLATE_ROOT})
            .pipe(ignore.exclude(ignoreTemplate))
            .pipe(debug({title: "template"}))
            .pipe(data(getJsonData))
            .pipe(plumber(errorHandler))
            .pipe(nunjucksRender(template_options))
            .pipe(plumber.stop())
            .pipe(gulp.dest(TEMPLATE_DIST_ROOT))
            .pipe(browserSync.stream())
    });
}
