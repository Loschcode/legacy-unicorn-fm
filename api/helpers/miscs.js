/**
 * Misc
 *
 * @module      :: Helper
 * @description	:: All the methods that don't fit anywhere else
 */

var $h = require(__ROOT__ + '/api/helpers');

module.exports = {

	/**
	 * Make the application sleep for N milliseconds and use the callback
	 * @param  {integer}   ms       1000 = 1sec
	 * @param  {function} callback
	 * @return {void}           
	 */
	sleep: function (ms, callback) {

	    setTimeout(function() { 

	    	callback();

	    }, ms);

	},

}