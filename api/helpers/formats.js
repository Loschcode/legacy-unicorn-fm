/**
 * Formats
 *
 * @module      :: Helper
 * @description	:: To format datas and fit with the current process
 */

var crypto = require('crypto');
var $h = require(__ROOT__ + '/api/helpers');

module.exports = {

	/**
	 * Generate error format
	 * @param  {string} message
	 * @return {object}       
	 */
	error: function (message) {

		if (!$h.variables.exists(message)) {

			message = '';

		}

		return {success: false, error: message};

	},

	/**
	 * Errors you want to transmit to the front-end anyway
	 * When you $h.formats.error the socket isn't even handled so we needed to make another function
	 * This one will be transmitted to the final function and you just need to check feedback.params.error
	 * To see the error.
	 * @param  {string} message
	 * @return {object}
	 */
	transmitted_error: function(message) {

		if (!$h.variables.exists(message)) {

			message = '';

		}

		return {success: true, params: {error: message}};

	},

	/**
	 * Generate success format
	 * @param  {object} params
	 * @param  {array} cookie optional cookie set (first = label, second = value)
	 * @return {object}
	 */
	success: function(params, cookie) {

		if (!$h.variables.exists(params)) {

			params = {};

		}

		if ($h.variables.is_object(cookie)) {

			cookie_label = cookie[0];
			cookie_datas = cookie[1];

			return {success: true, params: params, cookie: {label: cookie_label, datas: cookie_datas}};

		}

		return {success: true, params: params};

	},

	/**
	 * Set a unique id for the device which calls the function
	 * This is used in the basic session system to identify a user by its connection on Unicorn
	 */
	set_device_id: function() {

		uuid = require('node-uuid');
		id = uuid.v1({node:[0x01,0x23,0x45,0x67,0x89,0xab]});
		return id;

	},

	set_store_key: function() {

		uuid = require('node-uuid');
		id = uuid.v1({node:[0x01,0x23,0x45,0x67,0x89,0xab]});
		id = id.substr(0, 15).toUpperCase();

		return id;

	},

    /**
     * Encrypt an object
     * @param  {object} object to encrypt
     * @return {string} encrypted object
     */
	encrypt: function (object) {

		object = JSON.stringify(object);

		var cipher = crypto.createCipher('aes-256-cbc','d6F3Efeq')
		var crypted = cipher.update(object,'utf8','hex')

		crypted += cipher.final('hex');

		return crypted;

	},

	/**
	 * Decrypt an object
	 * @param  {object} object to decrypt
	 * @return {string} decrypted object
	 */
	decrypt: function (object) {

		var decipher = crypto.createDecipher('aes-256-cbc','d6F3Efeq')
		var dec = decipher.update(object,'hex','utf8')

		dec += decipher.final('utf8');
		dec = JSON.parse(dec);

		return dec;

	},

}