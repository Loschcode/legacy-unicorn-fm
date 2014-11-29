/**
 * Unicorn Listener
 *
 * @module      :: Listener
 * @description :: Socket reception
 *
 */

define(['main', 'datas', 'queries'], function (Main, Datas, Queries) {

	var Unicorn_listener = {

		/**
		 * The server has been reboot, we will disconnect the user
		 */
		listener_reboot: function(params, callback) {

			console.warn('Warning : the server has been reboot');

		},

	}

	return Unicorn_listener;

});
