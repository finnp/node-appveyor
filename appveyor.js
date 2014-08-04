#!/usr/bin/env node
var AppVeyor = require('./index.js');
var Configstore = require('configstore');

var appveyor = new AppVeyor(new Configstore('appveyorjs'));

appveyor.on('error', function (error) {
  console.error(error)
})

appveyor.on('token', function (token) {
  console.log('Token is set to ' + token)
})

appveyor.on('hook', function (slug) {
  console.log('Project ' + slug + ' activated')
})

var program = require('nomnom').script('appveyor')

program.command('auth')
  .help('set the auth token for AppVeyor')
  .option('token', {
    abbr: 't',
    help: 'the AppVeyor API token'
  })
  .callback(function (opts) {
    appveyor.auth(opts.token)
  })
  
program.command('hook')
  .help('activate AppVeyor for the current project')
  .callback(function (opts) {
    appveyor.hook()
  })
  
program.parse()