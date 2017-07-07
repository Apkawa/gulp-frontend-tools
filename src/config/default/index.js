'use strict';
import requireDir from 'require-dir'

const default_config = requireDir('.')
default_config.webpack = require('./webpack')

export default default_config