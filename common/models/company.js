var config = require('../../server/config.json');
var path = require('path');
var ut = require('./methodDisabling');

module.exports = function(Company) {

	var mte = ['create', 'exists', 
'__findById__dsls', '__destroyById__dsls', '__updateById__dsls', '__get__dsls', '__create__dsls',
'__findById__databases', '__destroyById__databases', '__updateById__databases', '__get__databases', '__create__databases', '__findById__users', '__destroyById__users', '__updateById__users', '__get__users', '__create__users'];
	ut.disableAllMethodsBut(Company, mte);

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

	Company.beforeRemote('*.__get__dsls', function(context, whatever, next) {
		console.log(context.req.accessToken);
		next();
	});
};
