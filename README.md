# AppVeyor
Mac / Linux | Windows
----        | ----
[![Build Status](https://travis-ci.org/finnp/node-appveyor.svg?branch=master)](https://travis-ci.org/finnp/node-appveyor) | [![Windows Build status](http://img.shields.io/appveyor/ci/finnp/node-appveyor.svg)](https://ci.appveyor.com/project/finnp/node-appveyor/branch/master)

A javascriptable CLI for AppVeyor for node projects. It is basically the
AppVeyor equivalent of [travisjs](https://www.npmjs.org/package/travisjs).

Install with `npm install appveyor -g`

```
Usage: appveyor <command>

command
  auth      set the auth token for AppVeyor
  init      initialize AppVeyor project (yml and hook)
  hook      activate AppVeyor for the current project
  yml       create a appveyor.yml file in the current directory
  badge     print the text for the badge (shields.io)
  open      open AppVeyor page

Usage for commands: appveyor <command> --help
```

The commands map to the specific functions. For now look at
the source code for details.
```js
var AppVeyor = require('appveyor')
var appveyor = new AppVeyor()
appveyor.auth('<your token>') // saved locally
appveyor.badge(process.stdout) // prints the badge
```