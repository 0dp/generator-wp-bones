'use strict';

// dependancies
var fs = require('fs');
var RSVP = require('rsvp');
var simpleGit = require('simple-git')();
var exec = require('child_process').exec;
var rmdir = require('rmdir');

// Bones git repo url
var bones = 'git://github.com/eddiemachado/bones.git';

// Configure RSVP promise to yell when something goes wrong
// --------------------------------------------------------
RSVP.on('error', function(e) {
  console.log(e.message);
  console.log(e.stack);
});

// Helper function to create a directory with a path given
// -------------------------------------------------------
var createDir = function (localPath, resolve, reject) {
  fs.mkdir(localPath, function (err) {
    if (err) {
      // if something goes wrong, tell the parent
      return reject(err);
    }
    // directory created, we can go on
    return resolve();
  });
};

// Promise that will clean the `theme` directory
// ---------------------------------------------
var cleanDir = function (localPath) {
  // the promise
  var promise = new RSVP.Promise(function (resolve, reject) {
    // we check if the directory already exists
    fs.exists(localPath, function (exists) {
      // okey it exists, we need to removes it
      if (exists) {
        // let's try to remove the directory with the fastest solution
        // using `rm -rf` cmd
        exec('rm -r ' + localPath, function (err, stderr) {
          // if something is wrong, maybe we are on windows?
          // let's try another solution that would be slower...
          if (err || stderr) {
            rmdir(localPath, function (err) {
              if (err) {
                // hmm... not on windows too
                // please report bugs and issues on github
                return reject(err);
              }
              // okey this guy was on windows,
              // we can go on and create the directory
              return createDir(localPath, resolve, reject);
            });
          }
          // this guy was on a 'UNIX' system
          // and all the files were removed
          return createDir(localPath, resolve, reject);
        });
      }
      else {
        // okey first utilisation, no directory found
        // so let's create the directory :)
        return createDir(localPath, resolve, reject);
      }
    });
  });
  // return the promise
  return promise;
};

// Module: cloneBones
// ------------------
// this our module, it's a Promise
// it will be used to create our theme directory or to clean git
// then it will clone the `bones` repository
//
// I prefered to use clone, cause if something goes wrong with
// the bones directory, we would have to do execute
// ```
// $ git fetch
// $ git reset --hard origin/master
// $ git pull origin master
// ```
// And if the user delete the `.git` folder, we would have to re-create it.
// So safer, faster to delete and clone again.
var cloneBones = function (localPath) {
  var promise = new RSVP.Promise(function(resolve, reject) {
    // So first, we clean our directory
    cleanDir(localPath).then(function () {
      // then we clone our directort
      simpleGit.clone(bones, localPath, function (err) {
        if (err) {
          // something wrong? tell RSVP
          return reject(err);
        }
        // good! everthing is okey, we can go on :D
        return resolve();
      });
    });
  });
  return promise;
};

// export our module outside :)
module.exports = cloneBones;
