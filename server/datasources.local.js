if (typeof process.env.EMAIL !== 'undefined')

    module.exports = { emailSender: {transports: [ {auth: {
            user: process.env.EMAIL,
            pass: process.env.PWDEMAIL
          }}]}};
else
    module.exports = { };
