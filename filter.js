'use strict'
const {deleting, isEmpty, forEachKey} = require('./common')

function filterLeaves(source, conditioning) {
  if (typeof source !== 'object' || isEmpty(source))
    return conditioning(source)
  //Bad source - if children exists and only bad
  let wasGood, wasBad; 
  forEachKey(source, key => {
    if (filterLeaves(source[key], conditioning))
      return  wasGood = wasGood || true 
    deleting(source, key)
    wasBad = wasBad || true
  })
  return wasGood || !wasBad
}

function filterNull(source) {
  filterLeaves(source, val => val !== null)
  return source 
}

module.exports = {
  filterLeaves, filterNull
}