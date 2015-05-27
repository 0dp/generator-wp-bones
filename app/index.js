'use strict';
var util = require('util');
var path = require('path');
var async = require('async');
var yeoman = require('yeoman-generator');
//var fs = require('fs');
var fs = require('fs-extra');
var chalk = require('chalk');

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
		try {
			process.chdir(process.cwd() + '/' + this.themeNameSpace + '/library/grunt/');
			this.installDependencies({
				skipInstall: options['skip-install'],
				callback: function () {
					this.spawnCommand('grunt', ['default']);
				}.bind(this)
			});

		} catch (err) {
			console.log('Failed to install dependencies: ' + err);
		}
	});

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '/../', '/package.json')));
};

util.inherits(WpBonesGenerator, yeoman.generators.Base);

WpBonesGenerator.prototype.askFor = function () {
  var cb = this.async();
var _ = this._;
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
        return _.slugify(answers.themeName);
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
    },
    {
      name: 'removeCustomPostTypes',
      message: 'Would you like to remove the default custom post types?',
      default: 'Y/n'
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
      self.removeCustomPostTypes = (/y/i).test(props.removeCustomPostTypes);
      self.directory(directory, self.themeNameSpace);
      self.jshintTag = '<%= jshint.all %>';
      cb();
    }.bind(self));
    
  });
};

WpBonesGenerator.prototype.removeCPT = function removeCPT () {
  if (this.removeCustomPostTypes) {
  var self = this;
  
  //Take care of functions.php
  var body = fs.readFileSync(self.themeNameSpace+'/functions.php').toString();
  var input = body.split('\n');

  input.splice(29,2);
  var output = input.join('\n');    
  fs.writeFileSync(self.themeNameSpace+'/functions.php', output);

  //Take care of custom-post-types.php
  fs.removeSync(self.themeNameSpace+'/library/custom-post-type.php');
  
  //Take care of post-formats folder
  fs.removeSync(self.themeNameSpace+'/post-formats');
  
  //Take care of bones.php
  var bp = fs.readFileSync(self.themeNameSpace+'/library/bones.php').toString();
  var inp = bp.split('\n');

  inp.splice(192,15);
  var outp = inp.join('\n');    
  fs.writeFileSync(self.themeNameSpace+'/library/bones.php', outp);  
  
    
  
    this.log.ok('Custom Post Types Removed');
  }
};


/*
* basic replace function take from https://github.com/kdo/generator-wp-underscores 
* thanks
*/
function findandreplace(dir) {
  var self = this;
  var _ = this._;

  var files = fs.readdirSync(dir);
  files.forEach(function (file) {
    file = path.join(dir, file);
    var stat = fs.statSync(file);

    if (stat.isFile() && (path.extname(file) == '.php' || path.extname(file) == '.css')) {
      self.log.info('Find and replace bones in ' + chalk.yellow(file));
      var data = fs.readFileSync(file, 'utf8');
      var result;
      result = data.replace(/Text Domain: bonestheme/g, "Text Domain: " + _.slugify(self.themeName) + "");
      result = result.replace(/'bonestheme'/g, "'" + _.slugify(self.themeName) + "'");
      result = result.replace(/bones_/g, _.underscored(_.slugify(self.themeName)) + "_");
      result = result.replace(/ bones/g, " " + self.themeName);
      result = result.replace(/bones-/g, _.slugify(self.themeName) + "-");
      if (file == path.join(self.themeNameSpace,'style.css')) {
        self.log.info('Updating theme information in ' + file);
        result = result.replace(/(Theme Name: )(.+)/g, '$1' + self.themeName);
        result = result.replace(/(Theme URI: )(.+)/g, '$1' + self.themeURI);
        result = result.replace(/(Author: )(.+)/g, '$1' + self.themeAuthor);
        result = result.replace(/(Author URI: )(.+)/g, '$1' + self.themeAuthorURI);
        result = result.replace(/(Description: )(.+)/g, '$1' + self.themeDescription);
        //result = result.replace(/(Version: )(.+)/g, '$10.0.1');
        
      }
	  
      fs.writeFileSync(file, result, 'utf8');
    }

    else if (stat.isDirectory()) {
      findandreplace.call(self, file);
    }
  });
}

WpBonesGenerator.prototype.renameunderscores = function renameunderscores() {
  var self = this;
  findandreplace.call(this, './'+self.themeNameSpace);
  this.log.ok('Done replacing string ' + chalk.yellow('bones'));
};


WpBonesGenerator.prototype.app = function () {
  var currentDate = new Date();
  this.themeCreated = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();

  this.template('_gruntfile.js', this.themeNameSpace + '/library/grunt/gruntfile.js');
  this.template('_package.json', this.themeNameSpace + '/library/grunt/package.json');
  //this.template('_bower.json', this.themeNameSpace + '/bower.json');
};

