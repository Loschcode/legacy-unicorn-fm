/**
 * Server Listener
 *
 * @module      :: Listener
 * @description :: Socket reception
 *
 */

define(['main', 'datas', 'queries', 'app/controllers/server_controller', 'app/controllers/player_controller', 'app/controllers/home_controller'], function (Main, Datas, Queries, Server, Player, Home) {

	var Server_listener = {

		listener_set_player_change: function(params, callback) {


			if (params.action == 'play') {

				Player.init_play();

			}

			else if (params.action == 'pause') {

				Player.init_pause();

			}

			else if (params.action == 'stop') {

				Player.init_stop();

			}

			else if (params.action == 'mute') {

				Player.init_mute();

			}

			else if (params.action == 'unmute') {

				Player.init_unmute();

			}

			else if (params.action == 'volume') {

				Player.init_volume(params.volume);

			}

			else if (params.action = 'position') {

				Player.init_position(params.position);

			}


		},

		/**
		 * We set the track position for non-watchers and check the sync
		 * SENT FROM HEARTBEAT)
		 */
		listener_refresh_track_position_and_check_sync: function(params, callback) {

			if (!Server.get_is_ignore_heartbeat_active()) {

				// If the user is the referent
				if (!Server.get_am_i_referent()) {

					referent_track_position = params.youtube_datas.position;
					current_user_track_position = Player.get_player_datas_from_anywhere().position;

					current_lag = referent_track_position - current_user_track_position;

					Server.init_sync(current_lag);

					// If he's not watcher we also refresh the correct position
					if (Datas.get('options', 'watcher') === false) {

						Player.init_position(referent_track_position);

					}

				} else {

					// We set the sync button as blue (referent), and with 0 lag
					Server.set_sync(0, 0);

				}

			}

		},

		/**
		 * The server asked for a better referent, let's try to be one]
		 */
		listener_ask_for_better_referent: function(params, callback) {

			Server.init_try_to_be_referent_if_watcher();

		},

		/**
		 * The server asked for a new referent, let's try to be one]
		 */
		listener_ask_for_new_referent: function(params, callback) {

			device = Datas.get('device', 'id');
			watcher = Datas.get('options', 'watcher');

			Datas.clean('referent');

			Queries.emit_socket('server.try_to_be_referent', {server: server_id}, {device: device, watcher: watcher});

		},

		/**
		 * All the users will set the new referent
		 */
		listener_set_new_referent: function(params, callback) {

			Datas.reset('referent', params.referent);

			console.info('Info : New referent set on this server');

			// If the user is the new referent
			if (params.referent.device == Datas.get('device', 'id')) {

			      // We initialize the referent socket listener
			      require(['app/sockets'], function(Sockets) {

			        Sockets.init_referent_casual_socket(); // We handle the listening now
			        Server.init_referent_data_sending(); // We will send regularly datas
			        
			      });

			      console.info('Info : You were selected as new referent for this server');
				

			} else {

				console.info('Info : Referent attributes removed');
			    
			    require(['app/sockets'], function(Sockets) {

					// We are not referent anymore, so we remove the potential intervals, sockets handlers
					Sockets.init_remove_referent_casual_socket();
					Server.init_remove_referent_data_sending();

				});

			}

		},

		/**
		 * Reset the referent data
		 */
		listener_refresh_referent: function(params, callback) {

			Datas.reset('referent', params.referent);
			console.info('Info : Referent datas has been refreshed');

		},

		/**
		 * Set the current track of the server
		 */
		listener_set_current_track: function(params, callback) {

			Home.get_notif_push_success(params.user, params.media);

			// We set the media within the header datas
			Server.init_media(params.media);

			// We reset the player data because the player has changed a little bit (last known position mostly)
			Datas.reset('player', params.server.player);

	        // We play the current track
	        Player.init_force_play(params.media);

		},

		/**
		 * The server has been reboot, we will disconnect the user
		 */
		listener_set_current_users: function(params, callback) {

			number_users = params.current_users.length;
			Server.set_current_users(number_users);

		},

	}

	return Server_listener;

});
