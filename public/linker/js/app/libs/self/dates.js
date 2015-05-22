define(function()  {

  var Dates_lib = {

	convert_weird_time_format: function(duration){

		var matches = duration.match(/[0-9]+[HMS]/g);

		var seconds = 0;

		matches.forEach(function (part) {
			var unit = part.charAt(part.length-1);
			var amount = parseInt(part.slice(0,-1));

			switch (unit) {

				case 'H':
				seconds += amount*60*60;
				break;
				case 'M':
				seconds += amount*60;
				break;
				case 'S':
				seconds += amount;
				break;
				default:
                // noop
              }
        
    });

		return seconds;

  }, 

	format: function(duration) {

		var date = new Date(duration * 1000);
		var hh = date.getUTCHours();
		var mm = date.getUTCMinutes();
		var ss = date.getSeconds();

		if (hh < 10) hh = '0' + hh
		if (mm < 10) mm = '0' + mm
		if (ss < 10) ss = '0' + ss


		if (hh == '00') duration = mm + ':' + ss;
		else duration = hh + ':' + mm + ':' + ss;

		return duration;
		
	} 

  }

  return Dates_lib;

});
