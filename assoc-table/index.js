'use strict';
const optionsDefault = require('./options'),
  {forEachKey, isEmpty} = require('../common')

module.exports = {
  assoc2table, table2assoc, repairIndexes
}

/**
 * Tail precendance
 */
function assoc2table(
  assoc,
  options = optionsDefault,
  space = [],
  table = []
) {
  const {
      delimiter, splitLeaves, splitKeys, putDelimiter, keepBlank
    } = Object.assign({}, optionsDefault, options),
    splitting = (doSplit, source) =>
      (
        doSplit
        ? source.toString().split(delimiter)
        : [source]
      ).filter(el => keepBlank || el !== '')

  Object.entries(assoc)
  .forEach(([key, value]) => {
    const keys = splitting(splitKeys, key)

    if (typeof value === 'object')
      return assoc2table(value, options, [...space, ...keys], table)  
    else 
      table.push([].concat(
        // @ts-ignore
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

/**
 * Tail precendance
 */
function table2assoc(table, assoc = {}) {
  if (typeof assoc !== 'object')
    return;
  row: for (let ri = table.length - 1; ~ri; ri--) {
    const row = table[ri], {length} = row
    if (length < 2)
      continue;
    let pointer = assoc
    for (let i = 0; i < length - 2; i++) {
      const key = row[i]
      if (!(key in pointer))
        pointer[key] = {}
      pointer = pointer[key]
      if (typeof pointer !== 'object')
        continue row;
    }
    const key = row[length - 2]
    if (typeof pointer === 'object' && !(key in pointer))
      pointer[key] = row[length - 1] 
  }
  return repairIndexes(assoc)
}

function repairIndexes(source) {
  if (
    typeof source !== 'object'
    || isEmpty(source)
    || Array.isArray(source)
  ) return source

  forEachKey(source, key =>
    source[key] = repairIndexes(source[key])
  )
  
  let result = [], repaired = true
  forEachKey(source, (_, i) => {
    if (i in source)
      result.push(source[i])
    else {
      result = source
      return false
    }
  })
  return result
}
