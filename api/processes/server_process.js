/**
 * Server Process
 *
 * @module      :: Process
 * @description	:: It will manage the server processes (usually used through the sockets)
 */

var $h = require(__ROOT__ + '/api/helpers');

module.exports = function($s, $w) {

	server_process = {

		/**
		 * All the process to push a track
		 * @param  {objectid}   server_id
		 * @param  {function} callback
		 * @return {void}
		 */
		try_push_track: function(server_id, media, callback) {

		    $s.db.Server.findOne({_id: server_id}).populate('tracks').populate('chronicles').populate('player.media').exec(function(error, server) {

		      //$s.db.Chronicle.populate(server, { path: 'chronicles.user', model: 'User' }, function(error, server) {

		        $h.catches.error(error);

		        if (server !== null) {

			        is_possible_to_push = server_process.is_possible_to_push(server);

			        // If the antipush isn't activated --> we add everything
			        if (is_possible_to_push) {

			        	// We will create the media object witin the database (or retrieve it)
			        	// NOTE : be careful the 'media' below will be a collection from now.
			        	server_process.get_or_create_media(media, function(media) {

					    	// We remove any short chronicle that could've occured
					    	server_process.remove_short_chronicle(server);

				          	// First we add this chronicle to the server history
					        server_process.add_new_chronicle($s.sessions.user(), server, media);

					        // Then we check the track and possibly add it (track compare + _id in server.tracks)
					        server_process.add_new_track($s.sessions.user(), server, media);

						    // We need to tell the user it was a success
						    callback($h.formats.success());

						    // And we don't forget to change all the important things in the server
						    server.player.status = "play";
						    server.player.media = media;
						    server.player.last_known_position = 0;

						    server.save(function(error) {

							    // Now we will send a push to all devices
							    $w.queries.emit_socket(server_id, 'set_current_track', {media: media, server: server, user: $s.sessions.user()});

						    	$h.catches.error(error); 

						    });

						});


			        } else {

			          	callback($h.formats.transmitted_error('Impossible to push'));

			        }

		        }

		      //});

		    });

		},

		/**
		 * We will check if the user is allowed to push (antipush system)
		 * It depends on the antipush set, if he pushed already he can push until the first chronicle he pushed is outdated
		 * If it's another user he cannot push until a few seconds (set in the configs)
		 * @param  {object}  server from the models
		 * @return {boolean}
		 */
		is_possible_to_push: function(server) {

			is_possible_to_push = true;

			// First of all, we get the last chronicle
		    last_chronicle = $h.strings.get_array_last_item(server.chronicles, false);

		    // If there's effectively a last chronicle
		    if (last_chronicle !== false) {

			    if ($h.variables.is_same_id(last_chronicle.user, $s.sessions.user()._id)) {

			    	return true;

			    }
			    
			    /**
			     * What the logic here ?
			     * We will check only the first push of any user to check if there's an antipush
			     * If the user pushed something and push another music, the protection won't be effective
			     * It is to avoid users that'd pushed everytime, it avoid locking the others
			     */

			     chronicle_from_last = 0;
			     chronicle_user_id = last_chronicle.user;

			    // We will find the last time the user wasn't the pusher
			    while ($h.variables.is_same_id(chronicle_user_id, last_chronicle.user)) {

			    	current_chronicle = $h.strings.get_array_last_item(server.chronicles, false, chronicle_from_last);

			    	// If there's a chronicle
			    	if ($h.variables.exists(current_chronicle.user)) {

			    		// We set the user of the current chronicle we are checking
			    		chronicle_user_id = current_chronicle.user;

			    	} else {

			    		// If there's no more chronicle, we will break the loop
			    		chronicle_user_id = false;

			    	}

			    	chronicle_from_last++;

			    }

			    /**
			     * We know when was the last chronicle that wasn't from the same user.
			     * We put decrement chronicle_from_last of one and
			     * We will know what was the first push of the last user that pushed chronicles
			     */
			    chronicle_from_last -= 2;
			    first_chronicle_of_last_pusher = $h.strings.get_array_last_item(server.chronicles, false, chronicle_from_last);

			    // We set the possible push date
			    possible_push_date = $h.dates.set_date(first_chronicle_of_last_pusher.created_at, $h.configs.servers.antipush);

			    // We finally compare to check if it's possible to push
			    if ($h.dates.now() > possible_push_date) {

			    	return true

			    } else {

			        $h.logs.info('Antipush system activated');
			        return false;

			    }

		    } else {

		    	// There weren't any chronicle before, so we can push for sure
		    	return true;

		    }

		},

		remove_short_chronicle: function(server) {

			last_chronicle = $h.strings.get_array_last_item(server.chronicles, false);

		    // We set the time limit
		    time_limit = $h.dates.set_past_date($h.configs.servers.chronicles.ignore);

		    // The previous chronicle was sent a few seconds ago ... Better to remove it !
		    if (last_chronicle.created_at > time_limit) {

		        $s.db.Chronicle.find({_id: last_chronicle._id}).remove().exec(function(error) {

		          $h.catches.error(error);

		          $h.logs.success('Previous Chronicle removed from Server (short listening)');

		        });

		    }

		},

		/**
		 * This will get the media object or create it if it doesn't exist
		 * @param  {object} media_source    (Youtube for now) object with media details
		 * @param  {function} callback
		 * @return {void}
		 */
		get_or_create_media: function(media_source, callback) {

			$s.db.Media.findOne({reference: media_source.reference}).exec(function(error, media) {

				$h.catches.error(error);

				// If it doesn't exist we will create it
				if (media === null) {

					$s.db.Media.create(media_source, function(error, media) {

						$h.catches.error(error);
						$h.logs.success('New media `%s` created', media.id);
						callback(media);

					});

				// It exists we just have to return it
				} else {

					$h.logs.info('We got back media `%s`', media.id);
					callback(media);

				}

			});

		},

		/**
		 * Add a new chronicle to the server
		 * @param {object} user   which pushed the track
		 * @param {object} server target server
		 * @param {object} media  the track itself
		 */
		add_new_chronicle: function(user, server, media) {

			$s.db.Chronicle.create({

				media: media._id,
				user: user._id,
				server: server._id

			}, function(error, chronicle) {

				$h.catches.error(error);

			    // In the both side because nothing is magic in NodeJS
			    server.chronicles.push(chronicle._id);

			    server.save(function(error) { 

			    	$h.catches.error(error); 

			    	$h.logs.success('Chronicle added to the server `%s`', server.id);

			    	// We also refresh our session
			    	$s.sessions.refresh('server', server);
			    	$s.memories.refresh('server', server);

			    });

			});

		},

		/**
		 * Add a new track if it doesn't exist, update the track if it already exist (and hit up + add user which pushed it)
		 * @param {object} user   which pushed the track
		 * @param {object} server target server
		 * @param {object} media  the track itself
		 */
		add_new_track: function(user, server, media, callback) {

			$s.db.Track.findOne({_id: { $in: server.tracks }, 'media': media}).exec(function(error, track) {

				if (track === null) {

			        // If the track doesn't exist yet, we will add it
			        $s.db.Track.create({

			        	media: media._id,
			        	hits: 1,
			        	users: [user._id],
			        	server: server._id

			        }, function(error, track) {

			        	$h.catches.error(error);

			        	server.tracks.push(track._id);

			        	server.save(function(error) {

			        		$h.catches.error(error);

			        		$h.logs.success('Track added to the server');

			        	});

			        });

		    	} else {

			        // If the track already exists, we will change it a little (add users + hits)
			        track.hits++;
			        track.users.push(user._id);

			        track.save(function(error) {

			        	$h.catches.error(error);
			        	$h.logs.success('Track updated to the server `%s`', server.id);

			        });

		    	}

			});

		},

		/**
		 * Alternative disconnection called from the front-end
		 * It's not a 100% sure call (not like manage_disconnect which will be called for sure)
		 * So put here only the datas that won't kill the server if they aren't refreshed or look like big bug
		 *
		 * Mainly it's the player datas that we will change here in case of disconnection
		 * Some front-end element values will be transmitted here (like the player position, as an element)
		 * 
		 * If this kind of data blows up it's not a big deal, will just make weird position at the beginning in the worst case
		 * 
		 * @param  {object} server
		 * @param  {object} datas
		 * @return {void} 
		 */
		manage_disconnect_unsafe: function (server, datas) {

			// Get the server to refresh the data
			$s.db.Server.findOne({_id: server._id}).exec(function(error, server) {

				$h.catches.error(error);

				if (server !== null) {

					/**
					 * Here we change the things we went to change before an user disconnect
					 */
					server.player.last_known_position = datas.last_known_position;

					server.save(function(error) {

						$h.catches.error(error);

					});

				}

			});

		},

		/**
		 * When someone disconnect from the server, all the process goes here
		 * @param  {object} server 
		 * @param  {object} user
		 * @return {void}
		 */
		manage_disconnect: function(server, user, device) {

			if (($h.variables.exists(user)) && ($h.variables.exists(server) && ($h.variables.exists(device)))) { // In some case it can blow up

				//this.refresh_player_last_known_position(server, );
				this.remove_user_from_server(user, server);
				this.try_remove_if_referent(device, server);

			} else {

				$h.logs.error('Server was not able to disconnect the user properly because it misses some datas');

			}

		},

		try_remove_if_referent: function(device, server) {

			// Let's try to find this server (it should match)
			$s.db.Server.findOne({_id: server._id}).exec(function(error, server) {

				$h.catches.error(error);

				 if (server !== null) {

				 	device_id = device.id;

				 	// The referent is this user, we should remove him then
				 	if (server.referent.device == device_id) {

				 		// For mongoose to understand what we want we need to have all the fields
				 		server.referent = null;

				 		$s.sessions.set('referent', server.referent);
				 		$s.memories.set('referent', server.referent);

				 		server.save(function(error) {

				 			$h.catches.error(error);
				 			$h.logs.success('Referent `%s` removed from the server', device_id);

				 			// Now that we removed the referent we will ask for a new one
				 			$w.queries.emit_socket(server._id, 'ask_for_new_referent');

				 		});

				 	}

				 }

			
			});

		},

		/**
		 * We will remove the current referent and try to take another
		 */
		remove_referent_and_take_another: function(server_id) {

			// Let's try to find this server (it should match)
			$s.db.Server.findOne({_id: server_id}).exec(function(error, server) {

				$h.catches.error(error);

				 if (server !== null) {

				 	server.referent = null;

				 	$s.sessions.set('referent', server.referent);
				 	$s.memories.set('referent', server.referent);

				 	server.save(function(error) {

				 		$h.catches.error(error);
				 		$h.logs.success('Referent `%s` removed from the server', device_id);

				 		// Now that we removed the referent we will ask for a new one
				 		$w.queries.emit_socket(server._id, 'ask_for_new_referent');

				 	});


				}

			
			});

		},

		/**
		 * Remove an user from the server
		 * @param  {object} user
		 * @param  {object} server
		 * @return {void}
		 */
		remove_user_from_server: function(user, server) {

			// We will refresh the number of server the person got
			$s.db.User.findOne({_id: user._id}).exec(function(error, user) {

				$h.catches.error(error);

				if (user !== null) {

					// We remove the item only ONCE (argument: true) because we want to conserve user multi-sessions if they exist
					user.current_servers = $h.strings.remove_item_from_array(user.current_servers, server._id, true);

					user.save(function(error) {

						$h.catches.error(error);

						$h.logs.success('Server removed for user `%s`', user.id);
						//$h.logs.object(user);

						// We will refresh the number of people on the server
						$s.db.Server.findOne({_id: server._id}).exec(function(error, server) {

							$h.catches.error(error);

							if (server !== null) {

								// We remove the item only ONCE (argument: true) because we want to conserve user multi-sessions if they exist
								server.current_users = $h.strings.remove_item_from_array(server.current_users, user._id, true);

								/**
								 * If the user was the last one we will automatically stop the play because it's annoying to come back and have music directly
								 * It checks for opened tab not for current "real" user. If the user has 2 tabs open it considered as 2 users here.
								 */
								
								if ($h.variables.is_empty_array(server.current_users)) {

									server.player.status = 'pause';

								}

								server.save(function(error) {

								 	$h.catches.error(error);

									$h.logs.success('User `%s` removed from server `%s`', user.id, server.id);
									//$h.logs.object(server);

								});

							}

						});

					});

				}

			});

		},

		/**
		 * We establish the server session with the params we got
		 * @param {object} server the server object from the database
		 * @return {object} the server object
		 */
		establish_server_session: function(server) {

			$h.logs.info('Establishing server session');

			// We register the session -> DEPRECATED -> We don't need server session because many server can be set on one user session
			//$s.sessions.set('server', server);
			$s.memories.set('server', server);

			return $s.sessions.get('server');

		},

		/**
		 * When we join any server, it will manage the session and add the user to the server
		 * @param  {object}   user    
		 * @param  {object}   server  
		 * @param  {function} callback 
		 * @return {void}
		 */
		join_server: function(user, server, callback) {

			// We add the user to the server
			this.add_user_to_server($s.sessions.user(), server, function(feedback) {

				if (feedback.success) {

					// We establish the session
					server_process.establish_server_session(feedback.params.server);

					// If the referent isn't watcher we ask for a better one directly when we enter

					/*console.log('JOIN REFERENT IS :');
					console.log(server.referent);
					if ($h.variables.is_object(server.referent)) {

						if (server.referent.watcher !== true) {

							console.log('ASK FOR BETTER REFERENT');

							$w.queries.emit_socket(server._id, 'ask_for_new_referent');

						}

					}*/
				
					callback(feedback);

				} else {

					callback($h.formats.error('Cannot join the server'));

				}

			});

		},

		/**
		 * We will try to join our private server (matching the id of the user)
		 * If we don't succeed we create it and join it
		 * @param  {objectid}   user_id
		 * @param  {function} callback
		 * @return {boolean}
		 */
		join_or_create_private_server: function(user_id, callback) {

			if (!$s.sessions.is_self(user_id)) {

				callback($h.formats.error('Impossible to join the private server, you are not the right user'));
				return false;

			}

			// Let's try to find this server (it should match)
			$s.db.Server.findOne({name: user_id}).exec(function(error, server) {

				$h.catches.error(error);

				/**
				 * If the server doesn't exist, we will create it for this user
				 */
				 if (server === null) {

					// We create the new server
					$s.db.Server.create({

						name: user_id,
						raw_name: user_id,
						type: 'private',

						player: {

							status: 'stop',
							volume: 80,
							mute: false,

							last_known_position: 0,

						},

						referent: null

					}, function(error, server) {

						$h.catches.error(error);

						if (server) {

							$h.logs.success('Server created');
							$h.logs.object(server);

							/**
							 * We add the user as owner and we "join" the server concretely
							 */
							server_process.add_owner_to_created_server($s.sessions.user(), server, function(feedback) {

								server_process.join_server($s.sessions.user(), server, function(feedback) {

									callback(feedback);

								});

							});

						}

					});

				} else {

					// We simply join the server in this case
					server_process.join_server($s.sessions.user(), server, function(feedback) {

						callback(feedback);

					});

				}

			});

		},

		/**
		 * Add an user to the server
		 * @param {object}   user 
		 * @param {object}   server 
		 * @param {function} callback
		 */
		add_user_to_server: function(user, server, callback) {

			$s.db.Server.findOne({_id: server._id}).populate('player.media').exec(function(error, server) {

				$h.catches.error(error);

				if (server !== null) {

					server.current_users.push(user._id);

					$s.db.User.findOne({_id: user._id}).exec(function(error, user) {

						$h.catches.error(error);

						if (user !== null) {

							user.current_servers.push(server._id);

							user.save(function(error) {

								$h.catches.error(error);
								
								$s.sessions.refresh('user', user);
								$s.sessions.refresh('user', user);

								server.save(function(error) {

									$h.catches.error(error);

									$h.logs.success('User `%s` added to server `%s`', user.id, server.id);
									//$h.logs.object(server);

									callback($h.formats.success({ server: server}));

								});

							});

						} else {

							callback($h.formats.error('User not found to add on this server'));

						}

					});

				} else {

					callback($h.formats.error('Server not found to add this user on'));

				}

			});

		},

		/**
		 * Add an owner to a server we just created
		 * (which means we use the ActiveRecord server object here)
		 * @param {object} owner object of the target user
		 * @param {object} server   ActiveRecord object
		 * @param {function} callback
		 */
		add_owner_to_created_server: function(owner, server, callback) {

			// We push the new owner
			server.owners.push(owner._id);

			// We push the new server as owned server for the user
			$s.db.User.findOne({_id: owner._id}, function(error, user) {

				if (user !== null) {

					$h.catches.error(error);

					user.owned_servers.push(server._id);

					user.save(function(error) {

						$h.catches.error(error);

						$s.sessions.refresh('user', user);
						$s.memories.refresh('user', user);

						server.save(function (error) {

							$h.catches.error(error);

							$h.logs.success('User added as server owner');
							$h.logs.object(server);

							callback($h.formats.success({ server: server}));

						});

					});

				}

			});

		}

	};

	return server_process;

}