/**
 * User Socket
 *
 * @module      :: Socket
 * @description	:: It will manage every socket linked with the user
 */

var $h = require(__ROOT__ + '/api/helpers');

module.exports = function($s, $w) {

	var server_process = require(__ROOT__ + '/api/processes/server_process')($s, $w);
	
    return {

		/**
		 * When someone leave the server or disconnect completely he sends it to the server
		 * 
		 * NOTE: Don't forget to put this method when there will be multi servers
		 * 
		 */
		disconnect: function(reference, params, callback) {

			// We refresh the last known position in the database
			server_process.manage_disconnect_unsafe(reference.server, params.datas_to_save);

		},

		/**
		 * When someone want to push a track on the server
		 * @reference {server}
		 * @params {media}
		 * @callback {true} - direct callback will be used
		 */
		push_track: function(reference, params, callback) {

			$h.logs.success('User `%s` asked to push new track `%s`.`%s` on server `%s`', $s.sessions.user()._id, params.media.reference, params.media.title, reference.server);
			//$h.logs.object(params.media);

			server_process.try_push_track(reference.server, params.media, function(feedback) {

				callback(feedback);

			});

		},

		/**
		 * We will send a socket to tell everyone the number of users has changed
		 * @reference {server}
		 * @params void
		 * @callback {void} - indirect socket will be used
		 */
		refresh_current_users: function(reference, params, callback) {

			$s.db.Server.findOne({_id: reference.server}).exec(function(error, server) {

				$h.catches.error(error);

				if (server !== null) {

					/**
					 * Only for sockets :
					 * If someone open 2 tabs to listen a server and go away, it'll remove the user
					 * Because before we were removing the duplicated, so it can't work this way.
					 * Here we remove the duplicate just to show it "officially" but in the database there will be clones
					 */
					current_users_without_duplicates = $h.strings.remove_duplicates_from_array(server.current_users);

					// No direct callback
					$w.queries.emit_socket(reference.server, 'set_current_users', {current_users: current_users_without_duplicates});

				}

			});

		},

		/**
		 * Usually sent from the referent heart-beat
		 * Will refresh the track position for the non watcher and check the sync rate for everyone
		 */
		refresh_track_position: function(reference, params, callback) {

			server = $s.memories.get('server');

			$s.db.Server.findOne({_id: server._id}).exec(function(error, server) {

				$h.catches.error(error);

				if (server !== null) {

					// No direct callback
					$w.queries.emit_socket(server._id, 'refresh_track_position_and_check_sync', {youtube_datas: params.youtube_datas});

				}

			});

		},

		/**
		 * An user asked to get the referent, we will process some things and get the referent
		 * We will also try to change if it's a non-watcher (which means he's not the highest quality)
		 * 
		 * @reference {server}
		 * @params void
		 * @callback {void}
		 */
		get_referent: function(reference, params, callback) {

			$s.db.Server.findOne({

				_id: reference.server,
				'referent.device' : { $exists : true }

			}).exec(function(error, server) {

				$h.catches.error(error);

				if (server === null) {

					// We will ask every user to get a new referent and select one
					$w.queries.emit_socket(reference.server, 'ask_for_new_referent');

				// If there's a referent
				} else {
					
					// We set the referent in the socket and send the callback
					$s.sessions.set('referent', server.referent);
					$s.memories.set('referent', server.referent);
					
					callback($h.formats.success({referent: server.referent}));

				}

			});	

		},

		/**
		 * We try to ask for a new referent (it can fails and in this case it will keep the old one)
		 */
		ask_for_new_referent: function(reference, params, callback) {

			server = $s.memories.get('server');
			server_process.remove_referent_and_take_another(server._id)
			
		},

		/**
		 * Someone is trying to be referent, let's check it
		 *
		 * WARNING : This handler will be used by many people at the same time
		 * 
		 * @reference {server}
		 * @params void
		 * @callback {void}
		 */
		try_to_be_referent: function(reference, params, callback) {

			potential_referent = {

				user: $s.sessions.user()._id,
				device: params.device,
				watcher: params.watcher

			}

			// If referent.device doesn't exist it means the user can be referent, we will set it as referent then
			$s.db.Server.update(

				{ $and: [

					{_id: reference.server},
					
					{ $or: [

						{'referent.device' : { $exists : false } }, // The referent must be removed before

						{ $and: [

							{'referent.watcher' : false}, // If the referent isn't watcher and the current user is a watcher
							{'referent.watcher' : { $ne : potential_referent.watcher } }

							] }


						]}

				]
				
				//'referent.device' : { $ne : potential_referent.device } // Can't be the same twice

				},{ 

					$set : { 'referent' : potential_referent }

				}, 

			function(error, affected) {

				$h.catches.error(error);

				if (affected > 0) {

					$h.logs.success('Referent `%s` added to the server (%s)', params.device, affected);

					// We tell the user he's the new referent
					$w.queries.emit_socket(reference.server, 'set_new_referent', {referent: potential_referent});

					// If the user isn't watcher, we should try to get a better referent (no matter if it works or not, we already set it completely)
					if (params.watcher === false) {

						// We tell the user he's the new referent
						$w.queries.emit_socket(reference.server, 'ask_for_better_referent');

					}

				} else {

					$h.logs.warn('Something went wrong trying to add a referent : there is certainly already a referent');

				}

			});

		},

		/**
		 * Automatic join the private server of a specific user
		 *
		 * Will try to join the user server
		 * If it doesn't exist we will create it
		 *
		 * NOTE : the server name must match the user id
		 *
		 * @reference {user}
		 * @params void
		 * @callback {server}
		 */
		join_my_private_server: function(reference, params, callback) {

			// Let's join our private server or create it if needed
			server_process.join_or_create_private_server(reference.user, function(feedback) {

				// We add the user to the server
				//server_process.add_user_to_server($s.sessions.user(), feedback.params.server, function(feedback) {

					callback(feedback);

				//})


			});


		},

	};

}