/// <reference path="./common.d.ts"/>
'use strict';
module.exports = {
  isEmpty, forEachKey, deleting
}

//Origin https://jsperf.com/empty-object-comparisons
const  {hasOwnProperty} = Object.prototype
function isEmpty(obj) {
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
}

function forEachKey(source, fn) {
  if (isEmpty(source))
    return;
  const keys = Object.keys(source)
  for (let i = keys.length; i; i--)
    fn(keys[i - 1]/*, i - 1, keys, source*/)
}

function deleting(source, key) {
  if (!(key in source))
    return source;
  if ('splice' in source) {
    source.splice(key, 1)
  } else
    delete source[key]
}
