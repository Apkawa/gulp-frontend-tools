'use strict';

var _ = require('lodash');

var gutil = require('gulp-util');

var traverse = require('traverse');
var nunjucks = require('nunjucks');

function objectTemplate(obj, context) {
    var tpl = new nunjucks.Environment(new nunjucks.FileSystemLoader('views'),
        {
            throwOnUndefined: true
        }
    );
    context = _.cloneDeep(context);
    traverse(obj).forEach(function (value) {
        if (_.isString(value)) {
            try {
                var rendered = tpl.renderString(value, context);

                // Обновляем контекст
                var paths = [this.path.join('.'), "_." + _.slice(this.path, 1).join('.')]
                _.each(paths, function (v) {
                    _.set(context, v, rendered);
                });

                this.update(rendered);
            } catch (err) {
                // Мб заглушить ошибку и сделать несколько проходов для ситуации с вложенными шаблонами
                var err = new gutil.PluginError('objectTemplate',
                    "Invalid template in " + this.path.join('.') + ': ' + value, {showStack: false});
                throw err;
            }
        }
    });
    return obj
}

module.exports = objectTemplate;