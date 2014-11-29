/**
 * Strike.js
 * 	- Simple js framework driven by jQuery events
 */
require([

	'app/config/libs',
	'core/config',

], function(Libs, Config_require) {

	Config_require.paths = Libs;
	Config_require.paths.config = 'core/dependencies/config';
	Config_require.paths.hbs = 'core/dependencies/hbs';
	Config_require.paths.text = 'core/dependencies/text';

	// Inject RequireJS config
	requirejs.config(Config_require);

	require([

		'core/dependencies/jquery', 
		'core/dependencies/handlebars',
		'app/config/routes',
		'core/dependencies/config'

		], function(Jquery, Handlebars, Routes, Config) {

		/**
		 * Error reporting
		 * 	- Handle console.log by Environment cases
		 */
		
		// Get environment
		var environment = Config.environment;

		// Error reporting
		if (environment == 'production') 
		{
			// Avoid error, info, log
			console.error = function () {}
			console.info = function() {}
			console.log = function() {}
		}

		if (environment == 'testing')
		{
			// Avoid info
			console.info = function() {}
		}

		/* ------------------------------------------------------- */

		/**
		 * Runner
		 * 	- Tiny system to execute controller and action
		 */

		var Runner = {
			run: function(controller, action, params) {

				console.info('Try to load ' + controller + '_controller');

				// Load controller
				require(['app/controllers/' + controller + '_controller'], function(object) {

					console.info('Info : Controller ' + controller + ' loaded');
					console.info('Info : Run "before_action" method');

					// Run init() method of the controller
					// Note : We can use apply()
					var result = object.before_action(action, params);

					if (result === false)
					{
						console.log('Info : Before_action returned false, so we can\'t exec action : ' + action + '_action');
						return;
					}

					console.info('Info : Try to run action ' + action + '_action');

					if (typeof object[action + '_action'] === "undefined") {

						console.warn('Warning : impossible to call `%s`.`%s`', controller, action);

					} else {

						// Run action wanted
						object[action + '_action'](params);

					}

				});
			}
		}

		/* ------------------------------------------------------- */

		/**
		 * Routes
		 * 	- Load all routes to catch jquery events
		 */

			$.each(Routes, function(index, value) {

				// jQuery selector (Ex. #drug)
				var selector = value[0];

				// jQuery trigger (Ex. click)
				var trigger = value[1];

				var detect_route = value[2].split('::');

				// Controller to run
				var controller = detect_route[0];

				// Action to run
				var action = detect_route[1];
					
				// Delayed ?
				if (typeof value[3] != 'undefined' && value[3] === 'delayed')
				{

					$(document).on(trigger, selector, function(e) {

						e.preventDefault();
						Runner.run(controller, action, $(this));

					});

				}
				else
				{
					if (trigger === 'click' || trigger == 'submit')
					{
						$(selector)[trigger](function(e) {
							e.preventDefault();
							Runner.run(controller, action, $(this));
						});
					}
					else
					{
						$(selector)[trigger](function() {
							Runner.run(controller, action, $(this));
						});
					}
				}

			});

		/* ------------------------------------------------------- */

		/**
		 * Base controller
		 * 	- By default we run the base controller with run action
		 */
		Runner.run('base', 'run');

		/* ------------------------------------------------------- */

		/**
		 * Load sockets file
		 */
		require(['app/sockets'], function(Sockets) {

			Sockets.init();
			
		});

		/* ------------------------------------------------------- */

	});

});
