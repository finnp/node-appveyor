#!/usr/bin/env node
var AppVeyor = require('./index.js')

var appveyor = new AppVeyor()

appveyor.on('error', function (error) {
  console.error(error)
})

appveyor.on('token', function (token) {
  console.log('Token is set to ' + token)
})

appveyor.on('hook', function (data) {
  var already = !data.new ? ' already' : ''
  console.log('Project ' + data.slug + already + ' activated')
})

appveyor.on('auth_deleted', function () {
  console.log('Authentification removed.')
})

var program = require('nomnom').script('appveyor')

program.help('Usage for commands: appveyor <command> --help')

program.command('auth')
  .help('set the auth token for AppVeyor')
  .option('token', {
    abbr: 't',
    help: 'the AppVeyor API token (https://ci.appveyor.com/api-token)',
    position: 1
  })
  .option('delete', {
    abbr: 'd',
    help: 'delete the auth',
    flag: true
  })
  .callback(function (opts) {
    appveyor.auth(opts)
  })
  
program.command('init')
  .help('initialize AppVeyor project (yml and hook)')
  .callback(function (opts) {
    console.log('Writing appveyor.yml..')
    appveyor.yml()
    console.log('Activating hook..')
    appveyor.hook()
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
  
program.command('open')
  .help('open AppVeyor page')
  .callback(function (opts) {
    appveyor.open()
  })
  
program.parse()