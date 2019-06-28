const executions = {
  jest: ({title, jsModule, fn, $arguments, assert, $return}) =>
    test(title,
      () => expect(jsModule[fn](...$arguments))[assert]($return)
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

  const path = filename.replace(/\.test\.[a-z]+$/i, ''),
    name = path.match(/[^\\\/]+$/g)[0],
    jsModule =  require(path)
  Object.assign(this, {
    path, name, jsModule, 
    jsonTests: jsonTestsParser(require(`${path}.test.json`), jsModule),
    run: executions[instance]
  })
  
  Object.assign(this, {
    runTest: function () {
      return this.jsonTests.map(this.run) 
    }
  })
}

const systemRootKeys = ['$schema'];

function jsonTestsParser(jsonTests, jsModule) {
  const testSuites = []
  Object.entries(jsonTests).forEach(([fn, tests]) =>{
    if (systemRootKeys.includes(fn))
      return;
    Object.entries(tests).forEach(([title, {$arguments, $return, assert}]) =>
      testSuites.push({
        jsModule,
        title,
        fn,
        $arguments,
        assert,
        $return
      })
    )
  })
  return testSuites
}

module.exports = {
  default: (...args) => new AnyTester(...args),
  AnyTester,
  jsonTestsParser,
  executions
}