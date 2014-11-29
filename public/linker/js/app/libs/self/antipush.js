define(['datas', 'core/dependencies/config', 'array_lib', 'moment'], function(Datas, Config, Array_lib, moment)  {

  var Antipush = {

  	_time_out: false,

  	init: function()
  	{
  		var chronicles = Datas.get('server', 'chronicles');

         if (chronicles.length > 0)
         {

            // Get last chronicle
            var last = Array_lib.last_item(chronicles);

            // Get timestamp
            var timestamp = moment(last.created_at).unix();
            var pusher = last.user;

            var init_flag = {blocked: timestamp, pusher: pusher};

        }
        else
        {

            // Init flag with default values
            var init_flag = {blocked: false};
        }

        // Inject
        Datas.reset('flag', init_flag);
  	},

  	get_state: function()
  	{
  		// Fetch user id
  		var user_id = Datas.get('user', '_id');

  		// Fetch blocked datas from unicorn datas
  		var blocked = Datas.get('flag', 'blocked');
  		var pusher = Datas.get('flag', 'pusher');

  		if (blocked === false)
  		{
  			return 'can_push';
  		}

  		if (user_id == pusher)
  		{
  			return 'can_push';
  		}

  		// Fetch limit config
        var antipush_time = Config.servers.antipush;
        var current_time = moment().unix();

        // Blocked until ?
        var blocked_until = blocked + antipush_time;

        if ( blocked_until > current_time)
        {
        	return 'cant_push';
        }
    	
    	// Set blocked to false
    	Datas.set('flag', 'blocked', false);

    	return 'can_push';
  	},

  	back_to_push_state: function()
  	{	
  		var blocked = Datas.get('flag', 'blocked');

  		// Fetch limit config
        var antipush_time = Config.servers.antipush;
        var current_time = moment().unix();

        // Blocked until ?
        var blocked_until = blocked + antipush_time;

  		// Calculate wait seconds before back to push state
  		var wait_seconds = blocked_until - current_time;

  		clearTimeout(this._time_out);

  		this._time_out = setTimeout(function() {


	        console.log('end timeout');
	        Datas.get('flag', 'blocked', false);

	        $('button[id^=track-]').not('[data-state=pushed]')
	        .prop('disabled', false)
	        .attr('class', 'btn btn-black')
	        .html('<i class="fa fa-cloud-upload"></i> Push');

	        console.log('all cleared dude');
                
        }, wait_seconds*1000);

  	},

  	set_cant_push_state: function(pusher) {
              
  			if (typeof pusher !== undefined) {

  				Datas.set('flag', 'pusher', pusher);

  			}

	  		// Get timestamp
			var now = moment().unix();

			// Set flag push blocked
			Datas.set('flag', 'blocked', now);

			// Block all buttons of users which already performed a search
			$('button[id^=track-]').attr('disabled', 'disabled');
			$('button[id^=track-]').html('<i class="fa fa-clock-o"></i> Wait before push');
		

  	}

  }

  return Antipush;

});
