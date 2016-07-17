// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var sitemap = require('./app/controllers/sitemap/sitemap.controller');
var timeout = require('connect-timeout');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8888;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function (req, res, next) {
  // do logging
  console.log('Something is happening.');
  // Website you wish to allow to connect
  //res.setHeader('Access-Control-Allow-Origin', 'http://dimpdigital.com');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next(); // make sure we go to the next routes and don't stop here
});

// more routes for our API will happen here
router.route('/sitemap').get(sitemap.list);

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', router);
app.use(timeout(12000000));

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
