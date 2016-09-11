var config = require('../../server/config.json');
var app = require('../../server/server.js');
//var jwt = require('jwt-simple');

var jwt = require('./jwtUtils');
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
'__destroyById__dsls', '__updateById__dsls', '__get__dsls', '__create__dsls',
'__findById__databases', '__destroyById__databases', '__updateById__databases', '__get__databases', '__create__databases',
'__findById__users', '__destroyById__users', '__updateById__users', '__get__users', '__create__users'];
	ut.disableAllMethodsBut(Company, mte);

  Company.accessLevels = function(company, userId, al, cb){
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
		var user = jwt.decodeJWT(context.req.accessToken);
		if(!user)
			next(inper);
		if(user.company != context.ctorArgs.id)
			next(wrcon);
		if(user.duty < 2 && context.args.data.permits > 0)
			next(inper);
		next();
	});

	Company.beforeRemote('*.__get__dsls', function(context, whatever, next) {
		var user = jwt.decodeJWT(context.req.accessToken);
		if(!user)
			next(inper);
		context.args.filter = {where: {or: [{permits: 1}, {permits: 2}, {permits: 3}, {accountId: user.email}]}}
		if(user.company != context.ctorArgs.id)
			next(wrcon);
		if(user.duty < 2){
			next();
		}
		else if(context.args.filter == "public"){
			context.args.filter = {where: {or: [{permits: 1}, {permits: 2}, {permits: 3}]}}
			next();
		}
		else if(context.args.filter == "private"){
			context.args.filter = {where: {permits: 0}}
			next();
		}
		else{
			context.args.filter = {}
			next();
		}
	});

	Company.beforeRemote('*.__updateById__dsls', function(context, whatever, next) {
		var user = jwt.decodeJWT(context.req.accessToken);
		if(!user)
			next(inper);
		if(user.company != context.ctorArgs.id)
			next(wrcon);
		var Dsls = app.models.DSL;
		Dsls.findById(context.args.fk, function (err, instance) {
			if(context.args.data.accountId)   //tried to modify writer - STOP
				next(inper);
			if(context.args.data.permits && (instance.permits == 0 || user.duty < 2)) //tried to modify permits by not admin or of a private DSL
				next(inper);
		  if(user.duty >= 2) //ADMIN following rules
				next();
			else if(instance.accountId == user.email) //writer modifying his DSL
				next();
			else if(instance.permits > 2) //member modifying a shared DSL
				next();
			else
				next(inper);
		});

	});

	Company.beforeRemote('*.__destroyById__dsls', function(context, whatever, next) {
		var user = jwt.decodeJWT(context.req.accessToken);
		if(!user)
			next(inper);
		if(user.company != context.ctorArgs.id)
			next(wrcon);
		if(user.duty < 2){
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

// </editor-fold>

// <editor-fold>  DATABASE HOOKS

	Company.beforeRemote('*.__create__databases', function(context, whatever, next) {
		var user = jwt.decodeJWT(context.req.accessToken);
		if(!user)
			next(inper);
		if(user.company != context.ctorArgs.id)
			next(wrcon);
		if(user.duty < 2)
			next(inper);
		next();
	});

	Company.beforeRemote('*.__get__databases', function(context, whatever, next) {
		var user = jwt.decodeJWT(context.req.accessToken);
		if(!user)
			next(inper);
		if(user.company != context.ctorArgs.id)
			next(wrcon);
		next();
	});

	Company.beforeRemote('*.__updateById__databases', function(context, whatever, next) {
		var user = jwt.decodeJWT(context.req.accessToken);
		if(!user)
			next(inper);
		if(user.company != context.ctorArgs.id)
			next(wrcon);
		if(user.duty < 2)
			next(inper);
		next();
	});

	Company.beforeRemote('*.__destroyById__databases', function(context, whatever, next) {
		var user = jwt.decodeJWT(context.req.accessToken);
		if(!user)
			next(inper);
		if(user.company != context.ctorArgs.id)
			next(wrcon);
		if(user.duty < 2)
			next(inper);
		next();
	});

	Company.beforeRemote('*.__findById__databases', function(context, whatever, next) {
		var user = jwt.decodeJWT(context.req.accessToken);
		if(!user)
			next(inper);
		if(user.company != context.ctorArgs.id)
			next(wrcon);
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
			user: userInstance
		};

		userInstance.verify(options, function(err, response) {
			if (err) return console.log(err);
				console.log('> verification email sent:', response);
					next();
		});
	});

	Company.beforeRemote('*.__create__users', function(context, whatever, next) {
		var user = jwt.decodeJWT(context.req.accessToken);
		if(!user){
			Company.findById(context.ctorArgs.id, function (err, instance) {
				if(instance.ownerId != context.args.data.id){
					var cntdl = new Error();
					cntdl.status = 422;
					cntdl.message = 'Owner not Matching';
					cntdl.code = 'UNPROCESSABLE_ENTITY';
					next(cntdl);
				}
				next();
			});
		}
		else{
			console.log(user);
			if(user.company != context.ctorArgs.id)
				next(wrcon);
			if(context.args.data.dutyId != 1 && context.args.data.dutyId != 2){
				var invdt = new Error();
				invdt.status = 422;
				invdt.message = 'Level Access Must be 1 or 2';
				invdt.code = 'UNPROCESSABLE_ENTITY';
				next(invdt);
			}
			if(context.args.data.emailVerified){
				var invdt = new Error();
				invdt.status = 422;
				invdt.message = 'Cant set Email Verified to true!';
				invdt.code = 'UNPROCESSABLE_ENTITY';
				next(invdt);
			}
			next();
		}
	});

	Company.beforeRemote('*.__get__users', function(context, whatever, next) {
		var user = jwt.decodeJWT(context.req.accessToken);
		if(!user)
			next(inper);
		if(user.company != context.ctorArgs.id)
			next(wrcon);
		if(user.duty < 2)
			next(inper);
		next();
	});

	Company.beforeRemote('accessLevels', function(context, whatever, next) {
		var user = jwt.decodeJWT(context.req.accessToken);
		if(!user)
			next(inper);
		if(user.company != context.args.id)
			next(wrcon);
		if(user.duty < 2)
			next(inper);
		if(context.args.value < 1 || context.args.value > 2){
			var invdt = new Error();
			invdt.status = 422;
			invdt.message = 'Level Access Must be 1 or 2';
			invdt.code = 'UNPROCESSABLE_ENTITY';
			next(invdt);
		}
		var Accounts = app.models.Account;
		Accounts.findById(context.args.fk, function (err, instance) {
			if(instance.dutyId > 2){
				var cntdl = new Error();
				cntdl.status = 401;
				cntdl.message = 'Cant change level 3 users';
				cntdl.code = 'AUTHORIZATION_REQUIRED';
				next(cntdl);
			}
			next();
		});

	});

	Company.beforeRemote('*.__destroyById__users', function(context, whatever, next) {
		var user = jwt.decodeJWT(context.req.accessToken);
		if(!user)
			next(inper);
		if(user.company != context.ctorArgs.id)
			next(wrcon);
		if(user.duty < 2)
			next(inper);
		var Accounts = app.models.Account;
		Accounts.findById(context.args.fk, function (err, instance) {
			if(instance.dutyId > 2){
				var cntdl = new Error();
				cntdl.status = 401;
				cntdl.message = 'Cant delete level 3 users';
				cntdl.code = 'AUTHORIZATION_REQUIRED';
				next(cntdl);
			}
			next();
		});
	});

	Company.beforeRemote('*.__findById__users', function(context, whatever, next) {
		var user = jwt.decodeJWT(context.req.accessToken);
		if(!user)
			next(inper);
		if(user.company != context.ctorArgs.id)
			next(wrcon);
		if(user.duty < 2)
			next(inper);
		next();
	});

// </editor-fold>

};
