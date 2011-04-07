[npm-detect](http://github.com/tfe/npm-detect/)
============

An npm package for walking a project directory (tree of files) and determining which npm packages are depended on by the project files. It will also generate a sample `dependencies` section suited for inclusion in the project's `package.json` file (see `npm help json` for details).

The implementation is very naive, but should work for most cases:

1. Walk the directory tree, looking for *.js files.
2. Look for `require()` statements that match the pattern for npm package names.
3. Query the npm registry for matching package names.


Installation and Usage
----------------------

Install via npm:

    sudo npm install detect

Run it (example is npm-detect being run on itself):

    $ cd /your/project/dir
    $ npm-detect
    Scanning directory /your/project/dir... 
      ./bin/detect.js
      ./lib/tree-walk.js
    Finished scanning, checking 6 packages against npm registry (be patient)...
      path...
      fs...
      child_process...
      util...
      npm... ✓
      step... ✓
    Finished, 2 npm packages found: 
      npm
      step
    Sample package.json dependencies section:
    {
      "other package.json sections": "go here",
      "dependencies": {
        "npm": "*",
        "step": "*"
      }
    }


To-Do
-----

- allow passing a path to search (defaults to '.'), probably as first argument
- make sure all legal npm package names are covered by the regexes (currently
  letters, numbers, hyphen, underscore, dot)
- add package version numbers to sample package.json output; use tilde version
  specifier with latest version from npm search output
- help output and man page


Contact
-------

Problems, comments, and pull requests all welcome. [Find me on GitHub.](http://github.com/tfe/)


Copyright & License
-------------------

Copyright © 2011 [Todd Eichel](http://toddeichel.com/). Released under the MIT License.
