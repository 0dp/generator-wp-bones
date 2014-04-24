'use strict';

var fs = require('fs');
var RSVP = require('rsvp');
var simpleGit = require('simple-git')();
var path = require('path');
var exec = require('child_process').exec;

var bones = 'git://github.com/eddiemachado/bones.git';

// Configure RSVP promise to yell when something goes wrong
RSVP.on('error', function(e) {
  console.log(e.message);
  console.log(e.stack);
});

var createDir = function (localPath, resolve, reject) {
  fs.mkdir(localPath, function (err) {
    if (err) {
      return reject(err);
    }
    return resolve();
  });
};

var cleanDir = function (localPath) {
  var promise = new RSVP.Promise(function (resolve, reject) {
    fs.exists(localPath, function (exists) {
      if (exists) {
        var a = path.join(__dirname, '..', localPath);
        exec('rm -r ' + a, function (err, stdout, stderr) {
          if (err) {
            return reject(stdout, stderr);
          }
          return createDir(localPath, resolve, reject);
        });
      }
      else {
        return createDir(localPath, resolve, reject);
      }
    });
  });
  return promise;
};

var cloneBones = function (localPath) {
  var promise = new RSVP.Promise(function(resolve, reject) {
    cleanDir(localPath).then(function () {
      simpleGit.clone(bones, localPath, function (err) {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  });
  return promise;
};

module.exports = cloneBones;

cloneBones('app/templates/theme', function () {
  console.log('yolo');
});
