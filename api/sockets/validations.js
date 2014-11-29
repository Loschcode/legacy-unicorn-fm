/**
 * Socket validations
 *
 * @module      :: Validations
 * @description	:: It will validate all the socket before to call the socket controllers
 */

module.exports = {

	/**
	 * VALIDATIONS GUIDELINE
	 *
	 * controller : {
	 *
	 * 		method : {
	 *
	 * 			reference: [ 'one_ref', 'two_ref' ], // (array containing references to check, reference might be ObjectId from the front-end)
	 *
	 * 			params: {
	 *
	 * 				one_param: [ 'required'|'optional', 'any_type' ], // (check out below for further informations about 'any_type')
	 *
	 * 				two_params: [ 'required'|'optional', 'object' {
	 *
	 * 						one_sub_param: ['required'|'optional', 'any_type'], // Infinite sub-check loop
	 * 						...
	 * 				
	 * 				}],
	 * 			
	 * 			}
	 * 		
	 * 		},
	 * 
	 * }
	 *
	 * Any_type explanation :
	 *
	 * Every native JavaScript type (objectid aren't allowed because they are logically put as reference, not a param)
	 *
	 * If a param is optional, the user doesn't need to put in the socket but
	 * It will be automatically generated to avoid bugs with the value null
	 *
	 * Which means if there's a possible 'volume' param in some method and it isn't present
	 * 'volume' variable will be present with the value null
	 * 
	 * NOTE : This is to avoid the server to blow-up everytime we go through the object in the socket controllers)
	 * 
	 */

	/**
	 * ------------------
	 * PLAYER SOCKET
	 * ------------------
	 */
	player: {

		/**
		 * change method
		 */
		change: {

			reference: ['server'],

			params: {

				action: ['required', 'string'],
				volume: ['optional', 'number'],

			},

		},

	},

	/**
	 * ------------------
	 * SERVER SOCKET
	 * ------------------
	 */
	server: {

		/**
		 * push_track method
		 */
		push_track: {

			reference: ['server'],

			params: {

				media: ['required', 'object', {

					reference: ['required', 'string'],
					picture: ['required', 'string'],
					title: ['required', 'string'],
					duration: ['required', 'number']

				}],

			},

		},

		/**
		 * push_track method
		 */
		refresh_current_users: {

			reference: ['server'],

			params: {},

		},

		/**
		 * get_server_media method
		 */
		/*get_server_media: {

			reference: ['server'],

			params: {},

		},*/

		/**
		 * join_my_private_server method
		 */
		join_my_private_server: {

			reference: ['user'],

			params: {},

		},

	},

	/**
	 * ------------------
	 * USER SOCKET
	 * ------------------
	 */
	user: {

		/**
		 * automatic_signin method
		 */
		automatic_signin: {

			reference: [],

			params: {},

		},

		/**
		 * update_model_watcher
		 */
		update_model_watcher: {

			reference: [],

			params: {

				watcher: ['required', 'boolean']

			},

		},

	},
}