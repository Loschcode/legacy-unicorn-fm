/**
 * Post Starters
 *
 * @module      :: Post Starters
 * @description	:: After the starters are initialized on the server, this will be executed with the starters datas to be used (such as db or sockets instance)
 * 
 */

var $h = require(__ROOT__ + '/api/helpers');

module.exports = function(starters) {

	$h.logs.info('Reboot system initialized (pre_starters)');

	/**
	 * We remove our current users from all the servers because we won't be able to end it properly
	 */
	 starters.database.Server.update({}, {

	 	'$set': { 'current_users': [], 'referent': {} }

	 }, {multi: true}).exec(function(error, affected) {

	 	$h.catches.error(error);

	 	$h.logs.info('Users removed from all servers');
	 	$h.logs.info('Total : ' + affected);

	 });

	/**
	 * We remove our current server from all the users because we won't be able to end it properly
	 */
	 starters.database.User.update({}, {

	 	'$set': { 'current_servers': [] }

	 }, {multi: true}).exec(function(error, affected) {

	 	$h.catches.error(error);

	 	$h.logs.info('Servers removed from all users');
	 	$h.logs.info('Total : ' + affected);

	});

}
