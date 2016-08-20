if (typeof process.env.PORT !== 'undefined')

    module.exports = { port: process.env.PORT};
else
    module.exports = { };
