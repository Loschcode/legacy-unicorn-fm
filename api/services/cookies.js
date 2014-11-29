/**
 * Cookies
 *
 * @module      :: Service
 * @description	:: Here we will put all the methods linked to the cookies system
 */

var $h = require(__ROOT__ + '/api/helpers');

module.exports = function(req, res) {

	return {

	/**
	 * Get a session
	 * @param  {string} label user | device | etc.
	 * @return {mixed} session content or false
	 */
	get: function(label) {

		if ($h.variables.exists(req.cookies[label])) {

			return req.cookies[label];

		} else {

			return false;

		}

	},

	/**
	 * Return the user current session
	 * @return {object/boolean}
	 */
	user: function() {

		return this.get('user');

	},

	/**
	 * Return the user current session
	 * @return {object/boolean}
	 */
	server: function() {

		return this.get('server');

	},

	}

}