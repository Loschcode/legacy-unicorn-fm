/**
 * Configuration
 *
 * @module      :: Helper
 * @description	:: Application configuration (shared with the front-end)
 */

var $h = require(__ROOT__ + '/api/helpers');

module.exports = {

	/**
	 * About
	 * All the datas about Unicorn
	 */
	system: {

		port: 8003,
		session_expiration: 2, // hours

		reboot: __START__, // Reboot date

	},

	about: { 

		version: "Black Mamba (0.0.4a)", // Unicorn's version
		environment: "development", // Which environment ? production|testing|development
		mode: "annoying", // Which mode ? annoying|verbose|quiet|dead (in every side it will show more or less informations)

	},

	sockets: {

		server: "localhost",
		port: 8082

	},

	users: {

		nickname_min_length: 3, // Nickname min length
		nickname_max_length: 18, // Nickname max length

	},

	players: {

		max_track_title_display: 55, // Max showed title on the player (the rest will be replaced with "...")

	},

	servers: {

		sync: {

			high: 1.7,
			medium: 3.5,

			blink: false

		},

		lag: 1.5, // The number of seconds we add to the user when getting a track position (to stay SYNC)
		referent_heartbeat: 5000, // Referent data transmission interval

		antipush: 30, // The default time people aren't allowed to push after a succesfull push (seconds)

		name_min_length: 1,
		name_max_length: 25, // Name max length - matches with ObjectId sizes

		chronicles: {

			ignore: 10, // Chronicles will be ignored if they last less than Xsec from the next one

		}

	},

	searches: {
		   
	    max_results: 40, // How many results to display at max
	    youtube_api_key: 'AIzaSyCScG8VsrHH1Eww0JBguQKoD7OZpXWt9nY'

	},

	/**
	 * Changes depending on the environment
	 */

	/*if (about.environment == 'testing') { // If we are on the testing server we must change some details

		sockets.server = '188.226.171.63';
		sockets.port = 8080;

	}*/

}