if (typeof process.env.PORT !== 'undefined' || typeof process.env.HOST !== 'undefined')

    module.exports = { port: process.env.PORT,
					   host: process.env.HOST
};
else
    module.exports = { };
