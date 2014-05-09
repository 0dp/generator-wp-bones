'use strict';
var util = require('util');
var path = require('path');
var async = require('async');
var yeoman = require('yeoman-generator');

// Libs
var libsPath = path.join(__dirname + '/../' + '/libs/');
var cloneBones = require(libsPath + 'clone-bones');
var ascii = require(libsPath + 'ascii');

var WpBonesGenerator = module.exports = function (args, options) {
  yeoman.generators.Base.apply(this, arguments);

  // Need to override the default yeoman method in order to make
  // this works. If someone has a better idea, tell me. (@iam4x)
  this.directory = function (source, destination, process) {
    // Yeah just for this line, need to set the root as the source
    // or it will look inside the generator itself
    var root = source;
    var files = this.expandFiles('**', {dot: true, cwd: root});
    var self = this;

    destination = destination || source;

    if (typeof destination === 'function') {
      process = destination;
      destination = source;
    }

    // get the path relative to the template root, and copy to the relative destination
    var resolveFiles = function (filepath) {
      return function (next) {
        if (!filepath) {
          self.emit('directory:end');
          return next();
        }

        var dest = path.join(destination, filepath);
        self.copy(path.join(root, filepath), dest, process);

        return next();
      };
    };

    async.parallel(files.map(resolveFiles));
    return this;
  };

  this.on('end', function () {
    this.installDependencies({
      skipInstall: options['skip-install']
    });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '/../', '/package.json')));
};

util.inherits(WpBonesGenerator, yeoman.generators.Base);

WpBonesGenerator.prototype.askFor = function () {
  var cb = this.async();

  ascii();

  var prompts = [
    {
      name: 'themeName',
      message: 'Name of the theme you want to create?',
      default: 'bones'
    },
    {
      name: 'themeNameSpace',
      message: 'Uniq name-space for the theme (alphanumeric)?',
      default: function (answers) {
        return answers.themeName.replace(/\W/g, '').toLowerCase();
      }
    },
    {
      name: 'themeAuthor',
      message: 'Name of the themes author?',
      default: function () {
        return 'John Doe';
      }
    },
    {
      name: 'themeAuthorURI',
      message: 'Website of the themes authors?',
      default: function (answers) {
        return 'http://www.' + answers.themeAuthor.replace(/\W/g, '').toLowerCase() + '.com';
      }
    },
    {
      name: 'themeURI',
      message: 'Website of the theme?',
      default: function (answers) {
        return answers.themeAuthorURI + '/' + answers.themeNameSpace;
      }
    },
    {
      name: 'themeDescription',
      message: 'Description of the theme?',
      default: function (answers) {
        return 'This is a description for the ' + answers.themeName + ' theme.';
      }
    }
  ];

  var self = this;
  // Fetch theme from github before starting...
  console.log('\nDownloading latest version of the boilerplate...\n');
  cloneBones().then(function (directory) {
    self.prompt(prompts, function (props) {
      self.themeName = props.themeName;
      self.themeNameSpace = props.themeNameSpace;
      self.themeAuthor = props.themeAuthor;
      self.themeAuthorURI = props.themeAuthorURI;
      self.themeURI = props.themeURI;
      self.themeDescription = props.themeDescription;
      self.directory(directory, self.themeNameSpace);
      self.jshintTag = '<%= jshint.all %>';
      cb();
    }.bind(self));
  });
};

WpBonesGenerator.prototype.app = function () {
  var currentDate = new Date();
  this.themeCreated = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();

  this.template('_gruntfile.js', this.themeNameSpace + '/library/grunt/gruntfile.js');
  this.template('_package.json', this.themeNameSpace + '/library/grunt/package.json');
};
