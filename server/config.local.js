if (typeof process.env.PORT !== 'undefined' || typeof process.env.HOST !== 'undefined')

    module.exports = { port: process.env.PORT,
					   host: 'mass-demo.herokuapp.com'
};
else
    module.exports = { };
