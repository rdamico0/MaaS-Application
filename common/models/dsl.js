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
		DSL.findById(id, function (err, instance) {
			var Database = app.models.Database;
			var tempId = "57c6a6831013c100113951d8"
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
							catch(ex) {cb(ex)}
						});
					}
					catch(ex1) {cb(ex1)}
				});
			}
			catch(ex2) {cb(ex2)}
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
		var user = jwt.decodeJWT(context.req.accessToken);
		if(!user || !context.args.id || context.args.id == undefined){
		  console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
			next(inper);
		}
		else{
			console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
			DSL.findById(context.args.id, function (err, instance) {
				if(user.company != instance.companyId)
					next(wrcon);
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

};
