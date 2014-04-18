define(function()  {

  var Track = {

  	init: function() {

  	},

  	push_action: function(params) {

  		var id = params.id;
  		var selector_track = '#track-' + id;

  		// Check if the track exists in the list
  		if ($(selector_track).length > 0) {

  			// Get infos about the track
  			var player = $(selector_track).data('player');
  			var name = $(selector_track).data('name');
  			var server = $('#join-datas').data('server');

  			$(selector_track).html('Pushing ...');

  			// Send ajax post to the backend
		    $.post('/push-track', {name: name, player: player, server: server}, function(datas) {
		      
		      // It's done, so it's pushed !
		      $(selector_track).html('Pushed !');

		      // Wait and go to the basic button
		      setTimeout(function() {

		        $(selector_track).html('<i class="fa fa-cloud-upload"></i> Push');

		      }, 2000);

		    }); 

  		}

  	}

  }

  return Track;
});
