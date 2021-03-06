var helper = require('./helper');
var typescript = require('../index');
var fs = require('fs');
var gutil = require('gulp-util');
var sinon = require('sinon');

describe('gulp-tsc', function () {

  beforeEach(function () {
    sinon.stub(gutil, 'log');
  });
  afterEach(function () {
    gutil.log.restore();
  });

  it('compiles TypeScript files into JavaScript', function (done) {
    this.timeout(10000);

    helper.createTemporaryFile({ prefix: 'gulp-tsc', suffix: '.ts' }, function (err, file) {
      if (err) return done(err);

      fs.writeSync(file.fd, 'var s:string = "Hello, world";\nvar n:number = 10;\n');
      fs.closeSync(file.fd);

      var stream = typescript();
      var outputFile;
      stream.once('data', function (file) {
        file.path.should.match(/\.js$/);
        file.contents.toString().should.match(/var s = "Hello, world";\r?\nvar n = 10;/);
        outputFile = file;
        done();
      });
      stream.on('end', function () {
        fs.existsSync(outputFile.path).should.be.false;
      });
      stream.write(file);
      stream.end();
    });
  });

});
