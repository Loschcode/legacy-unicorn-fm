/**
 * Security
 *
 * @module      :: Helper
 * @description	:: All the methods about the security process (such as checking objects integrity)
 */

var async  = require('async');

var $h = require(__ROOT__ + '/api/helpers');

module.exports = {

	/**
	 * Check if the reference is well done at the first scope
	 * It will check if the different elements exists (in the array)
	 * @param  {object}  object to check
	 * @param  {array}  array to pick elements
	 * @return {boolean}
	 */
	is_reference_well_done: function(object, array, only_objectid) {

		for (var i = 0, len = array.length; i < len; i++) {

			element = array[i];

			if (!$h.variables.exists(object[element])) {

				$h.logs.warn('Reference element `%s` does not exist', element);
				return false;

			}

			if (only_objectid) {

				if (!$h.variables.is_objectid(object[element])) {

					$h.logs.warn('Reference element `%s` is not an ObjectId', element);
					return false;

				}

			}

		}

		return true;

	},

	/**
	 * Validate the params element in every side
	 * @param  {object} params            
	 * @param  {object} validation_params from sockets/validations.js validation system
	 * @return {mixed} boolean (if there were an error), object (if it passed, object may have changed)
	 */
	are_params_well_done: function(params, validation_params) {

		/*
		params: {

			action: ['required', 'string'],
			volume: ['optional', 'integer'],
			other: {

				subparam: ['required', 'string'],
				subparam2: ['required', 'integer']

			}

		},
		*/
		
		// We will list all the methods of params
		methods_to_check = $h.variables.get_all_elements(validation_params);

		for (var i = 0, len = methods_to_check.length; i < len; i++) {

			// We get the method name, and the value (which is the validation content)
			param_label = methods_to_check[i];
			param_value = params[i];

			if ($h.variables.exists(validation_params[param_label])) {

				consistence = validation_params[param_label][0]; // required or optional
				type = validation_params[param_label][1];

				if (typeof validation_params[param_label][2] === "object") {
					
					// We got a recusrive object to check
					recursive_validator = validation_params[param_label][2];

				}

				// So we will check in the required case
				if (consistence === 'required') {

					// If the element doesn't exist, it's an error
					if (!$h.variables.exists(params[param_label])) {

						$h.logs.warn('Param element `%s` is required but missing', param_label);
						return false;

					// If the element is an object, we should call the function recursively to check
					} else if ((typeof params[param_label] === 'object') && (typeof recursive_validator !== "undefined")) {

						sub_params = $h.securities.are_params_well_done(params[param_label], recursive_validator);

						if (sub_params === false) {

							return false;

						} else {

							// We populate it with the theorical `null` that we could have encountered
							params[param_label] = sub_params;

						}

					// If the element doesn't match the required type, it's an error
					} else if (typeof params[param_label] !== type) {

						$h.logs.warn('Param element `%s` is not `%s`', param_label, type);
						return false;

					}

				} else if (consistence === 'optional') {

					// If the element doesn't exist, we should set it as null before the final return
					if (!$h.variables.exists(params[param_label])) {

						params[param_label] = null;

					// If the element is an object, we should call the function recursively to check
					// (if there's a third parameter, otherwise there's no deep check)
					} else if ((typeof params[param_label] === 'object') && (typeof recursive_validator !== "undefined")) {

						sub_params = $h.securities.are_params_well_done(params[param_label], recursive_validator);

						if (sub_params === false) {

							return false;

						} else {

							// We populate it with the theorical `null` that we could have encountered
							params[param_label] = sub_params;

						}

					// If the element exist and doesn't match the required type, it's an error
					} else if (typeof params[param_label] !== type) {

						$h.logs.warn('Param element `%s` is not `%s`', param_label, type);
						return false;

					}

				}


			} else {

				// Simple warning which says the param element should get its validation
				$h.logs.warn('Param element `%s` does not have validation', param_label);

			}

		}

		return params;

	},

	/**
	 * Check if the socket is well done
	 * @param {string} controller the controller which is the target
	 * @param {string} method the method that will be called
	 * @param  {object}   object an object matching with the socket casual format
	 * @param  {function} done callback system to give to the calling area
	 * @return {boolean} is the socket well done ?
	 */
    is_socket_well_done: function (controller, method, object, done) {

		this.done = done;
		var self = this;

		/**
		 *
		 * OBJECT
		 * 
		 *     reference: (object)|any|...
		 *     params: (object)
		 *     
		 */

		 return async.waterfall([
		 	
		 	function (callback) {

		 		/**
		 		 * REFERENCE
		 		 */
		 		if ($h.variables.exists(object.reference)) {

		 			if ($h.variables.is_string(object.reference)) {

			 			if (object.reference === 'any') {

			 				callback(null);

			 			} else {

			 				callback('`reference` wrong value');

			 			}

			 		} else if ($h.variables.is_object(object.reference)) {

			 			callback(null);

			 		} else {

			 			callback('`reference` wrong format');

			 		}

		 		} else {

		 			callback('`reference` do not exist');

		 		}

		 	},

		 	function (callback) {

		 		/**
		 		 * PARAMS CHECK
		 		 */
		 		if ($h.variables.exists(object.params)) {

		 			if ($h.variables.is_object(object.params)) {

		 				callback(null);

		 			} else {

		 				callback('`params` wrong format');

		 			}

		 		} else {

		 			callback('`params` do not exist');

		 		}

		 	},

		 	], function (error, results) {

		 		if (error) {

		 			$h.logs.error('Wrong socket format : %s  ', error);
		 			$h.logs.object(object);
		 			self.done(object, false);

		 		} else {

		 			self.done(controller, method, object, true);

		 		}

		 	});

    },

    /**
     * Check the format of the first elements (such as kind, area, role, type, etc.)
     * Must be a string matching with the accepted_values if not false
     * @param  {string}   element attribute
     * @param  {array/boolean}   accepted_values
     * @param  {function} callback
     * @return {void}
     */
	socket_first_elements_format: function(label, element, accepted_values, callback) {

		 if ($h.variables.is_string(element)) {

		 	if ($h.strings.in_array(element, accepted_values) || accepted_values === false) {

		 		callback(null);

		 	} else {

		 		callback('`'+label+'` wrong value');

		 	}

		 } else {

		 	if ($h.variables.exists(element)) {

		 		callback('`'+label+'` wrong format');

		 	} else {

		 		callback('`'+label+'` do not exist');

		 	}

		 }

	},

}