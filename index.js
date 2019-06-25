'use strict'
const assoc2table_options = require('./index.assoc2table.options')
/**
 * 
 * @param {{}} assoc 
 * @param {{}} options 
 * @param {string[]} space 
 * @param {string[][]} table 
 */
function assoc2table(
  assoc,
  options = assoc2table_options,
  space = [],
  table = []
) {
  const {
    delimiter, splitLeaves, splitKeys, putDelimiter, keepBlank
  } = Object.assign({}, assoc2table_options, options),
    splitting = (doSplit, source) =>
      (doSplit ? source.toString().split(delimiter) : [source])
      .filter(el => keepBlank || el !== '')

  Object.entries(assoc)
  .forEach(([key, value]) => {
    const keys = splitting(splitKeys, key)

    if (typeof value === 'object')
      return assoc2table(value, options, [...space, ...keys], table)  
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

/**
 * Tail precendance
 * @param {string[][]} table 
 * @param {{}} assoc 
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
  return assoc
}


function merge(source, ...donors) {
  merger(source, donors)
  return source
}

function merger(source, donors, cbs = []) {
  if (typeof source !== 'object')
    return;
  if (Array.isArray(source))
    return source.push(
      ...[].concat(
        ...donors.filter(Array.isArray)
      )
    )

  const notMergableKeys = {}
  Object.keys(source)
  .forEach(key => {
    if (typeof source[key] !== 'object')
      notMergableKeys[key] = true
  })
  
  const mergeByKeys = {};
  donors.forEach(assoc => {
    if (typeof assoc !== 'object')
      return;
    Object.keys(assoc)
    .forEach(key => {
      if (key in notMergableKeys)
        return;
      const value = assoc[key]

      if (typeof value !== 'object') {
        if (key in mergeByKeys || key in source)
          return;
        notMergableKeys[key] = true
        source[key] = value
        return;          
      }

      if (key in mergeByKeys)
        mergeByKeys[key].push(value)
      else 
        mergeByKeys[key] = [value]
    })
  })

  Object.entries(mergeByKeys)
  .forEach(([key, nestedDonors]) => cbs.push(
    () => merger(source[key], nestedDonors)
  ))
  
  if (cbs.length)
    cbs.pop()()
  return;
}

//from https://jsperf.com/empty-object-comparisons
/*const  {hasOwnProperty} = Object.prototype
function is_empty(obj) {
  // null and undefined are empty
  if (obj == null)
    return true;
  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length && obj.length > 0)
    return false;
  if (obj.length === 0)
    return true;

  for (var key in obj)
    if (hasOwnProperty.call(obj, key))
      return false;
  return true;
}*/

// TODO: forEach key as keys + for or while

module.exports = {
  assoc2table,
  merge,
  table2assoc
}