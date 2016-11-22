'use strict';

'use strict';

var _ = require('lodash');
var fs = require('fs');
var yaml = require('js-yaml');
var glob = require('glob');
var path = require('path');
var gutil = require('gulp-util');


function loadData(name, context_root) {
    const parsed = path.parse(path.normalize(name));
    name = path.join(parsed.dir, parsed.name)

    var context_path = context_root + name;

    var _context = null;
    var ext_list = ['.js', '.yaml', '.json'];
    for (var index in ext_list) {
        var ext = ext_list[index];
        var _fname = context_path + ext;
        //console.log('_fname', _fname);
        try {
            if (ext == '.yaml') {
                _context = yaml.safeLoad(fs.readFileSync(_fname, 'utf8'));
            } else {
                // Try context from js file
                if (ext == '.json') {
                    _context = JSON.parse(fs.readFileSync(_fname, 'utf8'))
                } else {
                    _context = require(_fname);
                }
            }
            break;
        } catch (err) {
            // Try context from json file
        }
    }
    if (_.isEmpty(_context)) {
        gutil.log(gutil.colors.cyan(name), gutil.colors.yellow("Не найден контекст"))
    }
    return _context;
}


module.exports = loadData;