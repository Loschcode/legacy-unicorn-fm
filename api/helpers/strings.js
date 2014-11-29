/**
 * Strings
 *
 * @module      :: Helper
 * @description	:: We will put all the methods we need to process strings and such
 */

var $h = require(__ROOT__ + '/api/helpers');

module.exports = {

	/**
	 * Count the number of uppercase letters in a string
	 * @param  {string} string e.g. AhgezGHJ
	 * @return {integer} 
	 */
	count_uppercase_letters: function(string) {

		return string.replace(/[^A-Z]/g, "").length;

	},

	/**
	 * Uppercase the first letter of the nickname if there's no uppercase in it
	 * @param  {string} nickname
	 * @return {string}
	 */
	process_smart_nickname: function(nickname) {

		if (count_uppercase_letters(nickname) === 0) {

			return ucfirst(nickname);

		} else {

			return nickname;

		}

	},

	/**
	 * Uppercase the first letter
	 * @param  {string} string
	 * @return {string}
	 */
	ucfirst: function(string) {

	  first_letter = string.charAt(0).toUpperCase();

	  return first_letter + string.substr(1);

	},

	/**
	 * Check if the entry is in array
	 * @param  {string} needle   what we are searching
	 * @param  {array} haystack where we are searching
	 * @return {boolean}
	 */
	in_array: function (needle, haystack) {

	    var length = haystack.length;

	    for(var i = 0; i < length; i++) {
	        if(haystack[i] == needle) return true;
	    }

	    return false;

	},

	/**
	 * Process the string and convert it to a raw one (e.g. 'HeLLo' -> 'hello')
	 * @param  {string} string
	 * @return {string}
	 */
	process_raw_format: function(string) {

		final_string = string.toLowerCase();

		return final_string;

	},

	/**
	 * The string is alphanumeric and contains dashes but nothing else
	 * @param  {string}  string
	 * @return {boolean}     
	 */
	is_alphanumeric_with_dashes: function(string) {

		if (string.search(/^[a-zA-Z0-9-_]+$/) == -1) {

			return false;

		}

		return true;

	},

	/**
	 * Get the last item from the array
	 * @param  {array} array       
	 * @param  {mixed} fail_return in case of failure
	 * @param {integer} from_last_item if we set it to 0 it's the last item, 1 is the one before, etc.
	 * @return {mixed} send fail_return or the last item
	 */
	get_array_last_item: function(array, fail_return, from_last_item) {

		if (!$h.variables.exists(from_last_item)) {

			from_last_item = 0;

		}

		// We don't want to get the length but the length-1
		from_last_item = from_last_item + 1;

		last_item_position = array.length - from_last_item;

		if (last_item_position <= 0) {
			
			return fail_return;

		}

		return array[last_item_position];

	},

	/**
	 * Remove duplicates keys from any array
	 * @param  {array} array the target
	 * @return {array} cleaned array
	 */
	remove_duplicates_from_array: function(array) {

		return array.filter(function(elem, pos) {
	    	
	    	return array.indexOf(elem) == pos;

	  	});

	},

	/**
	 * Remove a targeted item from an array
	 * @param  {array} array source
	 * @param  {item} item  target
	 * @param {boolean} once will we delete this item once or multiple times ?
	 * @return {array} filtered
	 */
	remove_item_from_array: function(selected_array, item, once) {

		var new_array = [];
		var found = false;
		var item_compared = item.toString(); // We need to convert everything in string because JavaScript is shit and cannot compare 2 ObjectId

		for (var i = 0; i < selected_array.length; i++) { 

			selected = selected_array[i].toString();

			if ((selected != item_compared) || ((found === true) && (once === true))) {

				new_array.push(selected_array[i]);

			} else {

				found = true

			}

		}

		return new_array;

	},

	/**
	 * Generate a readable string such as 'ahah' or 'ozugata'
	 * @param  {integer} chars the number of characters you want to generate
	 * @return {string} the readable string
	 */
	random_readable: function (chars) {

		// If chars not specified, set default value
		if (chars == 0) {
			chars = 6;
		} else {
			chars = parseInt(chars);
		}

		var max = Math.floor(chars/2);

		var conso = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
		var vocal = ['a', 'e', 'i', 'o', 'u'];

		randomString = '';

		i = 0;

		while (i != max) {

			randomString += conso[Math.floor(Math.random()*conso.length)];
			randomString += vocal[Math.floor(Math.random()*vocal.length)];

			// Increment
			i+=1;
		}


		return randomString;

	},

	/**
	 * Count the number of words in a string
	 * @param  {string} string the words you want to count
	 * @return {integer} the number of words
	 */
	count_words: function (string) {

		if (typeof string == 'undefined') {
			return false;
		}

		var partsWord = string.split(' ').filter(function(element, pos, self) {
	  		return element !== '';
	  	});

	  	return partsWord.length;
	},

}