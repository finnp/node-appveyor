var test = require('tape')
var nock = require('nock')
var AppVeyor = require('./index.js')

var store = {
  set: function (key, value) {
    this[key] = value;
  },
  get: function (key) {
    return this[key];
  }
}

// right now only the hook function is tested

test('hook', function (t) {
  t.plan(2)
  
  store.set('token', 'testtoken')
  var appveyor = new AppVeyor(store)

  var hookMock = nock('https://ci.appveyor.com', {
    reqheaders: {
      'Authorization': 'Bearer testtoken'
    }
  })
  
  .get('/api/projects/finnp/node-appveyor')
  .reply(200, {message: 'not exists'})
  
  .post('/api/projects')
  .reply(200, {created: 'randomtruthytimestamp'})
  
  
  appveyor.on('error', t.fail)
  
  appveyor.on('hook', function (data) {
    t.pass('Hook event was called')
    t.ok(data.new, 'new hook')
  })
  
  appveyor.hook()
  
})
