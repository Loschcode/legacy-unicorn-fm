/**
 * Loader.js
 * 	- Fetch config and all libs and run app
 */
require(['../app/config/require_config'], function(config) {

	// Inject requirejs config
	requirejs.config(config);

	// Load all core libs
	require(['jquery', 'handlebars', 'sammy', 'socket.io'], function($, Handlebars, Sammy, Socket_io) {

		/**
		 * Runner
		 * 	- Tiny system to execute controller and action
		 */
		var Runner = {
				run: function(controller, action, params) {

					require(['../app/controllers/' + controller + '_controller'], function(object) {

						object.init(params);
						object[action + '_action'](params);
					});

				}
			
		}

		/**
		 * Routes
		 * 	- Load all routes to use with sammyJs
		 */
		require(['../app/config/routes'], function(routes) {

			// Define new app 
			var app = Sammy('#main', function() {
				
				// To use inside jquery closure 
				var object = this;

				$.each(routes, function(index, value) {

					// Below it's just an auto schema of this
					// this.get('#pattern', function())

					object[value[0]](value[1], function() {

						// Run controller, action and inject 
						Runner.run(value[2], value[3], this.params);

					});

				});


			});
			
			app.run();


		});


		/**
		 * Sockets events
		 * 	- All sockets events for the frontend of the app
		 *	- Do what do you want with this
		 *
		 *	! You can use the runner object 
		 */
		
		// Run the awesome
		var socket = Socket_io.connect();

		// --- Add your sockets events here ---



	});
});

