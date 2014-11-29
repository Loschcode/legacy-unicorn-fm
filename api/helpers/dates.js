/**
 * Dates
 *
 * @module      :: Service
 * @description	:: All the small methods about the date environment area
 */

var $h = require(__ROOT__ + '/api/helpers');

module.exports = {

    /**
     * Function about time (don't confund with dates)
     * @return {string}
     */
    uniqid_from_time: function () {

    	var date = new Date();
    	var now = date.getTime().toString();
    	var uniqid = now.substr(now.length - 6);

    	return uniqid;
    },

    now: function() {

        return new Date();

    },

    /**
     * Get a past date from X second to the present
     * @param {integer} seconds
     * @return {date}
     */
    set_past_date: function (seconds) {

        return new Date(new Date().getTime() - seconds*1000);

    },

    /**
     * Set date from a date variable and adding X seconds to it
     * @param {date} date date to increment
     * @param {integer} seconds that will be incremented to the date
     * @return {date}
     */
    set_date: function (date, seconds) {

        return new Date(date.getTime() + seconds*1000);

    },

    /**
     * Make a Date() readable from the actual timestamp
     * @param  {date} date
     * @return {string}
     */
    relative_readable: function (date) {

        // If the format isn't correct, we return the object what was sent
        if (isNaN(new Date() - date)) {

            return date;

        }

    	// Let's get the seconds
        var seconds = Math.floor((new Date() - date) / 1000);

        var interval = Math.floor(seconds / 31536000);

        // The years
        if (interval >= 1) {

        	if (interval === 1) return interval + " year ago";
            return interval + " years ago";

        }

        interval = Math.floor(seconds / 2592000);

        // The months
        if (interval >= 1) {

        	if (interval === 1) return interval + " month ago";
            return interval + " months ago";

        }

        interval = Math.floor(seconds / 86400);

        // The days
        if (interval >= 1) {

    		if (interval === 1) return interval + " day ago";
            return interval + " days ago";

        }

        interval = Math.floor(seconds / 3600);

        // The hours
        if (interval >= 1) {

        	if (interval === 1) return interval + " hour ago";
            return interval + " hours ago";

        }

        interval = Math.floor(seconds / 60);

        // The minutes
        if (interval >= 1) {

        	if (interval === 1) return interval + " minute ago";
            return interval + " minutes ago";

        }

        // The seconds
        if (Math.floor(seconds) < 30) {

        	return 'just now';

        } else {
        	
        	return Math.floor(seconds) + " seconds ago";
    	}

    },

}