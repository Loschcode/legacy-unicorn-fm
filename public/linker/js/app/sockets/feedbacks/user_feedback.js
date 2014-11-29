/**
 * User feedback
 *
 * @module      :: Feedback
 * @description :: Here all the callback are handled in the front-end
 *
 */

define(['main', 'datas', 'queries', 'app/controllers/user_controller'], function (Main, Datas, Queries, User) {

	var User_feedback = {

		/**
		 * Set the header and then try to join the private server of the signed-in user
		 */
		feedback_automatic_signin: function(feedback) {

			User.init_user(feedback.params.user, function() {

				/**
				 * We set some properties from the last time he came
				 */
				Datas.set('options', 'watcher', feedback.params.user.setup.watcher);

				/**
				 * We access the private server of the user
				 */
				 user_id = Datas.get('user', '_id');

				 Queries.emit_socket('server.join_my_private_server', {user: user_id});

			});

			},

		}

	return User_feedback;

});
