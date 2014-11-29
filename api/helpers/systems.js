/**
 * Models
 *
 * @module      :: Helper
 * @description	:: All the methods that process the models (most of them might be synchronous)
 */

var $h = require(__ROOT__ + '/api/helpers');

module.exports = {

	/**
	 * Reboot basic reset
	 * We will mainly reset the current users from all the servers
	 * @return {void}
	 */
	reboot: function() {

		/**
		 * We remove our current users from all the servers because we won't be able to end it properly
		 * We also remove the referent of every server
		 */
		 $s.db.Server.update({}, {

		 	'$set': { 'current_users': [], 'referent': {} }

		 }, {multi: true}).exec(function(error, affected) {

			$h.catches.error(error);

		 	$h.logs.info('Users removed from all servers');
		 	$h.logs.info('Total : ' + affected);

		 });
		
		/**
		 * We remove our current server from all the users because we won't be able to end it properly
		 */
		 $s.db.User.update({}, {

		 	'$set': { 'current_servers': [] }

		 }, {multi: true}).exec(function(error, affected) {

			$h.catches.error(error);

		 	$h.logs.info('Servers removed from all users');
		 	$h.logs.info('Total : ' + affected);

		 });


	},

}