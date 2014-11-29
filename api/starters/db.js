/**
 * Database
 *
 * @module      :: Service
 * @description	:: Here we will put all the methods linked to the database
 */

var $h = require(__ROOT__ + '/api/helpers');

module.exports = function(req, res) {

	/**
	 * We load mongoose
	 */
	var mongoose = require('mongoose');
	var validate = require('mongoose-validator');

	mongoose.connect('mongodb://localhost/unicorn');
	mongoose.set('debug', true);

	/**
	 * We check if the connection is ok
	 * If so we will continue to load everything ...
	 */
	var db = mongoose.connection;

	$h.logs.info('Try to connect to MongoDB via Mongoose ...');

	db.on('error', function(error) { $h.logs.error('Mongoose connection error: ' + error); });
	db.once('open', function callback() {

		$h.logs.success('Connected to MongoDB !');

	});

	/**
	 * Let's make our MongoDB Schemas/Models
	 */
	return {

	 	Mongo: mongoose,
	 	Validate: validate,
	 	ObjectId: mongoose.Types.ObjectId,

		User: require('../models/User.js')(mongoose, validate),
		Server: require('../models/Server.js')(mongoose, validate),
		Chronicle: require('../models/Chronicle.js')(mongoose, validate),
		Track: require('../models/Track.js')(mongoose, validate),
		Media: require('../models/Media.js')(mongoose, validate)

	 };

}