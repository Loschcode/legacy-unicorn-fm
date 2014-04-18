define(function()  {

  var Home = {

  	init: function() {

  	},

  	display_join_input_action: function() {

		$('#join-link').removeClass('show').addClass('hidden');
    	$('#join-form').removeClass('hidden').addClass('show');
    	$('#join-name').focus();

  	},

  	redirect_join_action: function() {

  		// Get value of the input text
      	var name = $('#join-name').val();

	      // If not empty
	      if (name != '') {
	        location.href='join/' + name;
	      }
  	}

  }

  return Home;
});
