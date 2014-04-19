/**
 * Check whether a variable exists or not
 * @param  {mixed} variable any variable you want to check
 * @return {boolean}
 */
var exists = function(variable) {

	if (variable || typeof variable == 'undefined') {

		return false;

	}

	return true;

}

module.exports = {
	exists: exists
}