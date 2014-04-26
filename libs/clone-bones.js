'use strict';

// dependancies
var RSVP = require('rsvp');
var simpleGit = require('simple-git')();
var tmp = require('temporary');

// Bones git repo url
var bones = 'git://github.com/eddiemachado/bones.git';

// Configure RSVP promise to yell when something goes wrong
// --------------------------------------------------------
RSVP.on('error', function (event) {
  console.log(event.message);
  console.log(event.stack);
});

// Module: cloneBones
// ------------------
// this our module, it's a Promise
// it will be used to create our theme directory or to clean git
// then it will clone the `bones` repository in the temporary files
//
// I prefered to use clone, cause if something goes wrong with
// the bones directory, we would have to do execute
// ```
// $ git fetch
// $ git reset --hard origin/master
// $ git pull origin master
// ```
var cloneBones = function () {
  var promise = new RSVP.Promise(function (resolve, reject) {
    // Let's create a temporary directory
    var dir = new tmp.Dir();
    // then we clone into our new tempory directory
    simpleGit.clone(bones, dir.path, function (err) {
      if (err) {
        // something wrong? tell RSVP
        return reject(err);
      }
      // good! everthing is okey, we can go on :D
      return resolve(dir.path);
    });
  });
  return promise;
};

// export our module outside :)
module.exports = cloneBones;
