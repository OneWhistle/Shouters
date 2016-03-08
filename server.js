if(process.env.NEWRELIC == "YES" && process.env.NEWRELIC_LICENSE_KEY){
  require('newrelic');
}

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var bunyan = require('bunyan');
var domain = require('domain');
var db = require('./db.js');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Use domain to catch exceptions
  app.use(function (req, res, next) {
    var d = domain.create();
    domain.active = d;
    d.add(req);
    d.add(res);

    d.on('error', function (err) {
      console.error("Error: " + err.stack);
      res.send(500, err);
      next(err);
    });

    res.on('end', function () {
      d.dispose();
    });

    d.run(next);
  });

  var log = bunyan.createLogger({
    name: 'Shouters',
    streams: [
      {
        level: 'debug',
        stream: process.stdout
      }
    ],
    serializers: bunyan.stdSerializers
  });

  app.log = log;

  app.get('/', function(req, res, next) {
    res.send('welcome to Shouters');
  });

  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err    //chnage err to {} in production
    });
  });

log.info('Server Started');

function startServer(cb) {
  cb = cb || function(err){
      if(err){
        throw err;
      }
    };

    var m = db.connect(function (err) {
    if (err) {
      log.error(err);
      process.exit(-1);
    }

    // Initialize the database
    db.init(function (err) {
      if (err) {
        log.error("Error initializing DB");
        process.exit(-1);
      }

      app.use(function(req,res,next){
        req.db = m;
        next();
      });
      // Load the routes
      require("./route")(app);

    app.listen(process.env.PORT || '8090', function(){
      console.log('Server initiated with WORKERID %d', process.pid );
    });
  });
});
}

if(module.parent){
  module.exports = exports = startServer;
} else {
  startServer();
}
