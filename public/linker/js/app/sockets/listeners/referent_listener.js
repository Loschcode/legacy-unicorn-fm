/**
 * Any Listener
 *
 * @module      :: Listener
 * @description :: Socket reception
 *
 */

define(['main', 'datas', 'queries', 'app/controllers/player_controller'], function (Main, Datas, Queries, Player) {

	var Referent_listener = {

		listener_get_track_position_new_user: function(params, callback) {

			youtube_datas = Player.get_player_datas_from_anywhere();

			/**
			 * If it worked (it can fails sometimes, it depends on tubeplayer)
			 * We send a general reset for the users of the server
			 */
			if (youtube_datas.duration !== 0) { // This can also mean the track has simply ended

				callback({success: true, params: {youtube_datas: youtube_datas}});

			// We ask for a new referent because this one doesn't seem to have datas
			} else {

				callback({success: false, error: 'Track duration unavailable'});

				console.info('Info : the track duration is unavailable, we will ask another guy to be referent');
				
				Queries.emit_socket('server.ask_for_new_referent');

			}

		},

	}

	return Referent_listener;

});
