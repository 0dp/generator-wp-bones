![alt tag](https://raw.github.com/0dp/generator-wp-bones/master/header.png)

# generator-wp-bones

A WordPress theme [Yeoman](http://yeoman.io) generator, to kickstart WordPress Bones
theme development with yo, sass and grunt.

**Note:** Still in development


## Getting Started (for when it is published official)


~~Install generator-wp-bones from npm:~~

```
$ npm install -g generator-wp-bones
```

~~Finally, initiate the generator. run this command in
a working WordPress installations *themes* directory:~~

```
$ yo wp-bones
```

## Known Issues

I just wrote this up and there is some minor issues.

I have failed to kill these warnings

```
npm WARN package.json package@0.0.0 No description
npm WARN package.json package@0.0.0 No repository field.
npm WARN package.json package@0.0.0 No README data
```

Then I have these errors. I am investigating what is causing them. But it does not seem to affect the installation of Bones.

```
/usr/lib/node_modules/yo/node_modules/update-notifier/node_modules/configstore/node_modules/graceful-fs/polyfills.js:14
  chdir.call(process, d)
        ^
Error: ENOENT, no such file or directory
    at process.chdir (/usr/lib/node_modules/yo/node_modules/update-notifier/node_modules/configstore/node_modules/graceful-fs/polyfills.js:14:9)
    at process.chdir (/usr/lib/node_modules/yo/node_modules/insight/node_modules/configstore/node_modules/graceful-fs/polyfills.js:14:9)
    at process.chdir (/home/odp/Desktop/generator-wp-bones/node_modules/yeoman-generator/node_modules/tar/node_modules/fstream/node_modules/graceful-fs/polyfills.js:14:9)
    at WpBonesGenerator.<anonymous> (/home/odp/Desktop/generator-wp-bones/app/index.js:17:17)
    at WpBonesGenerator.EventEmitter.emit (events.js:117:20)
    at callback (/home/odp/Desktop/generator-wp-bones/node_modules/yeoman-generator/lib/base.js:314:10)
    at /home/odp/Desktop/generator-wp-bones/node_modules/yeoman-generator/node_modules/async/lib/async.js:232:13
    at async.eachSeries (/home/odp/Desktop/generator-wp-bones/node_modules/yeoman-generator/node_modules/async/lib/async.js:130:20)
    at _asyncMap (/home/odp/Desktop/generator-wp-bones/node_modules/yeoman-generator/node_modules/async/lib/async.js:226:9)
    at Object.mapSeries (/home/odp/Desktop/generator-wp-bones/node_modules/yeoman-generator/node_modules/async/lib/async.js:216:23)
```

## TODO

Instead of having the Bones Wordpress starter theme living in a folder in templates it would be nice to 'fetch' (dunno if this is the right term because i'm still a noob at git) it fresh from it's repo here at git. I have already included simple-git into the generator so it just need to be setup right. 


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)


