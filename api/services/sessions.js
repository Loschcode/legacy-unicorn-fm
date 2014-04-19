/**
 * Check whether the user is connected or not
 * @param  {object}  req the req object from the controllers
 * @return {boolean}
 */
var is_connected = function (req) {

	// Check the session.user
	if (req.session.user) {

		return true;

	} else {

		return false;

	}

}

/**
 * Check if the user gets a specific role
 * @param  {object} req   the req object from the controllers
 * @param  {string} role the role to check
 * @return {boolean}
 */
var user_has_role = function (req, role) {

	// First we check if the user is connected
	if (!is_connected(req)) {

		return false;

	}

	// Then we check if it matches
	if (req.session.user.role === role) {

		return true;

	} else {

		return false;

	}

}

module.exports = {
	is_connected: is_connected,
	user_has_role: user_has_role
}