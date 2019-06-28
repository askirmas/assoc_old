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

module.exports = {
  merge
}