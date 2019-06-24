const executions = {
  jest: ({title, jsModule, fn, input, assert, output}) =>
    test(title,
      () => expect(jsModule[fn](...input))[assert](output)
    ) 
}

function AnyTester(filename, cwd = process.cwd()) {
  let instance
  if (process.argv[1].match(/[\/\\]jest(-worker)?[\/\\]/))
    instance = 'jest'
  else {
    console.log({"Unknown instance": process.argv})
    process.exit(1)
  }

  const path = filename.replace(cwd, '', 1).replace(/\.test\.[a-z]+$/i, ''),
    name = path.match(/[^\\\/]+$/g)[0],
    jsModule =  require(`./${name}`)

  Object.assign(this, {
    path, name, jsModule, 
    jsonTests: jsonTestsParser(require(`./${name}.test.json`), jsModule),
    run: executions[instance]
  }) 
}

function jsonTestsParser(jsonTests, jsModule) {
  const testSuites = []
  Object.entries(jsonTests).forEach(([fn, tests]) =>
    Object.entries(tests).forEach(([title, {input, output, assert}]) =>
      testSuites.push({
        jsModule,
        title,
        fn,
        input,
        assert,
        output
      })
    )
  )
  return testSuites
}

module.exports = {
  default: (...args) => new AnyTester(...args),
  AnyTester,
  jsonTestsParser,
  executions
}