'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var EventEmitter = require('events').EventEmitter;
var baseThemePath = path.join(__dirname, '/templates/', '/theme');

// Libs
var libsPath = path.join(__dirname + '/../' + '/libs/');
var cloneBones = require(libsPath + 'clone-bones');

var WpBonesGenerator = module.exports = function WpBonesGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });
  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '/../', '/package.json')));
};

util.inherits(WpBonesGenerator, yeoman.generators.Base);

WpBonesGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  //ASCII art

console.log(chalk.blue.bold("                                    +++++++++++++++++                               "));
console.log(chalk.blue.bold("                                  +++++++++++++++++++++                             "));
console.log(chalk.blue.bold("                                +++++++++++")+chalk.magenta.bgMagenta.bold("+=++")+chalk.white.bgWhite.bold("     ")+chalk.magenta.bgMagenta.bold(";")+chalk.blue.bold("++++                           "));
console.log(chalk.blue.bold("                               +++++++++++")+chalk.magenta.bgMagenta.bold(";")+chalk.white.bgWhite.bold("  ")+chalk.magenta.bgMagenta.bold("==-")+chalk.white.bgWhite.bold("      ")+chalk.blue.bold("++++                          "));
console.log(chalk.blue.bold("                              ++++++++++=")+chalk.magenta.bgMagenta.bold(".")+chalk.white.bgWhite.bold("   ")+chalk.magenta.bgMagenta.bold("-+==;")+chalk.white.bgWhite.bold("  ")+chalk.magenta.bgMagenta.bold("-+==")+chalk.blue.bold("=++                         "));
console.log(chalk.blue.bold("                             +++++++++++")+chalk.magenta.bgMagenta.bold("x ...++++++++=++ ")+chalk.blue.bold("-++                        "));
console.log(chalk.blue.bold("                            +++++++++++")+chalk.white.bgWhite.bold(".......")+chalk.magenta.bgMagenta.bold("++=,-+++=+")+chalk.white.bgWhite.bold("  ")+chalk.blue.bold("-++                       "));
console.log(chalk.blue.bold("                           +++++++++=")+chalk.white.bgWhite.bold("............   ")+chalk.magenta.bgMagenta.bold("=++=.")+chalk.white.bgWhite.bold("  ")+chalk.blue.bold("=++                      "));
console.log(chalk.blue.bold("                          ++++++++=")+chalk.white.bgWhite.bold(".... ...........  ")+chalk.magenta.bgMagenta.bold("++=+")+chalk.white.bgWhite.bold("   ")+chalk.blue.bold("+++                     "));
console.log(chalk.blue.bold("                          +++++++,")+chalk.white.bgWhite.bold("...")+chalk.black.bgBlack.bold("+xx+")+chalk.white.bgWhite.bold("............")+chalk.magenta.bgMagenta.bold(",xx+x,")+chalk.white.bgWhite.bold(".")+chalk.magenta.bgMagenta.bold("-")+chalk.blue.bold("++                     "));
console.log(chalk.blue.bold("                         +++++++-")+chalk.white.bgWhite.bold("...")+chalk.black.bgBlack.bold("++++++=")+chalk.white.bgWhite.bold("...........")+chalk.magenta.bgMagenta.bold("+++++xx")+chalk.blue.bold("+++                    "));
console.log(chalk.blue.bold("                         +++++++")+chalk.white.bgWhite.bold("...")+chalk.black.bgBlack.bold("=++++++x")+chalk.white.bgWhite.bold(" ..........")+chalk.magenta.bgMagenta.bold("+x++++xx")+chalk.blue.bold("++                    "));
console.log(chalk.blue.bold("                        ++++++++")+chalk.white.bgWhite.bold("...")+chalk.black.bgBlack.bold("xxx+=xxx")+chalk.white.bgWhite.bold(" .........")+chalk.magenta.bgMagenta.bold("-+x+")+chalk.white.bgWhite.bold(",, .")+chalk.magenta.bgMagenta.bold("x")+chalk.blue.bold("+++                   "));
console.log(chalk.blue.bold("                        ++++++++")+chalk.white.bgWhite.bold("...")+chalk.black.bgBlack.bold("xx")+chalk.white.bgWhite.bold(".. ")+chalk.black.bgBlack.bold("+xx")+chalk.white.bgWhite.bold(" ..........")+chalk.magenta.bgMagenta.bold("xx")+chalk.white.bgWhite.bold("-    -")+chalk.magenta.bgMagenta.bold("x")+chalk.blue.bold("++ +                 "));
console.log(chalk.blue.bold("                        +++++++++")+chalk.white.bgWhite.bold("..")+chalk.black.bgBlack.bold("+xxx+=xx")+chalk.white.bgWhite.bold(" ...........")+chalk.magenta.bgMagenta.bold("x")+chalk.white.bgWhite.bold("-,.-..")+chalk.magenta.bgMagenta.bold("x")+chalk.blue.bold("++++                 "));
console.log(chalk.blue.bold("                        +++++++++-")+chalk.white.bgWhite.bold(". ")+chalk.black.bgBlack.bold("xxxxxx+")+chalk.white.bgWhite.bold("......,.....")+chalk.magenta.bgMagenta.bold("xx")+chalk.white.bgWhite.bold("-,=.")+chalk.magenta.bgMagenta.bold("=x")+chalk.blue.bold("++++                 "));
console.log(chalk.blue.bold("                        ++++++++++")+chalk.white.bgWhite.bold("..")+chalk.black.bgBlack.bold(",+xxx+")+chalk.white.bgWhite.bold(".........,,,,.")+chalk.magenta.bgMagenta.bold("x-.,.xxx")+chalk.blue.bold("+++                 "));
console.log(chalk.blue.bold("                        +++++++++++")+chalk.white.bgWhite.bold(".. .........")+chalk.black.bgBlack.bold("++++x,")+chalk.white.bgWhite.bold("...")+chalk.magenta.bgMagenta.bold("xxxxxx")+chalk.white.bgWhite.bold("..")+chalk.blue.bold("+++                 "));
console.log(chalk.blue.bold("                        ++++++++++=")+chalk.white.bgWhite.bold(".....")+chalk.black.bgBlack.bold("+=")+chalk.white.bgWhite.bold("....")+chalk.black.bgBlack.bold("x+++++x")+chalk.white.bgWhite.bold(",,,")+chalk.magenta.bgMagenta.bold("-xxxx")+chalk.white.bgWhite.bold("...")+chalk.blue.bold("+++                 "));
console.log(chalk.blue.bold("                        ++++++++++")+chalk.white.bgWhite.bold("....")+chalk.black.bgBlack.bold("-xxx-")+chalk.white.bgWhite.bold("..")+chalk.black.bgBlack.bold(",++xx+++-")+chalk.white.bgWhite.bold(",,,")+chalk.magenta.bgMagenta.bold(".-xx")+chalk.white.bgWhite.bold("...")+chalk.blue.bold("+++                 "));
console.log(chalk.blue.bold("                        +++++++++")+chalk.white.bgWhite.bold(" ...")+chalk.black.bgBlack.bold("-xxxx")+chalk.white.bgWhite.bold("...")+chalk.black.bgBlack.bold("=x=")+chalk.white.bgWhite.bold("..")+chalk.black.bgBlack.bold("=xx+")+chalk.white.bgWhite.bold(";;--")+chalk.magenta.bgMagenta.bold(".+x")+chalk.white.bgWhite.bold("...")+chalk.blue.bold("+++                 "));
console.log(chalk.blue.bold("                        ++++++++")+chalk.white.bgWhite.bold(".....")+chalk.black.bgBlack.bold("xxxxx")+chalk.white.bgWhite.bold("...")+chalk.black.bgBlack.bold("=x=x=-xx+;")+chalk.white.bgWhite.bold("---")+chalk.magenta.bgMagenta.bold(".;x")+chalk.white.bgWhite.bold("...")+chalk.blue.bold("+++                 "));
console.log(chalk.blue.bold("                        +++++++=")+chalk.white.bgWhite.bold(".....")+chalk.black.bgBlack.bold(";xxx")+chalk.white.bgWhite.bold("....,")+chalk.black.bgBlack.bold("xxx-+xx-;")+chalk.white.bgWhite.bold(";-")+chalk.magenta.bgMagenta.bold("=.-x")+chalk.white.bgWhite.bold(",.")+chalk.blue.bold("=+++                 "));
console.log(chalk.blue.bold("                        ++++++++")+chalk.white.bgWhite.bold(".......")+chalk.black.bgBlack.bold("x=")+chalk.white.bgWhite.bold("....,")+chalk.black.bgBlack.bold("+xxxxxx;;")+chalk.white.bgWhite.bold("--")+chalk.magenta.bgMagenta.bold("=.xxx,")+chalk.blue.bold("++++                 "));
console.log(chalk.blue.bold("                        ++++++++=")+chalk.white.bgWhite.bold("......")+chalk.blue.bold("")+chalk.white.bgWhite.bold(",.....,")+chalk.black.bgBlack.bold(";;+xx=;;")+chalk.white.bgWhite.bold("---")+chalk.magenta.bgMagenta.bold("=+xx")+chalk.blue.bold("++++++                 "));
console.log(chalk.blue.bold("                        +++++++++=")+chalk.white.bgWhite.bold("...")+chalk.blue.bold("")+chalk.white.bgWhite.bold(",.....,..,;;")+chalk.white.bgWhite.bold("---;;;")+chalk.blue.bold("-=Xxxx+= +++                 "));
console.log(chalk.blue.bold("                        ++++++++++=")+chalk.white.bgWhite.bold(".;......")+chalk.black.bgBlack.bold("=+x-")+chalk.white.bgWhite.bold(",,,,,,;;")+chalk.blue.bold("-=x++xx+  x                  "));
console.log(chalk.blue.bold("                        ++++++++++++,")+chalk.white.bgWhite.bold("..;..")+chalk.black.bgBlack.bold("xxxx;")+chalk.white.bgWhite.bold("=;,;;;;")+chalk.blue.bold(";-,++xx++ .                   "));
console.log(chalk.blue.bold("                        ++++++++++++xx,")+chalk.white.bgWhite.bold("..")+chalk.black.bgBlack.bold("xxxx")+chalk.white.bgWhite.bold(";;--+====")+chalk.yellow.bgYellow.bold("++")+chalk.blue.bold(";xxxxxx+,                   "));
console.log(chalk.blue.bold("                         ++++=")+chalk.white.bgWhite.bold("..")+chalk.black.bgBlack.bold(";")+chalk.blue.bold("++xxxx+")+chalk.black.bgBlack.bold("xxxx")+chalk.white.bgWhite.bold(",;;;-")+chalk.blue.bold("+++-")+chalk.yellow.bgYellow.bold("=")+chalk.blue.bold("+")+chalk.yellow.bgYellow.bold("+.")+chalk.blue.bold("xxxxxxx                    "));
console.log(chalk.blue.bold("                         ++++=")+chalk.white.bgWhite.bold(".... ")+chalk.blue.bold(",=xx")+chalk.black.bgBlack.bold("xxxx")+chalk.white.bgWhite.bold(",;;;;")+chalk.blue.bold("++++")+chalk.yellow.bgYellow.bold("=")+chalk.blue.bold("-=-")+chalk.yellow.bgYellow.bold(".")+chalk.blue.bold("xxxx++x                    "));
console.log(chalk.blue.bold("                          +++-  ")+chalk.white.bgWhite.bold("...")+chalk.black.bgBlack.bold(";")+chalk.white.bgWhite.bold(".. ")+chalk.black.bgBlack.bold("xxx")+chalk.white.bgWhite.bold(",,.,,")+chalk.blue.bold("++++++")+chalk.yellow.bgYellow.bold("=;;")+chalk.blue.bold("+xxxx++                     "));
console.log(chalk.blue.bold("                          +++-")+chalk.white.bgWhite.bold(".....,.,")+chalk.black.bgBlack.bold(".xx")+chalk.white.bgWhite.bold("....,")+chalk.blue.bold("++++++++++++xxx++                     "));
console.log(chalk.blue.bold("                          ++=")+chalk.white.bgWhite.bold(".....,.........")+chalk.blue.bold("++++++++++++++xx+                       "));
console.log(chalk.blue.bold("                            ++")+chalk.white.bgWhite.bold("..............")+chalk.blue.bold("=++++++++++++++++                       "));
console.log(chalk.blue.bold("                             +++-")+chalk.white.bgWhite.bold("..,,,,")+chalk.white.bgWhite.bold("...")+chalk.blue.bold(",+++++++++++++++++                        "));
console.log(chalk.blue.bold("                              +++++++")+chalk.white.bgWhite.bold("===")+chalk.blue.bold("+++++++++++++++++++                         "));
console.log(chalk.blue.bold("                               +++++++++++++++++++++++++++                          "));
console.log(chalk.blue.bold("                                +++++++++++++++++++++++++                           "));
console.log(chalk.blue.bold("                                  +++++++++++++++++++++                             "));
console.log(chalk.blue.bold("                                    +++++++++++++++++                               "));
console.log(chalk.blue.bold("                                     x+++++++++++x                                  "));



console.log(chalk.blue.bold("       :::::::::        ::::::::        ::::    :::        ::::::::::        :::::::: "));
console.log(chalk.blue.bold("     :+:    :+:      :+:    :+:       :+:+:   :+:        :+:              :+:    :+:  "));
console.log(chalk.blue.bold("    +:+    +:+      +:+    +:+       :+:+:+  +:+        +:+              +:+          "));
console.log(chalk.blue.bold("   +#++:++#+       +#+    +:+       +#+ +:+ +#+        +#++:++#         +#++:++#++    "));
console.log(chalk.blue.bold("  +#+    +#+      +#+    +#+       +#+  +#+#+#        +#+                     +#+     "));
console.log(chalk.blue.bold(" #+#    #+#      #+#    #+#       #+#   #+#+#        #+#              #+#    #+#      "));
console.log(chalk.blue.bold("#########        ########        ###    ####        ##########        ########        "));

  var prompts = [{
    name: 'themeName',
    message: 'Name of the theme you want to create?'
  },{
    name: 'themeNameSpace',
    message: 'Uniq name-space for the theme (alphanumeric)?',
    default: function( answers ) {
return answers.themeName.replace(/\W/g, '').toLowerCase();
}
  },{
    name: 'themeAuthor',
    message: 'Name of the themes author?',
    default: function( answers ) {
return 'John Doe';
}
  },{
    name: 'themeAuthorURI',
    message: 'Website of the themes authors?',
    default: function( answers ) {
return 'http://www.'+answers.themeAuthor.replace(/\W/g, '').toLowerCase()+'.com';
}
  },{
    name: 'themeURI',
    message: 'Website of the theme?',
default: function( answers ) {
return answers.themeAuthorURI+'/'+answers.themeNameSpace;
}
  },{
    name: 'themeDescription',
    message: 'Description of the theme?',
    default: function( answers ) {
return 'This is a description for the '+answers.themeName+' theme.';
}
  }];

  var self = this;
  // Fetch theme from github before starting...
  console.log('\nDownloading latest version of the boilerplate...\n');
  cloneBones(baseThemePath).then(function () {
    self.prompt(prompts, function (props) {
      self.themeName = props.themeName;
      self.themeNameSpace = props.themeNameSpace;
      self.themeAuthor = props.themeAuthor;
      self.themeAuthorURI = props.themeAuthorURI;
      self.themeURI = props.themeURI;
      self.themeDescription = props.themeDescription;
      self.jshintTag = '<%= jshint.all %>';
      cb();
    }.bind(self));
  });
};

WpBonesGenerator.prototype.app = function app() {
  var currentDate = new Date();
  this.directory('theme', this.themeNameSpace);
  this.themeCreated = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();

  this.template('_gruntfile.js', this.thisNameSpace + '/library/grunt/gruntfile.js')
  this.template('_package.json', this.thisNameSpace + '/library/grunt/package.json')
};
