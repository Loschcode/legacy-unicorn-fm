/**
 * Schema
 *
 * @module      :: Socket
 * @description	:: This is a schema to build a socket listener
 */

var $h = require(__ROOT__ + '/api/helpers');

module.exports = function($s, $w) {

    var any_process = require(__ROOT__ + '/api/processes/any_process')($s, $w);

    return {

        /**
         *
         * SOCKET CONTROLLERS GUIDELINE
         * ********************************************************
         * 
         * When someone ask something through socket to the server
         * It will automatically go to the socket controllers and call a specific function
         *
         * Anyone can call this function if he enters correctly the datas to send
         * So you need to use the different arguments given to each function to control the flow
         * And protect from hackers
         *
         * REFERENCE - The references (usually id of anything within an object) linked to the scope, will be useful to find things through the database and emit other sockets
         * PARAMS - The specific parameters that the function will use
         * CALLBACK - The callback object that the front-end will receive if it's still listening (similar to AJAX calls)
         * 
         * ********************************************************
         * 
         */
        
        /**
         *
         * CALLBACK FORMATS GUIDELINE
         * ********************************************************
         * 
         * Most of the callbacks will be send using `formats` library
         * Those are the function you can use to reply to a socket :
         *
         * callback($h.formats.error('My message')) : the listener will ignore the request and a Warning will be output in the front-end console
         * callback($h.formats.transmitted_error('My message')) : the listener will handle the request with only feedback.params.error data inside
         * callback($h.formats.success({params}, [cookie_label, cookie_value])) : the listener will handle the request, get the normal params and integrate the cookies if there's some (optional)
         * 
         * ********************************************************
         * 
         */
        
        /**
         *
         * SMALL TRICKS ABOUT DATA TRANSMISSION
         * ********************************************************
         *
         * When you want a fast direct communication between a front-end call
         * To another front-end call and callback to the first one,
         * You can simply use the home-made callback system :
         * 
         * someone_wants_a_detail: function(reference, params, callback) {
         *
         *   $w.queries.emit_socket('the_target', 'the_method_to_ask', {}, function(feedback) {
         *
         *       if (feedback.success) {
         *
         *          callback(formats.success(feedback.params)); // `feedback` variable might uses the same data format, but we never know so we rebuild it anyway (could be lighter than that)
         *       
         *       }
         *       
         *   });
         *
         *   WARNING : BE CAREFUL -> When you're in the closure, all the $h, $s, $w are provided
         *   From the user that gave the information back, when you are before,
         *   It's from the user that first called the server.
         *
         * }
         * 

        },
         */
        
        my_function: function(reference, params, callback) {

            // My stuff
            
            callback('my callback');

        },

    };

}