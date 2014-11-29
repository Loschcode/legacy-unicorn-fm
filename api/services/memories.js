/**
 * Memories
 *
 * @module      :: Service
 * @description	:: Here we will put all the methods linked to the instant memory of a page
 */

var $h = require(__ROOT__ + '/api/helpers');

module.exports = function(req, res) {

	/**
	 * We setup the req.memory if it doesn't exist
	 */
	if (!$h.variables.exists(req.memory)) {

		req.memory = {};

	}

	return {

		all: function() {

			return req.memory;

		},

		/**
		 * Get a memory
		 * @param  {string} label user | device | etc.
		 * @return {mixed} memory content or false
		 */
		get: function(label) {

			if ($h.variables.exists(req.memory[label])) {

				return req.memory[label];

			} else {

				return false;

			}

		},

		/**
		 * We refresh the value of a session area
		 * @param  {string} target e.g. 'user'
		 * @param  {value} value  the new value
		 * @return {boolean}
		 */
		refresh: function(target, value) {

			req.memory[target] = value;

			return true;

		},

		/**
		 * Set a memory
		 * /!\
		 * @param {string} label user | device | server | etc.
		 * @param {mixed} value
		 * @return {void}
		 */
		set: function(label, value) {

			req.memory[label] = value;

		},

		/**
		 * Remove a memory
		 * @param  {string} label
		 * @return {void}
		 */
		remove: function(label) {

			delete req.memory[label];

		},

	}

}