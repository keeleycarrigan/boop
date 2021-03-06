var _merge = require('lodash/merge');
var babelOptions = require('./babel-options.json');

var cjsPresets = {
  "presets": [
    "@babel/env"
  ]
};

module.exports = {
  "env": {
    "commonjs": _merge({}, babelOptions, cjsPresets),
    "esmodules": _merge({}, babelOptions)
  }
}
