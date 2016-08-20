var config = require('../../server/config.json');
var app = require('../../server/server.js');
var jwt = require('jwt-simple');
var path = require('path');
var ut = require('./methodDisabling');

module.exports = function(Company) {

	var mte = ['create', 'exists',
'__findById__dsls', '__destroyById__dsls', '__updateById__dsls', '__get__dsls', '__create__dsls',
'__findById__databases', '__destroyById__databases', '__updateById__databases', '__get__databases', '__create__databases', '__findById__users', '__destroyById__users', '__updateById__users', '__get__users', '__create__users'];
	ut.disableAllMethodsBut(Company, mte);

	checkUser = function(current, company, lv){
		var decoded = jwt.decode(current, app.get('jwtTokenSecret'));
		var error = null;
		if(company && company != decoded.company){
			error = new Error();
			error.status = 401;
			error.message = 'Not your company';
			error.code = 'AUTHORIZATION_REQUIRED';
		}
		if(lv && lv > decoded.duty){
			error = new Error();
			error.status = 401;
			error.message = 'Access Level Insufficient';
			error.code = 'AUTHORIZATION_REQUIRED';
		}
		return error;
	};

	Company.afterRemote('*.__create__users', function(context, userInstance, next) {
		console.log('> user.afterRemote triggered');

		var options = {
		  type: 'email',
		  to: userInstance.email,
		  from: 'noreply@loopback.com',
		  subject: 'Thanks for registering.',
		  redirect: '/verified',
		  user: userInstance
		};

		userInstance.verify(options, function(err, response) {
		  if (err) return console.log(err);

		  console.log('> verification email sent:', response);
		  next();

		});

	  });

	/*Company.beforeRemote('**', function(context, whatever, next) {
			console.log('generic');
			var err = checkUser(context.req.accessToken.id, context.ctorArgs.id, 0)
			if(err)
				next(err)
			else
				next()
	});*/

	Company.beforeRemote('*.__findById__dsls', function(context, whatever, next) {
		var err = checkUser(context.req.accessToken.id, context.ctorArgs.id, 0)
		if(!err)
			next(err)
		else{
			var Dsls = app.models.DSL;
			Dsls.findById(context.args.fk, function (err, instance) {
				console.log(instance);
				next(err);
			});
		}
	});
/*
	Company.beforeRemote('*.__get__dsls', function(context, whatever, next) {
		console.log('specific');
		var err = checkUser(context.req.accessToken.id, context.ctorArgs.id, 0)
		if(err)
			next(err)
		else
			next()
	});*/


};
