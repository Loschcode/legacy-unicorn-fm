/**
 * Queries
 *
 * @module      :: Worker
 * @description	:: All the methods about the queries process (such as socket communication, or database processes)
 */

var $h = require(__ROOT__ + '/api/helpers');

module.exports = function($s) {

	queries = {

		/**
		 * Send a socket to the front-end (similar method exists in the front-end side)
		 * @param  {string} scope  e.g. server_id, user_id, 'unicorn'
		 * @param  {string} method the method we will call inside the scope in the front-end
		 * @param  {string} params the potential parameters
		 * @param  {function} callback we will use a direct callback handler (optional) -> avoid multiple socket set for nothing
		 * @return {void}
		 */
		emit_socket: function(scope, method, params, callback) {

			$h.logs.socket('Socket has been sent on `%s`.`%s`', scope, method);

			if (typeof params === "undefined") {

				params = {};

			}

			/**
			 * Referent special case
			 */
			if (scope === 'referent') {

				scope = 'referent-' + $s.memories.get('referent').device;

			}

			if (!$h.variables.exists(callback)) {

				$s.sockets.emit(scope, 

					{

						method: method, 
						params: params

					}

				);

			} else {

				callback_key = $s.stores.build(function(feedback) {

					callback(feedback);

				});

				$s.sockets.emit(scope, 

					{

						method: method, 
						params: params,

						callback: callback_key // callback_key

					}

				);

			}

		},

		/**
		 * Handle a socket, call the matching function and call a socket listener to the front
		 * @param  {string} controller name
		 * @param  {string} method name
		 * @param  {object} datas got from the front-end
		 * @param  {function} memories we need to keep the memory through everything
		 * @return {void}
		 */
		handle_socket: function($w, controller, method, datas) {

			// First we check the format of the socket
			$h.securities.is_socket_well_done(controller, method, datas, function(controller, method, datas, result) {

				if (result) {

					$h.logs.socket('Socket received and distributed on `%s`.`%s`', controller, method);

					/**
					 * We will try to validate the reference and params before to continue
					 * NOTE : If it fails it will simply stop the execution and output a warning in the back-end
					 */
					reference = datas.reference;
					params = datas.params;

					var validations = require(__ROOT__ + '/api/sockets/validations');

					// If the validation exist we will check it, otherwise we will continue and ignore this step
					if ($h.variables.is_object(validations[controller])) {

						if ($h.variables.is_object(validations[controller][method])) {

							current_validation = validations[controller][method];

							// First we validate the reference
							if (!$h.securities.is_reference_well_done(reference, current_validation.reference, true)) {

								$h.logs.warn('Reference validation failed on `%s`.`%s`', controller, method);
								return false;

							}
							
							/**
							 * Then we validate the params
							 * 
							 * NOTE : We will also change its content depending on the validation
							 * And set all the optional params which aren't already in, set as null
							 * It also works recursively for the objects.
							 */
							params = $h.securities.are_params_well_done(params, current_validation.params);

							if (!params) {

								$h.logs.warn('Params validation failed on `%s`.`%s`', controller, method);
								return false;

							}

						} else {

							$h.logs.warn('Validation not found for `%s`.`%s`', controller, method);

						}


					} else {

						$h.logs.warn('Validation not found for socket controller `%s`', controller);

					}


					// We execute the matching controller
					queries.execute_socket_controller($w, controller, method, reference, params, function(result) {

						device = $s.memories.get('device');

						// If needed, we give a feedback to the front-end socket
						result.controller = controller;
						result.method = method;

						/**
						 * Will be used in the proper listeners
						 */
						$s.sockets.emit(device.id, result);

					});

				} else {

					$h.logs.warn('Socket received and refused (wrong format)');

				}

			});

		},

		/**
		 * Execute a socket controller method and get its feedback
		 * @param  {string} controller_name the name of the socket controller we want to call
		 * @param  {string} method_name the name of the the method within the socket controller
		 * @param  {object} reference object
		 * @param  {object} params object
		 * @param  {function} callback function (we will use it at the end of every method called)
		 * @return {mixed} depending on the callback we receive from the socket controller
		 */
		execute_socket_controller: function($w, controller_name, method_name, reference, params, callback) {

			/**
			 * We get the controller instance
			 */
			controller_instance = require('../sockets/'+ controller_name +'_socket')($s, $w);

			/**
			 * We compose the function real name
			 */
			called_function = method_name; //this.generate_socket_target_to_name(target, action);

			if ($h.variables.is_function(controller_instance[called_function])) {

				controller_instance[called_function].apply(this, [reference, params, callback]);

			} else {

				$h.logs.error('Socket call canceled, we do not know the function `%s` in `%s` :', method_name, controller_name);
				$h.logs.object(datas);

			}

		},

	};

	return queries;

}