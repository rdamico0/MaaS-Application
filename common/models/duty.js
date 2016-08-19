module.exports = function(Duty) {

	var ut = require('./methodDisabling');
	ut.disableAllMethodsBut(Duty);

};
