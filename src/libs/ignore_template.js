'use strict';
import _ from 'lodash';

export default function (file) {
    /* ignore partials like sass */
    var parts = _.filter(file.path.split('/'), function (part) {
        return part.startsWith("_")
    })
    if (parts.length) {
        return true
    }
};
