/**
 * Catches
 *
 * @module      :: Helper
 * @description	:: We will put all the methods we need to catch messages (such as errors)
 */

var $h = require(__ROOT__ + '/api/helpers');

module.exports = {

	/**
	 * Catch an error and output whatever you want (it's a norm within the project)
	 * @param  {string} error
	 * @return {boolean} is there an error ?
	 */
	error: function(error) {


		if (!$h.variables.exists(error) || error !== null) { 

			$h.logs.error(error);
			
			return true 

		} else {

			return false

		}

	},

}
