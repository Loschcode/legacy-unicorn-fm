var randomReadable = function (chars) {

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

var countWords = function (word) {

	if (typeof word == 'undefined') {
		return false;
	}

	var partsWord = word.split(' ').filter(function(element, pos, self) {
  		return element !== '';
  	});

  	return partsWord.length;
}


module.exports = {
	randomReadable: randomReadable,
	countWords: countWords,
}