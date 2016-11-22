'use strict';
import fs from 'fs';
import path from 'path'
import mkdirp from 'mkdirp';
import _ from 'lodash';
var ignore = require('gulp-ignore');
import through from 'through-gulp';
var loadData = require('../../libs/load_data');

import ignoreTemplate  from '../../libs/ignore_template'

function add_context(context_root) {
    return through(
        function (file, encoding, callback) {
            const data = loadData(file.relative, context_root)
            if (data == null) {
                const parsed = path.parse(path.normalize(file.relative));
                const name = path.join(context_root, parsed.dir, parsed.name)
                const json_file_path = path.format({name, ext: '.json'})
                mkdirp(path.parse(json_file_path).dir, (err) => {
                    if (!err) {
                        fs.writeFile(json_file_path, "{}")
                    }
                })
            }
            this.push(file);
            callback()
        })
}

export default function (gulp, config) {
    const TEMPLATE_ROOT = config.project.template.root;
    const APP_ROOT = config.project.app_root;

    const CONTEXT_ROOT = config.project.template.context;


    gulp.task('templates:add_context', function () {
        return gulp.src(TEMPLATE_ROOT + '/**/*.{jinja2,html,j2}', {base: TEMPLATE_ROOT})
            .pipe(ignore.exclude(ignoreTemplate))
            .pipe(add_context(CONTEXT_ROOT))
    })

}
