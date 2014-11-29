/**
 * Player feedback
 *
 * @module      :: Feedback
 * @description :: Here all the callback are handled in the front-end
 *
 */

define(['main', 'datas', 'app/controllers/player_controller'], function (Main, Datas, Player) {

	var Player_feedback = {

		feedback_ask_for_track_position_on_join: function(feedback) {

			console.info('Info : We retrieved the synchronized position of the track');

			watcher = Datas.get('options', 'watcher');
			Player.init_player_position(watcher, false, feedback.params.youtube_datas)

		},

	}

	return Player_feedback;

});
