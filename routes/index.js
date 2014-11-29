var express = require('express');
var router = express.Router();

/**
 * Middleware system (will be called in every request)
 */
router.use(function(req, res, next) {

	//debug.info('Trying to access page (%s) %s',req.method, req.url);
	next();	

});

/**
 * Home page (the user might be redirected elsewhere after hitting the page)
 */
 router.get('/', function(req, res) {

	 server = require('../api/controllers/app_controller');
	 server.app(req, res);

 });

 router.get('/configs', function(req, res) {

 	server = require('../api/controllers/app_controller');
 	server.configs(req, res);

 });

 module.exports = router;


