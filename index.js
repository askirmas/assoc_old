'use strict'
const assoc2table_options = require('./index.assoc2table.options')
function assoc2table(
  assoc,
  options = assoc2table_options,
  space = [],
  table = []
) {
  const {delimiter, splitLeaves, splitKeys, putDelimiter, keepBlank} = Object.assign({}, assoc2table_options, options),
    splitting = (doSplit, source) =>
      (doSplit ? source.toString().split(delimiter) : [source])
      .filter(el => keepBlank || el !== '')

  Object.entries(assoc)
  .forEach(([key, value]) => {
    const keys = splitting(splitKeys, key)

    if (typeof value === 'object')
      assoc2table(value, options, [...space, ...keys], table)  
    else 
      table.push([].concat(
        space,
        space.length
        ? [delimiter]
        : [],
        keys,
        putDelimiter
        ? delimiter
        : [],
        splitting(splitLeaves, value)
      ))
  })
  return table
}

module.exports = {
  assoc2table
}