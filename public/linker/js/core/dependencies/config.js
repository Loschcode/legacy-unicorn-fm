define(['core/dependencies/jquery'], function($) {    

  var Config = {

    datas: {},

    init: function() {

      if ($.isEmptyObject(Config.datas))
      {

       $.ajax({
          url: '/configs',
          type: 'GET',
          async: false,
          success: function(datas) {
            Config.datas = datas;
          }
        });

      }

    },

    get_config: function() {
      
      return Config.datas;

    }

  }

  Config.init();
  return Config.get_config();

});