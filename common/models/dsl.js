var config = require('../../server/config.json');
var app = require('../../server/server.js');
var jwt = require('jwt-simple');
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
		DSL.findById(id, function (err, instance) {
			var Database = app.models.Database;
			var tempId = "57c6a6831013c100113951d8"
			try{
				Database.findById(tempId, function (err, db) {
					MongoClient.connect(db.uri, function(err, db) {
					  assert.equal(null, err);
					  execute(data.query, db, function(err, docs) {
					     db.close();
				 			 cb(err, docs);
					  });
					});
				});
			}
			catch(err) {
	    	cb(err);
			}
		});
	};

	var execute = function(query, db, callback) {
	 //query = db.collection('Account').find({companyId:'matrioska'})
	 query = eval(query)
	 var count = 0
	 var results = []
   query.each(function(err, doc) {
      assert.equal(err, null);
    	if (doc != null) {
	       results[count] = doc;
				 count = count + 1;
      } else {
         callback(err, results);
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
		var user = jwt.decode(context.req.accessToken.id, app.get('jwtTokenSecret'));

		DSL.findById(context.args.id, function (err, instance) {
			context.result.DSLcode = instance.code;
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
	});

};
