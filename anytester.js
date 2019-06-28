'use strict';
const {existsSync} = require('fs'),
  instances = require('./instances')

module.exports = {
  default: (...args) => new AnyTester(...args),
  AnyTester
}

const defaultConfig = {
  systemRootKeys: ['$schema'],
  testDataPostfix: '.test.json',
  testMask: '\\.test\\.[a-z]+$',
  pathFromFileToTest: './'
}

function AnyTester(filename, cwd = process.cwd(), scriptConfig = {}) {
  const configPath = `${cwd}/anytester.config`,
    config = Object.assign({},
      scriptConfig,
      existsSync(configPath)
      ? require(configPath)
      : {},
      defaultConfig
    ) 
  let instance
  if (process.argv[1].match(/[\/\\]jest(-worker)?[\/\\]/))
    instance = 'jest'
  else {
    console.log({"Unknown instance": process.argv})
    process.exit(1)
  }

  const path = filename.toLowerCase()
    .replace(cwd.toLowerCase(), '', 1)
    .replace(new RegExp(config.testMask, 'i'), ''),
    name = path.match(/[^\\\/]+$/g)[0],
    jsModule =  require(join(config.pathFromFileToTest, path))

  Object.assign(this, {
    path, name, jsModule, 
    jsonTests: jsonTestsParser(
      require(join(config.pathFromFileToTest, path, config.testDataPostfix)),
      jsModule,
      scriptConfig
    ),
    run: instances[instance]
  })
  
  Object.assign(this, {
    runTest: function () {
      return this.jsonTests.map(this.run) 
    }
  })
}

function jsonTestsParser(jsonTests, jsModule, {systemRootKeys = []} = {}) {
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

function join(...args) {
  return args.join('')
}