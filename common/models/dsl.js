var config = require('../../server/config.json');
var app = require('../../server/server.js');
var jwt = require('./jwtUtils');
var ut = require('./methodDisabling');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

const wrcon = new Error();
const inper = new Error();

module.exports = function(DSL) {
	wrcon.status = 401;
	wrcon.message = 'Not your company';
	wrcon.code = 'AUTHORIZATION_REQUIRED';

	inper.status = 401;
	inper.message = 'Insufficient Permission';
	inper.code = 'AUTHORIZATION_REQUIRED';

	var mte = [];
	ut.disableAllMethodsBut(DSL, mte);

	DSL.runquery = function(id, data, cb){
		console.log("EXECUTING QUERY:");
		console.log(data.query);
		var exception = new Error();
		DSL.findById(id, function (err, instance) {
			var Database = app.models.Database;
			var tempId = instance.databaseId;
			try{
				Database.findById(tempId, function (err, db) {
					try{
						MongoClient.connect(db.uri, function(err, db) {
						  try{
							assert.equal(null, err);
							  execute(data.query, db, function(err, docs) {
							     db.close();
						 			 cb(err, docs);
							  });
							}
							catch(ex) {
								exception.status = 551;
								exception.message = 'Database access denied';
								exception.code = 'INVALID_DATABASE';
								cb(exception)}
						});
					}
					catch(ex1) {
						exception.status = 552;
						exception.message = 'Invalid Database';
						exception.code = 'INVALID_DATABASE';
						cb(exception)}
				});
			}
			catch(ex2) {
				exception.status = 553;
				exception.message = 'DSLI with no Database';
				exception.code = 'INVALID_DATABASE';
				cb(exception)}
		});
	};

	var execute = function(query, db, callback) {
		try{
		 //query = db.collection('Account').find({companyId:'matrioska'})
		 query = eval(query)

	 } catch(ex){
			 callback(ex);
		}
		 var count = 0
		 var results = []
	   query.each(function(err, doc) {
			 try{
	      assert.equal(err, null);
	    	if (doc != null) {
		       results[count] = doc;
					 count = count + 1;
	      } else {
	         callback(err, results);
	      }
			}
			catch(ex){
				callback(ex);
			}
	   });
};

	DSL.remoteMethod('runquery',{
		accepts: [
			{ arg: 'id', type: 'string', required: true,
				http: { source: 'path' }},
			{ arg: 'data', type: 'object', required: true,
				http: {source: 'body'}}
			],
			returns: {
				arg: 'mongodata', type: 'object', root: true
			},
      http: { path: '/:id/execute', verb: 'post' }
	});

	DSL.beforeRemote('runquery', function(context, whatever, next) {
		console.log(context.args.data.token);
		var user = jwt.decodeJWT({id:context.args.data.token});
		console.log(user);
		if(!user){
			next(inper);
		}
		else{
			DSL.findById(context.args.id, function (err, instance) {
				if(!instance)
					next(inper);
				else if(user.company != instance.companyId)
					next(wrcon);
				else if(user.dsli == instance.id && (user.createdAt + user.ttl) > Date.now())
					next();
				else if(user.duty >= 2)
					next();
				else if(instance.accountId == user.email)
					next();
				else if(instance.permits > 0)
					next();
				else
					next(inper);
			});
		}
	});

	DSL.sendDSLI = function(id, data, cb){
		cb = cb || utils.createPromiseCallback();
    var UserModel = this;
    var ttl = 15*60*1000;
		var email = data.email

    if (typeof email !== 'string') {
      var err = new Error('Email is required');
      err.statusCode = 400;
      err.code = 'EMAIL_REQUIRED';
      cb(err);
      return cb.promise;
    }

		DSL.findById(id, function (err, instance) {
			var token = jwt.encodeJWT({
				company: instance.companyId,
				dsli: instance.id,
				ttl : ttl,
	      createdAt: Date.now()
			});
	    options = {}
			options.type = "email";
	    options.text = "Hi, click <a href={"+(app && app.get('clienthost'))+"/execdsli?ID="+instance.id+"&GUEST="+token+"}>here</a> to see \""+ instance.name +"\", a MaaS page where you will visualize data.";
	    options.from = "no.reply@maas.com";
	    options.to = email;
	    options.subject = "DSLI Valid Link";

			var Email = app.models.Email;
	    Email.send(options, function(err, email) {
	      if (err) {
	        cb(err);
	      } else {
	        cb();
	      }
	    });
		});
	};

	DSL.remoteMethod('sendDSLI',{
		accepts: [
			{ arg: 'id', type: 'string', required: true,
				http: { source: 'path' }},
			{ arg: 'email', type: 'object', required: true,
				http: {source: 'body'}}
			],
      http: { path: '/:id/sendDSLI', verb: 'post' }
	});

	DSL.beforeRemote('sendDSLI', function(context, whatever, next) {
		var user = jwt.decodeJWT(context.req.accessToken);
		if(!user){
			next(inper);
		}
		else{
			DSL.findById(context.args.id, function (err, instance) {
				if(!instance)
					next(inper);
				else if(user.company != instance.companyId)
					next(wrcon);
				else if(user.duty >= 2)
					next();
				else
					next(inper);
			});
		}
	});

	DSL.getCode = function(id, data, cb){
		cb();
	};

	DSL.afterRemote('getCode', function(context, whatever, next) {
		if(context.args.guest.token)
			var user = jwt.decodeJWT({id:context.args.guest.token});
		else
			var user = jwt.decodeJWT(context.req.accessToken);

		if(!user)
			next(inper);
		else{
			var Dsls = app.models.DSL;
			Dsls.findById(context.args.id, function (err, instance) {
				context.result = instance;
				context.result.DSLcode = instance.code;
				if(user.company != instance.companyId)
					next(wrcon);
				else if(user.dsli == instance.id && (user.createdAt + user.ttl) > Date.now())
					next();
				else if(user.duty >= 2)
					next();
				else if(instance.accountId == user.email)
					next();
				else if(instance.permits > 0)
					next();
				else
					next(inper);
			});
		}
	});

	DSL.remoteMethod('getCode',{
		accepts: [
			{ arg: 'id', type: 'string', required: true,
				http: { source: 'path' }},
			{ arg: 'guest', type: 'object', required: false,
				http: {source: 'body'}}
			],
      http: { path: '/:id/getCode', verb: 'post' }
	});

};
