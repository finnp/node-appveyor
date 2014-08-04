var request = require('request')
var ghslug = require('github-slug')
var Configstore = require('configstore');
var EventEmitter = require('events').EventEmitter
var extend = require('util').inherits
var fs = require('fs')
var path = require('path')

extend(AppVeyor, EventEmitter)
module.exports = AppVeyor

function AppVeyor(configstore) {
  this.configstore = configstore || new Configstore('appveyorjs')
  this.headers = {
    'User-Agent': 'node-appveyor'
  }
}

AppVeyor.prototype.auth = function (token) {
  var savedToken = this.configstore.get('token', token)
  if(!token) {
    var savedToken = this.configstore.get('token', token)
    if(savedToken) {
      this.emit('token', savedToken)
    } else {
      this.emit('error', new Error('You have to specify a token'))
    }
  } else {
    this.configstore.set('token', token)
    this.emit('token', token)
  }
}

AppVeyor.prototype.hook = function () {
  var self = this
  // get auth token
  self._getToken(function (token) {
    self.headers.Authorization = 'Bearer ' + token
    // get github slug for the directory
    ghslug(process.cwd(), function (err, slug) {
      if(err) {
        self.emit('error', err)
        return
      }
      
      var opts = {}
      opts.json = {
        repositoryProvider: 'gitHub',
        repositoryName: slug
      }
      opts.method = 'POST'
      opts.url = 'https://ci.appveyor.com/api/projects'
      opts.headers = self.headers

      request(opts, function (err, res, data) {
        if(err) {
          self.emit('error', err)
          return
        }
        if(data.created) {
          self.emit('hook', slug)
        } else {
          self.emit('error', new Error('Could not hook project - ' + data.message))
        }

    })  
    })
  })
  
}

AppVeyor.prototype.yml = function (stream) {
  var from = fs.createReadStream(path.join(__dirname, 'appveyor.yml'))
  from.pipe(fs.createWriteStream(path.join(process.cwd(), 'appveyor.yml')))
  if(stream) 
    from.pipe(stream)
}

AppVeyor.prototype.badge = function (stream) {
  var self = this
  ghslug(process.cwd(), function (err, slug) {
    if(err) {
      self.emit('error', err)
      return
    }
    stream.write('[![Windows Build status](http://img.shields.io/appveyor/ci/' + slug + '.svg)]')
    stream.write('(https://ci.appveyor.com/project/' + slug + '/branch/master)\n')
  })
}

AppVeyor.prototype._getToken = function (cb) {
  var token = this.configstore.get('token')
  if(token) {
    cb(token)
  } else {
    this.emit('error', new Error('You first have to auth with a token.'))
  }
}
  