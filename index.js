'use strict'
const assoc2table_options = require('./index.assoc2table.options')
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

function merge(source, ...donors) {
  merger(source, donors)
  return source
}

function merger(source, donors, cbs = []) {
  if (typeof source !== 'object')
    return source
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
    return cbs.pop()()
}

module.exports = {
  assoc2table,
  merge
}