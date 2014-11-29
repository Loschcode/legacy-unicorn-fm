/**
 * We load all the services
 */

module.exports = function(req, res) {

	var cookies = require(__ROOT__ + '/api/services/cookies')(req, res);
	var sessions = require(__ROOT__ + '/api/services/sessions')(req, res);
	var memories = require(__ROOT__ + '/api/services/memories')(req, res);
	var stores = require(__ROOT__ + '/api/services/stores')(); // Doesn't need anything but it's a service because it's a memory system

	return {

	cookies: cookies,
	sessions: sessions,
	memories: memories,
	stores: stores,

	socket_connection: null, // Useful to handle on() from everywhere in the application

	// We used a middleware in app.js to get the instance
	db: req.database,
	sockets: req.sockets,

	};


}