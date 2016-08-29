var path = require('path')
module.exports = function(server) {
  var router = server.loopback.Router();
  router.get('/status', server.loopback.status());

  router.get('*.*', function (request, response){
    response.sendFile(path.resolve('client' + request.url))
  });

  router.get('*', function (request, response){
    response.sendFile(path.resolve('client', 'index.html'))
  })
  
  server.use(router);
};
