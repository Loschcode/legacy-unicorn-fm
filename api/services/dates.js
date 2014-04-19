/**
 * Function about time (don't confund with dates)
 * @param  {object}  req the req object from the controllers
 * @return {boolean}
 */

var uniqid_from_time = function (req) {

	var date = new Date();
	var now = date.getTime().toString();
	var uniqid = now.substr(now.length - 6);

	return uniqid;
}

module.exports = {
	uniqid_from_time: uniqid_from_time
}