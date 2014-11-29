define(function() {

	return [

		/**
		 * HOME
		 */

		// Display home
		['#menu-home', 'click', 'home::display'],

		// Home page - Display the input to join a server
		['#join-link', 'click', 'home::display_join_input'],

		// Home-page - Redirect to the server
		['#redirect-join', 'submit', 'home::redirect_join'],

		/**
		 * USER
		 */

		// Subscribe 
		['#subscribe', 'submit', 'user::subscribe'],

		// Login
		['#login', 'submit', 'user::login'],

		/**
		 * SEARCH
		 */

		// Search track
		['#form-search-track', 'submit', 'search::fetch_results'],

		/**
		 * TRACK
		 */

		// Push track
		['li[id^=track-]', 'click', 'track::push_track', 'delayed'],

		/**
		 * CHRONICLES
		 */

		// Display chronicles
		['#menu-chronicles', 'click', 'chronicles::display'],

		/**
		 * SERVER
		 */
		
		// Sync
		['#sync', 'mouseover', 'server::show_tooltip_lag', 'delayed'],

		// Rename server
		['#server-name', 'click', 'server::rename'],

		/**
		 * PLAYER
		 */
		
		// Play player
		['#player-play', 'click', 'player::play', 'delayed'],

		// Pause player
		['#player-pause', 'click', 'player::pause', 'delayed'],

		// Stop player
		['#player-stop', 'click', 'player::stop', 'delayed'],

		// Stop player
		['#volume-icon', 'click', 'player::mute_or_unmute', 'delayed'],

		// Change volume player
		['#volume', 'slidestop', 'player::volume', 'delayed'],

		// Prepare change position player
		['#duration', 'mousedown', 'player::pre_position', 'delayed'],

		// Change position player
		['#duration', 'slidestop', 'player::position', 'delayed'],

		// Watch/Unwatch player
		['#watch', 'click', 'player::watch'],

	];


});