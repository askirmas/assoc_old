const runner = require('./anytester').default(__filename)
runner.jsonTests.map(runner.run)
