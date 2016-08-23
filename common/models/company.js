var config = require('../../server/config.json');
var app = require('../../server/server.js');
var jwt = require('jwt-simple');
var path = require('path');
var ut = require('./methodDisabling');

const wrcon = new Error();
const inper = new Error();
module.exports = function(Company) {

	wrcon.status = 401;
	wrcon.message = 'Not your company';
	wrcon.code = 'AUTHORIZATION_REQUIRED';

	inper.status = 401;
	inper.message = 'Insufficient Permission';
	inper.code = 'AUTHORIZATION_REQUIRED';

	var mte = ['create', 'exists',
'__findById__dsls', '__destroyById__dsls', '__updateById__dsls', '__get__dsls', '__create__dsls',
'__findById__databases', '__destroyById__databases', '__updateById__databases', '__get__databases', '__create__databases',
'__findById__users', '__destroyById__users', '__updateById__users', '__get__users', '__create__users'];
	ut.disableAllMethodsBut(Company, mte);

  Company.accessLevels = function(company, userId, al, cb){
		console.log("CODE HERE");
		var Accounts = app.models.Account;
		Accounts.findById(userId, function (err, instance) {
			instance.updateAttribute('dutyId',al,cb())
		});
		cb()
	};

  Company.remoteMethod('accessLevels',{
		accepts: [
			{ arg: 'id', type: 'string', required: true,
				http: { source: 'path' }},
			{ arg: 'fk', type: 'string', required: true,
				http: { source: 'path' }},
			{ arg: 'lv', type: 'number', required: true,
				http: { source: 'path' }},
			],
      http: { path: '/:id/users/:fk/permit/:lv', verb: 'post' }
	});

// <editor-fold>  DSLI HOOKS

	Company.beforeRemote('*.__create__dsls', function(context, whatever, next) {
		var user = jwt.decode(context.req.accessToken.id, app.get('jwtTokenSecret'));
		if(user.company != context.ctorArgs.id)
			next(wrcon);
		else
			next();
	});

	Company.beforeRemote('*.__get__dsls', function(context, whatever, next) {
		var user = jwt.decode(context.req.accessToken.id, app.get('jwtTokenSecret'));
		if(user.company != context.ctorArgs.id)
			next(wrcon);
		else
			next();
	});

	Company.beforeRemote('*.__updateById__dsls', function(context, whatever, next) {
		var user = jwt.decode(context.req.accessToken.id, app.get('jwtTokenSecret'));
		if(user.company != context.ctorArgs.id)
			next(wrcon);
		else if(user.duty < 2){
			var Dsls = app.models.DSL;
			Dsls.findById(context.args.fk, function (err, instance) {
				if(instance.accountId == user.email)
					next();
				else if(instance.permits == 3)
					next();
				else
					next(inper);
			});
		}
		else
			next();
	});

	Company.beforeRemote('*.__destroyById__dsls', function(context, whatever, next) {
		var user = jwt.decode(context.req.accessToken.id, app.get('jwtTokenSecret'));
		if(user.company != context.ctorArgs.id)
			next(wrcon);
		else if(user.duty < 2){
			var Dsls = app.models.DSL;
			Dsls.findById(context.args.fk, function (err, instance) {
				if(instance.accountId == user.email)
					next();
				else if(instance.permits == 3)
					next();
				else
					next(inper);
			});
		}
		else
			next();
	});

	Company.beforeRemote('*.__findById__dsls', function(context, whatever, next) {
		var user = jwt.decode(context.req.accessToken.id, app.get('jwtTokenSecret'));
		if(user.company != context.ctorArgs.id)
			next(wrcon);
		else
			next();
	});

// </editor-fold>

// <editor-fold>  DATABASE HOOKS

	Company.beforeRemote('*.__create__databases', function(context, whatever, next) {
		var user = jwt.decode(context.req.accessToken.id, app.get('jwtTokenSecret'));
		if(user.company != context.ctorArgs.id)
			next(wrcon);
		else if(user.duty < 2)
			next(inper);
		else
			next();
	});

	Company.beforeRemote('*.__get__databases', function(context, whatever, next) {
		var user = jwt.decode(context.req.accessToken.id, app.get('jwtTokenSecret'));
		if(user.company != context.ctorArgs.id)
			next(wrcon);
		else
			next();
	});

	Company.beforeRemote('*.__updateById__databases', function(context, whatever, next) {
		var user = jwt.decode(context.req.accessToken.id, app.get('jwtTokenSecret'));
		if(user.company != context.ctorArgs.id)
			next(wrcon);
		else if(user.duty < 2)
			next(inper);
		else
			next();
	});

	Company.beforeRemote('*.__destroyById__databases', function(context, whatever, next) {
		var user = jwt.decode(context.req.accessToken.id, app.get('jwtTokenSecret'));
		if(user.company != context.ctorArgs.id)
			next(wrcon);
		else if(user.duty < 2)
			next(inper);
		else
			next();
	});

	Company.beforeRemote('*.__findById__databases', function(context, whatever, next) {
		var user = jwt.decode(context.req.accessToken.id, app.get('jwtTokenSecret'));
		if(user.company != context.ctorArgs.id)
			next(wrcon);
		else
			next();
	});

// </editor-fold>

// <editor-fold>  USER HOOKS

	Company.afterRemote('*.__create__users', function(context, userInstance, next) {
		console.log('> user.afterRemote triggered');

		var options = {
			type: 'email',
			to: userInstance.email,
			from: 'noreply@loopback.com',
			subject: 'Thanks for registering.',
			redirect: '/',
			user: userInstance
		};

		userInstance.verify(options, function(err, response) {
			if (err) return console.log(err);
				console.log('> verification email sent:', response);
					next();
		});
	});

	Company.beforeRemote('*.__create__users', function(context, whatever, next) {
		if(context.args.data.dutyId < 1 || context.args.data.dutyId > 3){
			var invdt = new Error();
			invdt.status = 422;
			invdt.message = 'Level Access Must be 1, 2 or 3';
			invdt.code = 'UNPROCESSABLE_ENTITY';
			next(invdt);
		}
		else if(context.args.data.emailVerified){
			var invdt = new Error();
			invdt.status = 422;
			invdt.message = 'Cant set Email Verified to true!';
			invdt.code = 'UNPROCESSABLE_ENTITY';
			next(invdt);
		}
		else if(context.args.data.dutyId == 3){
			Company.findById(context.ctorArgs.id, function (err, instance) {
				if(instance.ownerId != context.args.data.id){
					var cntdl = new Error();
					cntdl.status = 422;
					cntdl.message = 'Owner not Matching';
					cntdl.code = 'UNPROCESSABLE_ENTITY';
					next(cntdl);
				}
				else
					next();
			});
		}
		else
			next();
	});

	Company.beforeRemote('*.__get__users', function(context, whatever, next) {
		var user = jwt.decode(context.req.accessToken.id, app.get('jwtTokenSecret'));
		if(user.company != context.ctorArgs.id)
			next(wrcon);
		else if(user.duty < 2)
			next(inper);
		else
			next();
	});

	Company.beforeRemote('accessLevels', function(context, whatever, next) {
		var user = jwt.decode(context.req.accessToken.id, app.get('jwtTokenSecret'));
		if(user.company != context.args.id)
			next(wrcon);
		else if(user.duty < 2)
			next(inper);
		else if(context.args.value < 1 || context.args.value > 2){
			var invdt = new Error();
			invdt.status = 422;
			invdt.message = 'Level Access Must be 1 or 2';
			invdt.code = 'UNPROCESSABLE_ENTITY';
			next(invdt);
		}
		else{
			var Accounts = app.models.Account;
			Accounts.findById(context.args.fk, function (err, instance) {
				if(instance.dutyId > 2){
					var cntdl = new Error();
					cntdl.status = 401;
					cntdl.message = 'Cant change level 3 users';
					cntdl.code = 'AUTHORIZATION_REQUIRED';
					next(cntdl);
				}
				else
					next();
			});
		}
	});

	Company.beforeRemote('*.__destroyById__users', function(context, whatever, next) {
		var user = jwt.decode(context.req.accessToken.id, app.get('jwtTokenSecret'));
		if(user.company != context.ctorArgs.id)
			next(wrcon);
		else if(user.duty < 2)
			next(inper);
		else{
			var Accounts = app.models.Account;
			Accounts.findById(context.args.fk, function (err, instance) {
				if(instance.dutyId > 2){
					var cntdl = new Error();
					cntdl.status = 401;
					cntdl.message = 'Cant delete level 3 users';
					cntdl.code = 'AUTHORIZATION_REQUIRED';
					next(cntdl);
				}
				else
					next();
			});
		}
	});

	Company.beforeRemote('*.__findById__users', function(context, whatever, next) {
		var user = jwt.decode(context.req.accessToken.id, app.get('jwtTokenSecret'));
		if(user.company != context.ctorArgs.id)
			next(wrcon);
		else if(user.duty < 3)
			next(inper);
		else
			next();
	});

// </editor-fold>

/*
	Company.beforeRemote('*.__get__users', function(context, whatever, next) {
		var user = jwt.decode(context.req.accessToken.id, app.get('jwtTokenSecret'));

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
*/
};
