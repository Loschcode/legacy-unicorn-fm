define(function()  {

  var Element_lib = {

	 /**
	 * Check if the element exists
	 * @param  {object} jQuery element     
	 * @return {bool}
	 */
	exists: function(element_with_selector) {

		if (typeof element_with_selector === "undefined") {

			return false;

		}

		if (element_with_selector.length === 0) {

			return false;

		} else {

			return true;

		}

	} 

  }

  return Element_lib;

});
