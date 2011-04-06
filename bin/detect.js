#!/usr/bin/env node

var forAllFiles = require('../lib/tree-walk.js').forAllFiles,
    npm = require('npm'),
    util = require('util'),
    path = require('path'),
    fs = require('fs'),
    exec = require('child_process').exec;

// recursively scan directory, build up array of requires
var dir = '.',
    resolvedDir = path.resolve(dir),
    packages = [],      // array of all candidate packages found
    npmPackages = [];   // array of all packages that exist in the npm registry

util.log('Scanning directory "' + resolvedDir + '"... ')

forAllFiles(dir,
  function (file, next) {
    processFile(file);
    next();
  },
  
  function (err) {
    if (err) throw err;
    
    util.log("Finished scanning, checking " + packages.length + " packages against npm registry...");
    
    for (i=0; i < packages.length; i++) {
      var packageName = packages[i];
      checkRegistry(packageName);
    }
  }
)

function processFile(file) {
  
  // exclude non-js files
  if (file.substr(-3,3) !== '.js') {
    return false;
  }
  
  // exclude hidden files and directories
  if (file.search(/\/\..+/) > 0) {
    return false;
  }
  
  // build array of packages required in this file
  fs.readFile(file, 'utf8', function (err, data) {
    if (err) throw err;
    
    var requires = data.match(/require\(['"][a-z-_\.]*['"]\)/gi);
    for (i=0; i < requires.length; i++) {
      var name = requires[i].match(/['"]([a-z-_\.]*)['"]/)[1];
      if (packages.indexOf(name) < 0) { // don't duplicate
        packages.push(name);
      }
    }
  });
  
  util.log('  ' + file);
}

function checkRegistry(name) {
  
  // Ideally, we'd accomplish the below by using npm programmatically, but instead we're just
  // going to shell out and run npm because even when using npm programmatically, there's
  // apparently no way to stop it spewing output all over stdout/stderr.
  
  exec('npm search ' + name, function (err, stdout, stderr) {
    if (err) throw err;
  
    util.log('  ' + name);
  
    // check for npm problems
    if (stderr.search(/npm not ok/) > 0) {
      throw "npm error, check your npm installation"
    }
  
    // see if any lines contain name@version as the first token
    var cleanLines = [];
    var lines = stdout.split("\n");
  
    for (i=0; i < lines.length; i++) {
      var line = lines[i];
      var nameParts = line.split(' ')[0].split('@');
      if (nameParts[0] === name && nameParts.length === 2) {
        util.log('    ' + 'found');
        npmPackages.push(name);
        break;
      }
    }
  });
}
