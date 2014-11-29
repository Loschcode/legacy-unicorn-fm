/**
 * Sessions
 *
 * @module      :: Service
 * @description	:: Here we will put all the methods linked to the session system
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

			if ($h.variables.exists(req.session[label])) {

				return req.session[label];

			} else {

				return false;

			}

		},

		/**
		 * Set a session
		 * /!\
		 * @param {string} label user | device | server | etc.
		 * @param {mixed} value
		 * @return {void}
		 */
		set: function(label, value) {

			req.session[label] = value;
			req.session.save();

		},

		/**
		 * Remove a session
		 * @param  {string} label
		 * @return {void}
		 */
		remove: function(label) {

			delete req.session[label];

		},

		/**
		 * Check whether the user is connected or not (anonymous aren't considered connected)
		 * @return {boolean}
		 */
		is_connected: function () {

			// Check the req.session.user
			if ($h.variables.exists(req.session.user)) {

				if (req.session.user.role === 'anonymous') {

					return false;

				}

				return true;

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

		/**
		 * Check if the id match with the user which is connected
		 * @param  {objectid}  user_id
		 * @return {boolean}   
		 */
		is_self: function(user_id) {

			if (this.is_connected_or_anonymous()) {

				if (req.session.user._id == user_id) {

					return true;

				}

			}

			return false;

		},

		/**
		 * We refresh the value of a session area
		 * @param  {string} target e.g. 'user'
		 * @param  {value} value  the new value
		 * @return {boolean}
		 */
		refresh: function(target, value) {

			req.session[target] = value;
			req.session.save();

			return true;

		},

		/**
		 * Check whether the user is connected or not (anonymous are here considered as users)
		 * @return {boolean}
		 */
		is_connected_or_anonymous: function () {

			// Check the req.session.user
			if ($h.variables.exists(req.session.user)) {

				return true;

			} else {

				return false;

			}

		},

		/**
		 * Check if the user gets a specific role
		 * @param  {string} role the role to check
		 * @return {boolean}
		 */
		user_has_role: function (role) {

			// First we check if the user is connected
			if (!req.session.user) {

				return false;

			}

			// Then we check if it matches
			if (req.session.user.role === role) {

				return true;

			} else {

				return false;

			}

		},

	}

}