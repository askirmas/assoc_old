'use strict'

module.exports = Object.assign({},
  ...[
    './common',
    './assoc-table',
    './merge',
    './filter'
  ].map(require)
)