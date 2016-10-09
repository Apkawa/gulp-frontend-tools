'use strict';
import _ from 'lodash';

var path = require('path')
var gulp = require('gulp');
var buffer = require('vinyl-buffer');
var merge = require('merge-stream');

var spritesmith = require('gulp.spritesmith');

var size = require('gulp-size');

var options = require('../../options');

const SPRITE_ENTRIES = options.project.sprite;
const SCSS_ROOT = options.project.path.app.scss;


gulp.task('gen:sprite', function () {
    // Generate our spritesheet
    let streams = _.map(SPRITE_ENTRIES, (opt, name) => {
        let spriteRoot = _.get(opt, 'spriteRoot', path.dirname(opt.root));

        let imgPath = path.normalize(`${opt.imgRoot}/${name}.png`);
        let cssName = `_${name}.scss`;
        let suffix = _.get(opt, 'suffix', name + '-')
        var spriteData = gulp.src(`${opt.root}/${name}/**/*.png`)
            .pipe(spritesmith({
                imgName: path.basename(imgPath),
                imgPath: imgPath,
                cssName: cssName,
                cssVarMap: function (sprite) {
                    sprite.name = `${suffix}-${sprite.name}`;
                }
            }));

        // Pipe image stream through image optimizer and onto disk
        var imgStream = spriteData.img
        // DEV: We must buffer our stream into a Buffer for `imagemin`
            .pipe(buffer())
            .pipe(size({showFiles: true, gzip: true}))
            .pipe(gulp.dest(spriteRoot));

        // Pipe CSS stream through CSS optimizer and onto disk
        var cssStream = spriteData.css
            .pipe(gulp.dest(SCSS_ROOT));
        return merge(imgStream, cssStream);
    });

    return merge(...streams);
});