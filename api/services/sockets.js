/**
 * Sockets
 *
 * @module      :: Starter
 * @description	:: It's all about the sockets which communicate between the front and the back-end
 * 
 */

var $h = require(__ROOT__ + '/api/helpers');

module.exports = function(sockets) {

	return {

		init: function($s, $w) {

			/**
			 * We first remove the old listeners
			 */
			sockets.removeAllListeners(); // -> OLD FASHION WAY -> the clean way is once()

			/**
			 * Connection
			 */
			 sockets.once('connection', function (socket_io) {

			 	/**
			 	 * We get the connection instance to perform on() everywhere
			 	 */
			 	$s.socket_connection = socket_io;

			 	if ($h.configs.system.reboot > $h.dates.set_past_date(2)) {

			 		// We reset the server
			 		//$w.systems.reboot();

			 		// We tell to tall users we reboot
			 		sockets.emit('unicorn', {method: 'reboot', params: {}});

					/**
					 * The system will blow up if the user continue the reading of this file
					 * Better to end it now (NOTE : It should also be shutdown on the front-end side)
					 */
					 return false;

				}

				$h.logs.info('Someone connected to Socket.io');

				/**
				 * UNICORN SOCKETS GUIDELINE
				 * -------------------
				 *
				 * The complete guideline was made in the front-end side in /sockets.js
				 * 
				 * -------------------
				 */

				/**
				 * DISCONNECT
				 * Socket.io native disconnection handler
				 */
				socket_io.on('disconnect', function (datas) {

				 	var server_process = require(__ROOT__ + '/api/processes/server_process')($s, $w);

				 	memory = $s.memories.all();

					/**
					 * We use the memory to remember which page it was
					 */
					 server_process.manage_disconnect(memory.server, memory.user, memory.device);

				});

				/**
				 * CALLBACKS
				 * Homemade emit() <-> on() callback (from back-end to front-end)
				 */
				socket_io.on('callbacks', function(datas, callback) {

					if (($h.variables.exists(datas.key)) && ($h.variables.exists(datas.feedback))) {

						callback = $s.stores.retrieve(datas.key, true);

						if (callback) {

							callback(datas.feedback);

						}


					}

				});

				/**
				 * SOCKET CONTROLLER
				 * Put all the socket controllers you want to listen right here
				 */
				socket_controllers = ['user', 'server', 'player'];

				/**
				 * First we will fetch all the controllers
				 * And within each controller we will get all the methods
				 */
				 socket_controllers.forEach(function(controller_name) {

				 	// We call the correct controller and initialize $s, $w (services, workers)
				 	controller_instance = require('../sockets/'+ controller_name +'_socket')($s, $w);
				 	controller_methods = $h.variables.get_all_methods(controller_instance);

					/**
					 * We will fetch each controller and assign a 'socket.on' listener to each method of each controller
					 * To call the socket controller, the front-end must use these names
					 */
					 controller_methods.forEach(function(method_name) {

					 	socket_listener = controller_name + '.' + method_name;

					 	socket_io.on(socket_listener, function (datas, callback) {

					 		// To avoid variable replacement from other simultaneous calls
					 		(function($w, controller_name, method_name, datas) {

								/**
								 * We will handle the sockets and call the correct methods
								 * Callback is currently not in used because
								 * It makes some conflicts while calling it more than once in a row
								 */
								 $w.queries.handle_socket($w, controller_name, method_name, datas);

							})($w, controller_name, method_name, datas);

							});

					 	//return false;

					 });

				});

			});

		},

	}

}
