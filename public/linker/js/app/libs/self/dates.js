define(function()  {

  var Dates_lib = {

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
