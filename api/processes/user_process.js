/**
 * User Process
 *
 * @module      :: Process
 * @description	:: It will manage the users processes (usually used through the sockets)
 */

var sha1 = require('sha1');

var $h = require(__ROOT__ + '/api/helpers');

module.exports = function($s, $w) {

	user_process = {

		/**
		 * We will try to signin the user from his cookies
		 * @return {boolean} did we effectively signin ?
		 */
		try_signin_user_from_cookie: function(callback) {

			if ($s.cookies.user()) {

				var user = $h.formats.decrypt($s.cookies.user());

				$h.logs.info('Trying to authenticate user `%s` from his cookies', user._id);

				// We check if the cookie is correctly made first
				if ($h.variables.exists(user.nickname)) {

					// We sign-in the user anonymous or not (but if he's anonymous it will be a hidden signin)
					this.signin_user_or_anonymous(user.nickname, user.password, function(feedback) {

						callback(feedback);

					});

				}

			} else {

				callback($h.formats.error('Impossible to sign-in from cookie, there is no cookie stored'));

			}

		},

		/**
		 * We will set the user as anonymous if needed
		 * @callback {object} the user object
		 */
		signup_and_signin_anonymous_user: function(callback) {

		  	/**
		  	 * 
		  	 * Let's create a new anonymous user
		  	 * 
		  	 */
		  	
		  	uniqid = $h.dates.uniqid_from_time();
		  	nickname = 'Anonymous' + uniqid;
		  	password = 'anonymous';

		  	$s.db.User.create({

		  	 	nickname: nickname,
		  	 	raw_nickname: $h.strings.process_raw_format(nickname),
		  	 	encrypted_password: sha1(password),
		  	 	email: 'anon' + uniqid + '@anonymous.com',
		  	 	role: 'anonymous',

		  	 	setup: {

		  	 		watcher: true

		  	 	}

		  	}, function(error, user) {

		  	 	$h.catches.error(error);

		  	 	if (!error) {

		  	 		$h.logs.success('Anonymous user was created');
		  	 		$h.logs.object(user);

		  	 		// We set the params
		  	 		user = user_process.establish_user_session(user);
		  	 		params = {user: user};

		  	 		// We set the cookie
		  	 		cookie_value = user_process.establish_user_cookie(user, password);
		  	 		cookie = ['user', cookie_value];

		  	 		// Final callback after subscription (and we set a cookie)
		  	 		callback($h.formats.success(params, cookie));

		  	 	}

		  	});

		},

		/**
		 * We establish the user cookie with the datas we got
		 * @param {object} user the user object
		 * @param {string} password the non-crypted password of the user (we need it for the cookies)
		 * @return {object} encrypted object to set the cookie in the front-end
		 */
		establish_user_cookie: function(user, password) {

			$h.logs.info('Establishing user cookie');

			// We encrypt the data because we are paranoïac
			var cookie = { nickname: user.nickname, password: password };
			var encrypted_cookie = $h.formats.encrypt(cookie);

			return encrypted_cookie;

		},

		/**
		 * We establish the user session with the datas we got
		 * @param {object} user the user object from the database
		 * @return {object} the user object
		 */
		establish_user_session: function(user) {

			$h.logs.info('Establishing user session');

			// We register the session
			$s.sessions.set('user', user);

			// We register the memory for the page (we will get it back in the socket area)
			$s.memories.set('user', user);

			return $s.sessions.get('user');

		},

		/**
		 * Sign-in user even if it's an anonymous one (different from the true signin, we just keep a session)
		 * @param  {string}   nickname
		 * @param  {string}   password not encrypted password
		 * @callback {object} success, datas
		 */
		signin_user_or_anonymous: function(nickname, password, callback) {

	      	// We will compare the raw nickname, not the nickname itself
	      	raw_nickname = $h.strings.process_raw_format(nickname);

	      	$s.db.User.findOne({raw_nickname: raw_nickname}, function (error, user) {

	      		$h.catches.error(error);

	      		if (user) {

	        		// We compare the passwords
	        		if (sha1(password) == user.encrypted_password) {

	            	$h.logs.info('Processing user sign-in');

		          	// We connect him
		          	user = user_process.establish_user_session(user);
		          	cookie = user_process.establish_user_cookie(user, password);

		  	 		callback({

		  	 			success: true, 
		  	 			params: {user: user}, 
		  	 			cookie: {label: 'user', datas: cookie}

		  	 		});
		  	 		
	          		} else {

	          			callback($h.formats.error('No nickname/password match'));

	          		}

	      		} else {

	      			callback($h.formats.error('This user doesn\'t exist'));

	      		}

	  		});

		},

		/**
		 * User log-out
		 * @param  {function} callback
		 * @return {void}
		 */
		signout_user: function (callback) {

			if ($s.sessions.user()) {

				$h.logs.info('Processing user sign-out');

				/**
				 * We also remove our online session because we won't be able to end it properly
				 */
				 $s.db.Server.update({current_users: $s.sessions.user()._id}, {

				 	'$pull': { 'current_users': $s.sessions.user()._id }

				 }, {multi: true}).exec(function(error, affected) {
				 
					 $h.catches.error(error);

					 console.log('CALLBACK:');
					 console.log(callback);

					 // Then we delete everything
					 $s.sessions.remove('user');
					 $s.sessions.remove('server');

					 callback($h.formats.success());

				 });

			} else {

				$h.logs.info('Impossible to sign-out the user, he was not logged-in');
				callback($h.formats.error());

			}

		},

	};

	return user_process;

}