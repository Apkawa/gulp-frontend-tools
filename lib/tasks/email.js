'use strict';
'use scrict';
//TODO

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (gulp, config) {
    gulp.task('email', ['css', 'public', 'template'], function () {
        /* Хелпер для тестирования шаблонов email */
        var builder = emailBuilder(gulp_config.email_builder);
        gulp.src(dist_dirs.templates + 'email_template/*.html').pipe(htmlreplace({
            css: ['../../css/email_template/ink.css', '../../css/email_template/main.css']
        }))
        // .pipe(builder.build())
        .pipe(builder.inlineCss()).pipe(builder.sendEmailTest()).pipe(gulp.dest(dist_dirs.templates + 'email_template_inline/'));
    });
};

module.exports = exports['default'];