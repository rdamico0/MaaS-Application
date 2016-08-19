var ut = require('./methodDisabling');

module.exports = function(DbCompany) {

	ut.disableAllMethodsBut(DbCompany);
};
