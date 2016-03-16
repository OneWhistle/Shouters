//Modules
var restify = require('restify');
var loadash = require('lodash');
var db = require("./db.js");


var app = restify.createServer({name: 'Shouter'});
app.use(restify.acceptParser(app.acceptable));
app.use(restify.queryParser());
app.use(restify.bodyParser());

 // Emitted after a route has finished all the handlers
app.on('after', function (req, res, route, error) {
  req.debug("%s %s", req.method, req.url);
  req.debug("%s %s", req.headers['Authorization'], req.headers['user-agent']);
  req.debug(req.params);
  req.debug("%d %s", res.statusCode, res._data ? res._data.length : null);
});

console.log("Starting up the server");
console.log("Connecting to MongoDB");

function start(cb) {
  cb = cb || function(err){
    if(err){
      throw err;
    }
  };
  var m = db.connect(function (err) {
    if (err) {
      throw err;
      process.exit(-1);
    }

    // Initialize the database
    db.init(function (err) {
      if (err) {
        console.log("Error initializing DB");
        process.exit(-1);
      }

      app.use(function(req,res,next){
        req.db = m;
        next();
      });
      require("./route")(app);

      app.listen(process.env.PORT || 3000, function (err) {
        console.log(" %s listening at %s", app.name, app.url);
        cb(err);
      });
    });
  });
}
if (module.parent) {
  module.exports = exports = start;
} else {
  start();
}

module.exports.cleanup = function() {
    console.log("Worker PID#" + process.pid + " stop accepting new connections");
    app.close(function (err) {
      console.log("Worker PID#" + process.pid + " shutting down!!!");
      process.send({cmd: 'suicide'});
    });
}
