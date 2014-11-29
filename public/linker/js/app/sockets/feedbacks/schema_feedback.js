/**
 * Any feedback
 *
 * @module      :: Feedback
 * @description :: Here all the callback are handled in the front-end
 *
 */

define(['main', 'datas'], function (Main, Datas) {

    /**
     *
     * CALLBACK HANDLING GUIDELINE
     * ********************************************************
     * 
     * Most of the callbacks will be send using `formats` library (back-end)
     * Those are the possible datas you can get in feedback variable
     *
     * feedback.params : all the params within the object
     * feedback.params.error : the somewhat failed and you get the error message (transmitted_error)
     * 
     * ********************************************************
     * 
     */
    
	var Any_feedback = {

		feedback_something: function(feedback) {

		},

	}

	return Any_feedback;

});
