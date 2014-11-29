/**
 * Server feedback
 *
 * @module      :: Feedback
 * @description :: Here all the callback are handled in the front-end
 *
 */

define(['main', 'datas', 'queries', 'app/controllers/server_controller', 'app/controllers/player_controller', 'app/controllers/home_controller', 'app/controllers/track_controller'], function (Main, Datas, Queries, Server, Player, Home, Track) {

	var Server_feedback = {

		/**
		 * Get the current referent and refresh the header
		 */
		feedback_get_referent: function(feedback) {

			Datas.reset('referent', feedback.params.referent);

		},

		/**
		 * Join the private server with the datas we received
		 */
		feedback_join_my_private_server: function(feedback) {

			// Set if the user is watcher when he joins his own private server
			watcher = Datas.get('options', 'watcher');

			Server.init_server(feedback.params.server, watcher, function() {

				server_id = Datas.get('server', '_id');

			    /**
			     * We refresh the online users as well (at the same time)
			     */
			    Queries.emit_socket('server.refresh_current_users', {server: server_id});

			    /**
			     * We get the referent of this server
			     */
			    Queries.emit_socket('server.get_referent', {server: server_id});

			    /**
			     * Finally we init the system
			     */
			    Home.init_global();

			});

		},

		feedback_push_track: function(feedback) {

            if (!feedback.params.error) {

            	feedback.selector.find(Track.$s.push_details).html('Pushed !');
	            //selector.attr('data-state', 'pushed');
	              
            } else {

            	feedback.selector.find(Track.$s.push_details).html(feedback.params.error);
            	//Home.get_notif_wait();

            }

          // Remove the details and enable again the click
          setTimeout(function() {

            feedback.selector.removeAttr('disabled');
            feedback.selector.find(Track.$s.push_details).html('');

          }, 2000);

		},

		/**
		 * Set the server media with the datas we received
		 */
		/*get_server_media: function(feedback) {

			// Set the header
			Server.init_media(feedback.params.media);

		},*/

		/**
		 * Set the online users with the datas we received
		 */
		feedback_refresh_current_users: function(feedback) {

			// Useless feedback for the tests

		},

	}

	return Server_feedback;

});
