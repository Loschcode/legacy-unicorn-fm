/**
 * ChroniclesController
 *
 * @module      :: Controller
 * @description :: Display chronicles, etc.
 *
 */
define(['main'], function(Main)  {

  var Chronicles = {

    /**
     * BeforeAction
     *
     * @description :: Called at first when we run an action from the controller
     *
     */
  	before_action: function() {

  	},

    display_action: function() {

      // Get id of the server
      var server_id = Main.datas.get('server', '_id');

      // Get all chronicles
      $.get('../chronicles/' + server_id, function(datas) {

        // Load template
        require(['hbs!../Main/views/chronicles/list'], function(template) {

          var view_datas = {

            chronicles: datas.chronicles

          };

          var view = template(view_datas);
          $('#ajax-template-home').after(view);

        });

        // Hide the template home
        $('#ajax-template-home').hide();


      });

    }

  }

  return Chronicles;
});
