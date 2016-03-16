module.exports = function (app){

  app.get('/', function(req, res) {
    res.send(200, {Welcome: true});
  });
}
