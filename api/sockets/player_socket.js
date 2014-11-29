/**
 * Player Socket
 *
 * @module      :: Socket
 * @description	:: It will manage every socket linked with the player
 */

var $h = require(__ROOT__ + '/api/helpers');

module.exports = function($s, $w) {

	var player_process = require(__ROOT__ + '/api/processes/player_process')($s, $w);

	return {

		/**
		 * An user certainly joined the server and asked for the correct position of the track
		 */
		ask_for_track_position_on_join: function(reference, params, callback) {

			$w.queries.emit_socket('referent', 'get_track_position_new_user', {}, function(feedback) {

				// Could be way better made
				if (feedback.success) {

					callback($h.formats.success({youtube_datas: feedback.params.youtube_datas}));

				} else {

					callback($h.formats.error(feedback.error));

				}

			});

		},

		// WILL BE USED AFTER
		/*set_track_position: function(reference, params, callback) {

			referent = $s.memories.get('referent');

			$h.logs.info('Referent `%s` has sent track position (%s/%s) ', referent.device, params.youtube_datas.position, params.youtube_datas.duration);
			
			// We transmit to all the users of the server (some people will simply ignore it and some others will change the progress bar)
			$w.queries.emit_socket(reference.server, 'set_track_position', {youtube_datas: params.youtube_datas});

		},*/

		/**
		 * An user changed something on the player
		 */
	    change: function(reference, params, callback) {

	    	$s.db.Server.findOne({_id: reference.server}).exec(function(error, server) {

	    		$h.catches.error(error);

	    		if (server !== null) {

					/**
					 * We will process the database depending on the datas we received
					 */
					
					/**
					 * STATUS
					 */
					if ($h.strings.in_array(params.action, ['play', 'pause', 'stop'])) {

						server.player.status = params.action;

					}

					/**
					 * MUTE
					 */
					else if ($h.strings.in_array(params.action, ['mute', 'unmute'])) {

						if (params.action == 'mute') {
							
							server.player.mute = true;

						} else {

							server.player.mute = false;

						}

					}

					/**
					 * VOLUME
					 */
					else if ($h.strings.in_array(params.action, ['volume'])) {

						server.player.volume = Number(params.volume);

					}

					/**
					 * POSITION
					 */
					else if ($h.strings.in_array(params.action, ['position'])) {

						server.player.last_known_position = Number(params.position);

					}

					server.save(function(error) {

						$h.catches.error(error);

						$w.queries.emit_socket(reference.server, 'set_player_change', {action: params.action, volume: params.volume, position: params.position});

					});

	    		}

	    	});

	    },

	};

}