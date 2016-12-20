var gulp = require('gulp');
var initGulpTasks = require('gulp-frontend-tools');

var config = {
    project: {
        webpack: {
            defines: {
                EXAMPLE_DEFINE: "'{{ envs.example_define|default(\"no_defined\") }}'",
            }
        }

    }
}
initGulpTasks(gulp, config, __dirname);
