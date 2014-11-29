/**
 * User Socket
 *
 * @module      :: Socket
 * @description	:: It will manage every socket linked with the user
 */

var $h = require(__ROOT__ + '/api/helpers');

module.exports = function($s, $w) {

	var user_process = require(__ROOT__ + '/api/processes/user_process')($s, $w);

    return {

		/**
		 * Automatic sign-in
		 *
		 * Will try to sign-in the user when he enters the application
		 * Get the session if existing, or through cookies
		 * Create anonymous user if there's nothing stored
		 * Sign-in in every case
		 * 
		 * @params void
		 * @callback boolean
		 */
		automatic_signin: function(reference, params, callback) {

			//user_process.signout_user(function() { // <-- USER AUTO SIGNOUT TESTS

			// If the user is connected as true user or even anonymous
			if (!$s.sessions.is_connected_or_anonymous()) {

				// Otherwise we try to get back the session from the cookies
				user_process.try_signin_user_from_cookie(function (feedback) {

					if (feedback.success) {

						callback(feedback);

					} else {

						// If nothing worked, let's create an anonymous user and signin
						user_process.signup_and_signin_anonymous_user(function (feedback) {

							callback(feedback);

						});

					}

				});

			} else {

				$h.logs.info('We got back the user session');

				// We don't forget to set the memory
				//memory.user = $s.sessions.user();
				$s.memories.set('user', $s.sessions.user());

				// We were already logged-in, let's put a callback like if we successfully logged-in
				callback({success: true, params: {user: $s.sessions.user()}})

			}

			//}); // <-- USER AUTO SIGNOUT TESTS

		},

		/**
		 * Update model watcher
		 * SECURITY : we change the current user ONLY no matter what they put in references (very important)
		 * 
		 * @params  {watcher}
		 * @callback {void}
		 */
		update_model_watcher: function(reference, params, mekmories, callback) {

			// We push the new server as owned server for the user
			// We also update the referent of the server if it's the same user
			$s.db.User.findOne({_id: $s.sessions.user()._id}, function(error, user) {

				if (user !== null) {

					$h.catches.error(error);

					// Referent change if it's the same user
					device = $s.memories.get('device');
					server = $s.memories.get('server');

					$s.db.Server.findOne({$and : [{_id: server._id}, {'referent.device' : device.id}]}).exec(function(error, server) {

						$h.catches.error(error);

						if (server !== null) {

							server.referent.watcher = params.watcher;

							server.save(function(error) {

								$h.catches.error(error);
								$h.logs.info('Referent `watcher` data has been changed to `%s`', params.watcher);

								$w.queries.emit_socket(server._id, 'refresh_referent', {referent: server.referent});

								// If the current referent isn't watcher anymore, we should try to get a better referent
								if (params.watcher === false) {

									// We tell the user he's the new referent
									$w.queries.emit_socket(server._id, 'ask_for_better_referent');

								}


							})

						}

					})

					user.setup.watcher = params.watcher;

					user.save(function(error) {

						$h.catches.error(error);

						// We don't forget to refresh the session
						$s.sessions.refresh('user', user);
						$s.memories.refresh('user', user);

					});

				}

			});

		},

	};

}