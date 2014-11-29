define(function()  {

  var Variables_lib = {

  	/**
  	 * Trim after a few letters
  	 * @param {string} string the string to trim
  	 * @param  {integer} letters number of letters
  	 * @param {boolean} add_final should we add a final '...' ?
  	 * @return {string}
  	 */
	trim: function(string, letters, add_final) {

		result = string.slice(0, letters);

		if ((result.length != string.length) && (add_final)) {

			result = result + '...';

		}

		return result;

	} 

  }

  return Variables_lib;

});
