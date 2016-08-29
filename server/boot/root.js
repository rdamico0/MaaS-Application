var path = require('path')
module.exports = function(server) {
  var router = server.loopback.Router();
  var callback = function (request, response){
    response.sendFile(path.resolve('client', 'index.html'))
  };

  router.get('/status', server.loopback.status());

  router.get('/home', callback);
  router.get('/homeDeveloper', callback);
  router.get('/signIn', callback);
  router.get('/login', callback);
  router.get('/repwd', callback);
  router.get('/profile', callback);
  router.get('/support', callback);
  router.get('/newdsli', callback);
  router.get('/manageuser', callback);
  router.get('/managedsli', callback);
  router.get('/managepvtdsli', callback);
  router.get('/managedata', callback);
  router.get('/editdsli', callback);
  router.get('/execdsli', callback);

  server.use(router);
};
