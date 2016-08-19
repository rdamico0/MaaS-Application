var config = require('../../server/config.json');
var path = require('path');
var ut = require('./methodDisabling');


module.exports = function(Account) {
	
	var mte = ['login','logout','exists','confirm','resetPassword'];
	ut.disableAllMethodsBut(Account, mte);

};
