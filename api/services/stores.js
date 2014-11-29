/**
 * Stores
 *
 * @module      :: Service
 * @description	:: Unicorn global scope memory storage
 */

var $h = require(__ROOT__ + '/api/helpers');

module.exports = function() {

	return {

		/**
		 * Build a store area and return the key
		 * @param {mixed} mixed can be anything (e.g. identified function for user callbacks)
		 */
		build: function(mixed) {

			key = $h.formats.set_store_key();
			__STORAGE__[key] = mixed;

			return key


		},

		/**
		 * Retrieve the store area from its key
		 * @param  {string} key
		 * @return {mixed} null if undefined
		 */
		retrieve: function(key, remove) {

			if (typeof __STORAGE__[key] !== "undefined") {

				if (remove === true) {

					to_return = __STORAGE__[key]
					delete __STORAGE__[key];
					return to_return;
				}

				return __STORAGE__[key];

			} else {

				return null;

			}

		},

	}

}