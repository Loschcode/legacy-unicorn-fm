/**
 * Sockets
 *
 * @module      :: Sockets
 * @description :: Here all events for sockets
 *
 */

define(['main', 'datas', 'queries', 'app/controllers/server_controller', 'app/controllers/player_controller'], function (Main, Datas, Queries, Server, Player) {

	var Sockets = {

		Socket: Main.socket(),

		/**
		 * We initialize the socket and get the user session, etc.
		 */
		init: function() {

			/**
			 * UNICORN GUIDELINE FOR SENDING
			 * -------------------
			 *
			 * controller_name.method
			 *  {
			 *
			 *     reference: { any_id : id }
			 *     params: { any_param : value }
			 *
			 * 	   selector: jQuery selector
			 * 	   
			 * 	   NOTE: in some case we might want to use selectors from the actions
			 * 	   It won't be send to the back-end but directly communicated to the matching listener
			 * 	   If there's a callback. Be careful, if you set a selector and don't want a callback (which is pretty useless)
			 * 	   The selector_store will keep the data and be used when there's another call.
			 *     
			 * }
			 * 
			 * -> Everything is checked and ignored if it doesn't respect clearly this format
			 * 
			 * -------------------
			 */
			
			// Connect to the Socket IO
			Socket = this.Socket;

			/**
			 * This will manage if the user leave the page from the front-side and leave some important datas before
			 */
			window.onbeforeunload = function() {

				server = Datas.get('server');

				/**
				 * We will refresh the last_known_position in the database
				 * Like that when an user come back he gets back the correct position
				 */
				datas_to_save = {

					last_known_position: $(Player.$s.player_position).slider('value')

				};

				Queries.emit_socket('server.disconnect', {server: server}, {datas_to_save: datas_to_save});

			};

			/**
			 * This will manage if the server/socket system stop from itself
			 */
			Socket.on('disconnect', function () {

				console.warn('Warning : your were disconnected from Unicorn');

			});

			/**
			 * We signin the user (get the session, get the session from cookie, signin as anonymous, etc.)
			 */
			Queries.emit_socket('user.automatic_signin');

			/**
			 * DEVICE HANDLER
			 *
			 * device.id
			 * {
			 *
			 * 		controller : controller to call (e.g 'server' for server_listener)
			 * 		method : method to call (e.g. 'automatic_signin' method in the listener)
			 * 		params : the details we need for this method
			 * 		
			 * 		(cookie : {
			 * 			label: label to put on (e.g. 'user')
			 * 			datas: encrypted cookie datas
			 * 		})
			 * 		
			 * }
			 *
			 * -> You can set any cookie with the automatic handler, you just need to respect the norm (it's a front-end work)
			 */
			this.init_device_handler();

			/**
			 * UNICORN GUIDELINE FOR RECEPTION
			 *
			 * any | server_id | ... (match with a controller)
			 * any | server | ... (the controller that match)
			 * {
			 *
			 * 	datas : {
			 *
			 * 		method : the function that will be called
			 * 		params : the params we will inject in the function
			 * 	
			 * 	}
			 * 
			 * }
			 *
			 * -> All the functions are in /sockets/XXX_socket.js
			 * 
			 */
			this.init_any_casual_socket();

		},

		/**
		 * Initialize the casual sockets listeners 
		 * The front-end load progressively the datas from the back-end
		 * The casual sockets listeners will be initialized one after the other
		 * From specific sections depending on the process it needs to set it up
		 */

		/**
		 * file : /sockets/unicorn_socket.js
		 * General casual socket listener
		 */
		init_any_casual_socket: function() {

			console.info('Initialize : Unicorn casual socket listener');

			this.Socket.on('unicorn', function (datas, callback) {

				Queries.handle_listeners('unicorn', datas);

			});

		},

		/**
		 * file : /sockets/server_socket.js
		 * Specific server casual socket listener
		 */
		init_server_casual_socket: function() {

			console.info('Initialize : Server casual socket listener');

			server_id = Main.datas.get('server')._id;

			this.Socket.on(server_id, function (datas, callback) {

				Queries.handle_listeners('server', datas);

			});

		},

		/**
		 * file : /sockets/user_socket.js
		 * Specific user casual socket listener (can be understood in many devices)
		 */
		init_user_casual_socket: function() {

			console.info('Initialize : User casual socket listener');

			user_id = Main.datas.get('user')._id;

			this.Socket.on(user_id, function (datas, callback) {

				Queries.handle_listeners('user', datas);

			});

		},

		/**
		 * file : /sockets/referent_socket.js
		 * Specific referent socket listener
		 */
		init_referent_casual_socket: function() {

			console.info('Initialize : Referent casual socket listener');

			device_id = Main.datas.get('device').id;
			handler = 'referent-'+device_id;

			this.Socket.on(handler, function (datas, callback) {

				Queries.handle_listeners('referent', datas);


			});

		},
		
		init_remove_referent_casual_socket: function() {

			console.info('Remove : Referent casual socket listener');

			device_id = Main.datas.get('device').id;
			handler = 'referent-'+device_id;

			this.Socket.removeListener(handler, function() {});

		},

		/**
		 * Special device handler
		 * We will receive all the direct callback through it
		 * This listener is specific to the actual session of the user (connected or not)
		 * 
		 * e.g. user_listener, server_listener, ...
		 */
		init_device_handler: function() {

			console.info('Initialize : Device handler (direct callback understanding)');

			/**
			 * Setup the listeners
			 */
			device_id = Main.datas.get('device').id;

			/**
			 * Device handler (only for listeners)
			 */
			this.Socket.on(device_id, function (datas, callback) {

				// Will handle the listeners
				Queries.handle_feedbacks(datas);

			});

		},

	}

	return Sockets;

});

