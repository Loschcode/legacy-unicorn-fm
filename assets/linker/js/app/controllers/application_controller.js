define(function()  {

	var Application = {

		init: function() {

		},

		start_action: function() {
			console.log('fired');
		},

		sockets_action: function(params) {
			console.log('here');
			console.log(params);
		}
	}

	return Application;
});
