/**
 * Variables
 *
 * @module      :: Helper
 * @description	:: We will put all the methods which process variables (any kind)
 */

var $h = require(__ROOT__ + '/api/helpers');

module.exports = {

	/**
	 * Get all the methods of the object
	 * @param  {object} object
	 * @return {array}
	 */
	get_all_methods: function(object) {

	    return Object.getOwnPropertyNames(object).filter(function(property) {

	        return typeof object[property] == 'function';

	    });

	},

	/**
	 * Get all the elements of the object (different from get_all_methods, we focus on any element here)
	 * @param  {object} object
	 * @return {array}
	 */
	get_all_elements: function(object) {

	    return Object.keys(object);

	},

	/**
	 * ObjectId gives everyone big headaches.
	 * So we normalize the comparison like that it works everytime
	 * Because sometimes the exact same id, with the same type isn't comparable, because Mongo is really shitty.
	 * @param  {mixed} id 
	 * @param  {mixed} compared_id
	 * @return {boolean}
	 */
	is_same_id: function(id, compared_id) {

		string_id = id.toString();
		string_compared_id = compared_id.toString();

		if (string_id === string_compared_id) {

			return true;

		} else {

			return false;

		}

	},

	/**
	 * Check whether a variable exists or not
	 * @param  {mixed} variable any variable you want to check
	 * @return {boolean}
	 */
	exists: function(variable) {

		if (typeof variable === 'undefined') {

			return false;

		}

		return true;

	},

	/**
	 * Check whether a series of variables exists
	 * @param  {array} array with variables inside (of any kind)
	 * @return {boolean}
	 */
	series_exists: function(array) {

		array.forEach(function(entity) {

			if (typeof entity === 'undefined') {

				return false;

			}

		});

		return true;

	},

	/**
	 * Check whether a variable is a function or not
	 * @param  {mixed} variable any variable you want to check
	 * @return {boolean}
	 */
	is_function: function(variable) {

		if (typeof variable === 'function') {

			return true;

		}

		return false;

	},

	/**
	 * Check whether a variable is a function or not
	 * @param  {mixed} variable any variable you want to check
	 * @return {boolean}
	 */
	is_object: function(variable) {

		if (typeof variable === 'object') {

			return true;

		}

		return false;

	},

	/**
	 * Check whether a variable is a String
	 * @param  {string}  variable any variable you want to check
	 * @return {Boolean}
	 */
	is_string: function(variable) {

		if (typeof variable === 'string') {

			return true;

		}

		return false;

	},

	/**
	 * Check whether a variable is a Boolean
	 * @param  {string}  variable any variable you want to check
	 * @return {Boolean}
	 */
	is_boolean: function(variable) {

		if (typeof variable === 'boolean') {

			return true;

		}

		return false;

	},

	/**
	 * Check whether a variable is an ObjectId (format)
	 * @param  {string}  variable ObjectId
	 * @return {Boolean}
	 */
	is_objectid: function(variable) {

		if (variable.match(/^[0-9a-fA-F]{24}$/)) {

			return true;

		}

		return false;

	},

	is_empty_array: function(variable) {

		if (variable.length <= 0) {

			return true;

		} else {

			return false;

		}

	},

	is_empty_object: function(variable) {

		if (variable == null) {

			return true;

		}

		variable = JSON.stringify(variable);

		// What the FUCK JavaScript ? I must do crazy shitty scripts to make you work. Even _.isEmpty() don't know how to handle your shit
		// Fucking shitty language.
		if (variable === "null") {

			return true;

		}

		if (variable === '{}') {

			return true;

		} else {

			return false;

		}

	},

	/**
	 * Inject an object (e.g. JSON) within another and replace the matching label if already existing
	 * @param  {object} source any object we want to fetch
	 * @param  {object} object the object to insert
	 * @return {object}
	 */
	inject: function(source, object) {

		for (var label in object) {

			source[label] = object[label]

	     }

	     return source;

	},

}
