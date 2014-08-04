#!/usr/bin/env node
var AppVeyor = require('./index.js')

var appveyor = new AppVeyor()

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
  
program.command('yml')
  .help('create a appveyor.yml file in the current directory')
  .callback(function (opts) {
    appveyor.yml(process.stdout)
  })
  
program.command('badge')
  .help('print the text for the badge (shields.io)')
  .callback(function (opts) {
    appveyor.badge(process.stdout)
  })
  
program.parse()