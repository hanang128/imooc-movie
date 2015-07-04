var assert = require('chai').assert;
var User = require('../../models/user');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
require('../../db');
should =require('chai');

function getRandomString(len) {
  if (!len) len = 16;
  return crypto.randomBytes(Math.ceil(len / 2)).toString('hex')
}
var user;
describe("UserModel Test", function() {
  before(function(done) {
    // runs before all tests in this block
    User.remove({}, function(err) {
      //throw err;
      assert.equal(err, null);
    });

    user = {
      name: getRandomString(),
      password: 'password'
    }

    done();
  })

  after(function() {


  })
  beforeEach(function() {
    // runs before each test in this block
  })
  afterEach(function() {
    // runs after each test in this block
  })

  describe("before user saved", function() {
    it('should be without test user', function(done) {
      User.findAsync({
        name: user.name
      }).then(function(users) {
        //console.log(users);
        assert.equal(users.length, 0);
        return done();
      }).catch(function(err) {
        assert.equal(err, null);
        return done(err);
      })
    })

  })

  describe("user save", function() {
    it('should save user without error', function(done) {
      var _user = new User(user);
      _user.saveAsync().then(function(user) {
        assert.notEqual(user, null);
        return User.remove({}, function(err) {
          assert.equal(err, null);
          return done();
        });
        //return done();
      }).catch(function(err) {
        console.log(err)
        assert.equal(err, null);
        return done(err);
      })
    })

    /*it('password should be hashed correct', function(done) {
      var _user = new User(user);

        _user.saveAsync().then(function(user) {
        assert.notEqual(user, null);
        bcrypt.compare('password',user.password,null,function(err,match){
          assert.equal(err,null);
          assert.equla(match,true);
          
        })
        return User.remove({}, function(err) {
          assert.equal(err, null);
          return done();
        });
        //return done();
      }).catch(function(err) {
        console.log(err)
        assert.equal(err, null);
        return done(err);
      })
    })*/
    it('should password be hashed correctly', function(done) {
      var password = user.password
      var _user = new User(user)

      _user.save(function(err) {
        assert.equal(err, null);
        assert.notEqual(_user.password.length, 0 )

        bcrypt.compare(password, _user.password, function(err, isMatch) {
         assert.equal(err, null);
         assert.equal(isMatch, true);
         
          _user.remove(function(err) {
            assert.equal(err, null);
            done()
          })
        })
      })
    })

    it('should have default role 0', function(done) {
        var _user = new User(user)

        _user.save(function(err) {
         
          assert.equal(_user.role,0)
          _user.remove(function(err) {
            done()
          })
        })
      })
    })
      it('should fail to save an existing user', function(done) {
        var _user1 = new User(user)

        _user1.save(function(err) {
          assert.equal(err,null)

          var _user2 = new User(user)

          _user2.save(function(err) {
            assert.notEqual(err, null)

            _user1.remove(function(err) {
              if (!err) {
                _user2.remove(function(err) {
                  done()
                })
              }
            })
          })
        })
      })
  
})