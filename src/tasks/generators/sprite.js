'use strict';
import _ from "lodash";
import path from "path";
import buffer from "vinyl-buffer";
import merge from "merge-stream";
import size from "gulp-size";
import spritesmith from "gulp.spritesmith";


export default function (gulp, config) {

    const SPRITE_ENTRIES = config.project.sprite;
    const SCSS_ROOT = config.project.path.app.scss;


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
}
