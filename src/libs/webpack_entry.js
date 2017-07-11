'use strict'

import path from 'path'
import _ from 'lodash'
import collect_filenames from './collect_filenames'

export default function getWebpackEntry (config) {
  const webpack_options = config.webpack
  const ENTRY_ROOT = webpack_options.entry_root
  const entryPoints = collect_filenames(ENTRY_ROOT, '**/*.js?(x)')
  return {
    ...entryPoints,
    ...webpack_options.entry
  }
}
