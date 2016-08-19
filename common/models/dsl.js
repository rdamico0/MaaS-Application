var ut = require('./methodDisabling');

module.exports = function(Dsl) {
	ut.disableAllMethodsBut(Dsl);
};
