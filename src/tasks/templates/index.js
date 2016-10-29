import collect_filenames from "../../libs/collect_filenames";

var _ = require('lodash');
var rename = require("gulp-rename");
var nunjucksRender = require('gulp-nunjucks-render');

var path = require('path');
var data = require('gulp-data');
var browserSync = require('../browserSync');

export default function (gulp, config) {

    const DIST_ROOT = config.project.dist_root;
    const TEMPLATE_NAME = path.join(__dirname, '../../templates', 'index.j2')

    gulp.task('templates:index', function () {
        var filenames = _.keys(collect_filenames(DIST_ROOT, '/**/*.html'))
        return gulp.src(TEMPLATE_NAME)
            .pipe(data(function () {
                return {filenames: filenames}
            }))
            .pipe(nunjucksRender())
            .pipe(rename('index.html'))
            .pipe(gulp.dest(DIST_ROOT))
            .pipe(browserSync.stream())

    });

    gulp.task('templates', ['templates:jinja2', 'templates:index']);
}

