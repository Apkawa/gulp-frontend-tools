'use strict';
import _ from 'lodash'

import objectTemplate from './objectTemplate'

export default function optionsRenderer(data, opts = {depth: 10}) {
    let context = {...data};
    const {exlcudes, depth} = opts;
    for (let i = 0; i < depth; i++) {
        data = _.fromPairs(_.map(data, function (value, key) {
            // Local root context
            if (!_.includes(exlcudes, key)) {
                var templated_value = {}
                templated_value[key] = value;
                context['_'] = value;
                context['_key'] = key;

                value = objectTemplate(templated_value, context)[key];
                context[key] = value
            }
            return [key, value]

        }))
    }
    return data
}
