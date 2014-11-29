define(['core/dependencies/config', 'datas', 'array_lib', 'socket'], function(Config, Datas, Array_lib, Socket_io)  {

  var Main = {

    config: Config,
    
    datas: Datas,

    array: Array_lib,

    socket: function() {

    	return Socket_io.connect('http://'+Main.config.sockets.server+':'+Main.config.sockets.port);

    }

  }

  return Main;

});
