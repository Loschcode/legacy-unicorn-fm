define(function()  {

  var Array_lib = {

	 /**
	 * Get the last item from the array
	 * @param  {array} array       
	 * @param  {mixed} fail_return in case of failure
	 * @return {mixed} send fail_return or the last item
	 */
	last_item: function(array, fail_return) {

		return array[array.length - 1];

	} 

  }

  return Array_lib;

});
