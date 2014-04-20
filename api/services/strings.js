/**
 * Check whether a variable exists or not
 * @param  {mixed} variable any variable you want to check
 * @return {boolean}
 */
var exists = function(variable) {

	if (variable || typeof variable == 'undefined') {

		return false;

	}

	return true;

}

/**
 * Generate a readable string such as 'ahah' or 'ozugata'
 * @param  {integer} chars the number of characters you want to generate
 * @return {string} the readable string
 */
var random_readable = function (chars) {

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

}

/**
 * Count the number of words in a string
 * @param  {string} string the words you want to count
 * @return {integer} the number of words
 */
var count_words = function (string) {

	if (typeof string == 'undefined') {
		return false;
	}

	var partsWord = string.split(' ').filter(function(element, pos, self) {
  		return element !== '';
  	});

  	return partsWord.length;
}


module.exports = {
	random_readable: random_readable,
	count_words: count_words,
}