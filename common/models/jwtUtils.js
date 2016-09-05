var app = require('../../server/server.js');
var jwt = require('jwt-simple');

module.exports = {
	decodeJWT: function (token)
	{
		try{
			return jwt.decode(token.id, app.get('jwtTokenSecret'));
		}
		catch(err){
			return null;
		}
	},

	encodeJWT: function (object)
	{
		try{
			return jwt.encode(object, app.get('jwtTokenSecret'));
		}
		catch(err){
			return null;
		}
	}
}
