/**
 * Sockets
 *
 * @module      :: Starter
 * @description	:: It's all about the sockets which communicate between the front and the back-end
 * 
 */

var $h = require(__ROOT__ + '/api/helpers');

module.exports = function() {

	$h.logs.info('Loading Socket.io module ...');

	/**
	 * We make the server
	 */
	var http = require("http"),
		server = http.createServer().listen($h.configs.sockets.port);
	/**
	 * We load and inject SocketIO (Verbosity depending on the environment)
	 */
	var	io = require('socket.io').listen(server, {log: true}),
		fs = require('fs');

	if ($h.configs.about.environment === 'testing') {
		io.set('log level', 3); // Full debug
	} else if ($h.configs.about.environment === 'development')  {
		io.set('log level', 2); // Infos
	} else {
		io.set('log level', 1); // Errors
	}

	/**
	 * Let's export the instance
	 */
	return io.sockets

}
