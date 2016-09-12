var loopback = require('../../node_modules/loopback/lib/loopback');
var utils = require('../../node_modules/loopback/lib/utils');
var path = require('path');
var SALT_WORK_FACTOR = 10;
var crypto = require('crypto');
var scrypt = require('scrypt');
var scryptParameters = scrypt.paramsSync(0.1);

var DEFAULT_TTL = 1209600; // 2 weeks in seconds
var DEFAULT_RESET_PW_TTL = 15 * 60; // 15 mins in seconds
var DEFAULT_MAX_TTL = 31556926; // 1 year in seconds
var assert = require('assert');

var config = require('../../server/config.json');
var app = require('../../server/server.js');

var jwt = require('./jwtUtils');
var path = require('path');
var ut = require('./methodDisabling');
var inper = new Error();

module.exports = function(Account) {

  inper.status = 401;
  inper.message = 'Insufficient Permission';
  inper.code = 'AUTHORIZATION_REQUIRED';

  Account.prototype.createAccessToken = function(ttl, options, cb) {
		var user = options;
    if (cb === undefined && typeof options === 'function') {
      // createAccessToken(ttl, cb)
      cb = options;
      options = undefined;
    }

    cb = cb || utils.createPromiseCallback();

    if (typeof ttl === 'object' && !options) {
      // createAccessToken(options, cb)
      options = ttl;
      ttl = options.ttl;
    }
    options = options || {};
    var userModel = this.constructor;
    ttl = Math.min(ttl || userModel.settings.ttl, userModel.settings.maxTTL);
		var token = jwt.encodeJWT({
		  email: user.email,
			company: user.companyId,
			duty: user.dutyId,
      createdAt: Date.now()
		});
    this.accessTokens.create({
			id: token,
      ttl: ttl
    }, cb);
    return cb.promise;
  };

  Account.login = function(credentials, include, cb, grant) {
    var self = this;
    if (typeof include === 'function') {
      cb = include;
      include = undefined;
    }

    cb = cb || utils.createPromiseCallback();

    include = (include || '');
    if (Array.isArray(include)) {
      include = include.map(function(val) {
        return val.toLowerCase();
      });
    } else {
      include = include.toLowerCase();
    }

    if (!credentials.email) {
      var err2 = new Error('Email is required');
      err2.statusCode = 400;
      err2.code = 'EMAIL_REQUIRED';
      cb(err2);
      return cb.promise;
    }

    self.findById(credentials.email, function(err, user) {
      var defaultError = new Error('login failed');
      defaultError.statusCode = 401;
      defaultError.code = 'LOGIN_FAILED';

      function tokenHandler(err, token) {
        if (err) return cb(err);
        if (Array.isArray(include) ? include.indexOf('user') !== -1 : include === 'user') {
          token.__data.user = user;
        }
        cb(err, token);
      }

      if (err) {
        console.log('An error is reported from User.findOne: %j', err);
        cb(defaultError);
      } else if (user) {
        user.hasPassword(credentials.password, function(err, isMatch) {
          if(!grant){
            if (err) {
              console.log('An error is reported from User.hasPassword: %j', err);
              cb(defaultError);
            }
            else if (isMatch) {
              if (self.settings.emailVerificationRequired && !user.emailVerified) {
                // Fail to log in if email verification is not done yet
                console.log('User email has not been verified');
                err = new Error('login failed as the email has not been verified');
                err.statusCode = 401;
                err.code = 'LOGIN_FAILED_EMAIL_NOT_VERIFIED';
                cb(err);
              }
              else {
                if (user.createAccessToken.length === 2) {
                  user.createAccessToken(credentials.ttl, tokenHandler);
                } else {
                  user.createAccessToken(credentials.ttl, user, tokenHandler);
                }
              }
            }
            else {
              console.log('The password is invalid for user %s', user.email || user.username);
              cb(defaultError);
            }
          }
          else{
            if (user.createAccessToken.length === 2) {
              user.createAccessToken(credentials.ttl, tokenHandler);
            } else {
              user.createAccessToken(credentials.ttl, user, tokenHandler);
            }
          }
        });
      } else {
        console.log('No matching record is found for user %s', credentials.email);
        cb(defaultError);
      }
    });
    return cb.promise;
  };

  Account.logout = function(tokenId, cb) {
    cb = cb || utils.createPromiseCallback();
    this.relations.accessTokens.modelTo.findById(tokenId, function(err, accessToken) {
      if (err) {
        cb(err);
      } else if (accessToken) {
        accessToken.destroy(cb);
      } else {
        cb(new Error('could not find accessToken'));
      }
    });
    return cb.promise;
  };

  Account.impersonate = function(email, include, cb) {
    var Accounts = app.models.Account;
    Accounts.findById(email, function (err, instance) {
      Accounts.login({email:email,password:"password"}, include, function (err, instance){
        var obj = instance;
        cb(err, instance);
      }, true);
    });
  };

  Account.prototype.verify = function(options, cb) {
    cb = cb || utils.createPromiseCallback();

    var user = this;
    var userModel = this.constructor;
    var registry = userModel.registry;
    assert(typeof options === 'object', 'options required when calling user.verify()');
    assert(options.type, 'You must supply a verification type (options.type)');
    assert(options.type === 'email', 'Unsupported verification type');
    assert(options.to || this.email, 'Must include options.to when calling user.verify() or the user must have an email property');
    assert(options.from, 'Must include options.from when calling user.verify()');

    var token = '/repwd?pwd=' + Account.getPasswordToken(options.to);
    options.redirect = token;
    options.template = path.resolve(options.template || path.join(__dirname, '..', '..', 'templates', 'verify.ejs'));
    options.user = this;
    options.protocol = options.protocol || 'http';

    var app = userModel.app;
    options.host = options.host || (app && app.get('clienthost')) || 'localhost';
    //options.port = options.port || (app && app.get('port')) || 3000;
    options.restApiRoot = options.restApiRoot || (app && app.get('restApiRoot')) || '/api';

    var displayPort = (
      (options.protocol === 'http' && options.port == '80') ||
      (options.protocol === 'https' && options.port == '443')
    ) ? '' : ':' + options.port;

    options.verifyHref = options.verifyHref ||
      options.protocol +
      '://' +
      options.host +
      //displayPort +
      options.restApiRoot +
      userModel.http.path +
      userModel.sharedClass.find('confirm', true).http.path +
      '?uid=' +
      options.user.id +
      '&redirect=' +
      options.redirect;

    // Email model
    var Email = options.mailer || this.constructor.email || registry.getModelByType(loopback.Email);

    // Set a default token generation function if one is not provided
    var tokenGenerator = options.generateVerificationToken || Account.generateVerificationToken;

    tokenGenerator(user, function(err, token) {
      if (err) { return cb(err); }

      user.verificationToken = token;
      user.save(function(err) {
        if (err) {
          cb(err);
        } else {
          sendEmail(user);
        }
      });
    });

    // TODO - support more verification types
    function sendEmail(user) {
      options.verifyHref += '&token=' + user.verificationToken;

      options.text = options.text || 'Please verify your email by opening this link in a web browser:\n\t{href}';

      options.text = options.text.replace('{href}', options.verifyHref);

      options.to = options.to || user.email;

      options.subject = options.subject || 'Thanks for Registering';

      options.headers = options.headers || {};

      //var template = loopback.template(options.template);
      //options.html = template(options);
      Email.send(options, function(err, email) {
        if (err) {
          cb(err);
        } else {
          cb(null, {email: email, token: user.verificationToken, uid: user.id});
        }
      });
    }
    return cb.promise;
  };

  Account.helpRequest = function(sender, text, cb) {
    options = {}
    options.type = "email";
    options.text = sender + text;
    options.from = sender;
    options.to = "matrioska.io.go@gmail.com";
    options.subject = "Support Request";

    Account.app.models.Email.send(options, function(err, email) {
      if (err) {
        cb(err);
      } else {
        cb();
      }
    });
  };

  Account.generateVerificationToken = function(user, cb) {
    crypto.randomBytes(64, function(err, buf) {
      cb(err, buf && buf.toString('hex'));
    });
  };

  Account.confirm = function(uid, token, redirect, cb) {
    cb = cb || utils.createPromiseCallback();
    this.findById(uid, function(err, user) {
      if (err) {
        cb(err);
      } else {
        if (user && user.verificationToken === token) {
          user.verificationToken = undefined;
          user.emailVerified = true;
          user.save(function(err) {
            if (err) {
              cb(err);
            } else {
              cb();
            }
          });
        } else {
          if (user) {
            err = new Error('Invalid token: ' + token);
            err.statusCode = 400;
            err.code = 'INVALID_TOKEN';
          } else {
            err = new Error('User not found: ' + uid);
            err.statusCode = 404;
            err.code = 'USER_NOT_FOUND';
          }
          cb(err);
        }
      }
    });
    return cb.promise;
  };

  // <editor-fold>  PASSWORD METHOD

  Account.setPassword = function(pass,token,cb){
		var user = jwt.decodeJWT({id:token});
    if(!user)
      cb(inper);
    Account.findById(user.recover, function (err, instance) {
      var hash = Account.hashPassword(pass);
      instance.updateAttribute('password',hash,cb())
      cb()
    });
  };

  Account.resetPassword = function(email, cb) {
    cb = cb || utils.createPromiseCallback();
    var UserModel = this;
    var ttl = UserModel.settings.resetPasswordTokenTTL || DEFAULT_RESET_PW_TTL;

    if (typeof email !== 'string') {
      var err = new Error('Email is required');
      err.statusCode = 400;
      err.code = 'EMAIL_REQUIRED';
      cb(err);
      return cb.promise;
    }

    UserModel.findOne({ where: {email: email} }, function(err, user) {
      if (err) {
        return cb(err);
      }
      if (!user) {
        err = new Error('Email not found');
        err.statusCode = 404;
        err.code = 'EMAIL_NOT_FOUND';
        return cb(err);
      }

      options = {}
			options.type = "email";
      options.text = "Hi, click here to reset your password: "+(app && app.get('clienthost'))+"/repwd?pwd=" + Account.getPasswordToken(email);
      options.from = "no.reply@maas.com";
      options.to = email;
      options.subject = "Email Recovery";

      Account.app.models.Email.send(options, function(err, email) {
        if (err) {
          cb(err);
        } else {
          cb();
        }
      });

    });

    return cb.promise;
  };

  Account.prototype.hasPassword = function(plain, cb) {
    cb = cb || utils.createPromiseCallback();
    var hashBuffer = new Buffer(this.password, 'base64');
    if (hashBuffer && plain) {
      try{
        cb(null, scrypt.verifyKdfSync(hashBuffer, plain));
      }
      catch(err){
        cb(err, false);
      }
    } else {
      cb(null, false);
    }
    return cb.promise;
  };

  Account.getPasswordToken = function(email){
    var token = jwt.encodeJWT({
      recover: email,
      ttl: 900,
      createdAt: Date.now()
    });
    return token;
  };

  Account.hashPassword = function(plain) {
    this.validatePassword(plain);
    var kdfResult = scrypt.kdfSync(plain, scryptParameters);
    return kdfResult.toString('base64');
  };

  Account.validatePassword = function(plain) {
    if (typeof plain === 'string' && plain) {
      return true;
    }
    var err =  new Error('Invalid password: ' + plain);
    err.statusCode = 422;
    throw err;
  };

  // </editor-fold>

  Account.setup = function() {
    // We need to call the base class's setup method
    Account.base.setup.call(this);
    var UserModel = this;

    // max ttl
    this.settings.maxTTL = this.settings.maxTTL || DEFAULT_MAX_TTL;
    this.settings.ttl = this.settings.ttl || DEFAULT_TTL;

    UserModel.setter.email = function(value) {
      if (!UserModel.settings.caseSensitiveEmail) {
        this.$email = value.toLowerCase();
      } else {
        this.$email = value;
      }
    };

    UserModel.setter.password = function(plain) {
      if (typeof plain !== 'string') {
        return;
      }
      if (plain.indexOf("c2NyeX") === 0 && plain.length === 128) {
        // The password is already hashed. It can be the case
        // when the instance is loaded from DB
        this.$password = plain;
      } else {
        console.log("RECRYPTED BY SETTER");
        this.$password = this.constructor.hashPassword(plain);
      }
    };

    // <editor-fold>  HOOKS

    // Access token to normalize email credentials
    UserModel.observe('access', function normalizeEmailCase(ctx, cb) {
      if (!ctx.Model.settings.caseSensitiveEmail && ctx.query.where && ctx.query.where.email) {
        ctx.query.where.email = ctx.query.where.email.toLowerCase();
      }
      cb();
    });

    // Make sure emailVerified is not set by creation
    UserModel.beforeRemote('create', function(ctx, user, cb) {
      var body = ctx.req.body;
      if (body && body.emailVerified) {
        body.emailVerified = false;
      }
      cb();
    });

    UserModel.beforeRemote('setPassword', function(ctx, user, cb) {
      var user = jwt.decodeJWT({id:ctx.args.resetToken});
      if(!user)
        cb(inper);
      if(user.createdAt + (user.ttl*1000) > Date.now())
    		cb();
      else {
        var tkxp = new Error();
        tkxp.status = 400;
    	  tkxp.message = 'Request expired';
    	  tkxp.code = 'TOKEN_EXPIRED';
        cb(tkxp)
      }
  	});

    UserModel.afterRemote('confirm', function(ctx, inst, cb) {
      if (ctx.args.redirect !== undefined) {
        if (!ctx.res) {
          return cb(new Error('The transport does not support HTTP redirects.'));
        }
        ctx.res.location(ctx.args.redirect);
        ctx.res.status(302);
      }
      cb();
    });

    UserModel.beforeRemote('impersonate', function(context, whatever, cb) {
  		var user = jwt.decodeJWT(context.req.accessToken);
      if(!user || user.duty != 9){
  			cb(inper);
      }
  		else
  			cb();
  	});


    // </editor-fold>

    // <editor-fold>  REMOTE METHODS
    UserModel.remoteMethod(
      'login',
      {
        description: 'Login a user with username/email and password.',
        accepts: [
          {arg: 'credentials', type: 'object', required: true, http: {source: 'body'}},
          {arg: 'include', type: ['string'], http: {source: 'query' },
            description: 'Related objects to include in the response. ' +
            'See the description of return value for more details.'}
        ],
        returns: {
          arg: 'accessToken', type: 'object', root: true,
          description:
            'The response body contains properties of the AccessToken created on login.\n' +
            'Depending on the value of `include` parameter, the body may contain ' +
            'additional properties:\n\n' +
            '  - `user` - `{User}` - Data of the currently logged in user. (`include=user`)\n\n'
        },
        http: {verb: 'post'}
      }
    );

    UserModel.remoteMethod(
      'logout',
      {
        description: 'Logout a user with access token.',
        accepts: [
          {arg: 'access_token', type: 'string', required: true, http: function(ctx) {
            var req = ctx && ctx.req;
            var accessToken = req && req.accessToken;
            var tokenID = accessToken && accessToken.id;

            return tokenID;
          }, description: 'Do not supply this argument, it is automatically extracted ' +
            'from request headers.'
          }
        ],
        http: {verb: 'all'}
      }
    );

    UserModel.remoteMethod(
      'setPassword',
      {
        accepts: [
          {arg: 'pass', type: 'string', required: true},
          {arg: 'resetToken', type: 'string', required: true}
        ],
        http: {verb: 'post', path: '/newpwd'}
      }
    );

    UserModel.remoteMethod(
      'helpRequest',
      {
        accepts: [
          {arg: 'id', type: 'string', required: true, http: { source: 'path' }},
          {arg: 'text', type: 'string', required: true}
        ],
        http: {verb: 'post', path: '/help/:id'}
      }
    );

    UserModel.remoteMethod(
      'confirm',
      {
        description: 'Confirm a user registration with email verification token.',
        accepts: [
          {arg: 'uid', type: 'string', required: true},
          {arg: 'token', type: 'string', required: true},
          {arg: 'redirect', type: 'string'}
        ],
        http: {verb: 'get', path: '/confirm'}
      }
    );

    UserModel.remoteMethod(
      'impersonate',
      {
        accepts: [
          {arg: 'id', type: 'string', required: true},
          {arg: 'include', type: ['string'], http: {source: 'query'}}
        ],
        returns: {arg: 'accessToken', type: 'object', root: true},
        http: {verb: 'post', path: '/:id/impersonate'}
      }
    );

    UserModel.remoteMethod(
      'resetPassword',
      {
        description: 'Reset password for a user with email.',
        accepts: [
          {arg: 'id', type: 'string', required: true, http: {source: 'path'}}
        ],
        http: {verb: 'post', path: '/:id/pwdmail'}
      }
    );

    // </editor-fold>

    // default models
    assert(loopback.Email, 'Email model must be defined before User model');
    UserModel.email = loopback.Email;

    assert(loopback.AccessToken, 'AccessToken model must be defined before User model');
    UserModel.accessToken = loopback.AccessToken;

    // email validation regex
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    UserModel.validatesFormatOf('email', {with: re, message: 'Must provide a valid email'});

    // FIXME: We need to add support for uniqueness of composite keys in juggler
    if (!(UserModel.settings.realmRequired || UserModel.settings.realmDelimiter)) {
      UserModel.validatesUniquenessOf('email', {message: 'Email already exists'});
      UserModel.validatesUniquenessOf('username', {message: 'User already exists'});
    }

    return UserModel;
  };


  Account.setup();

	var mte = ['login','logout','exists','confirm','resetPassword','helpRequest','impersonate','setPassword'];
	ut.disableAllMethodsBut(Account, mte);

};
