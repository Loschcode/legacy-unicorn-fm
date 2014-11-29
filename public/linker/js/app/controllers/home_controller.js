/**
 * HomeController
 *
 * @module      :: Controller
 * @description :: It contains all the home section
 *
 */
define(['main', 'datas', 'variables', 'queries', 'app/controllers/search_controller', 'app/controllers/player_controller', 'pnotify'], function(Main, Datas, Variables, Queries, Search, Player)  {

  var Home = {


    /**
     *
     * VARIABLES
     * ********************************************************
     * We will define all the variables linked with the player here
     * ********************************************************
     * 
     */
    
    unicorn_ready: false, // Is the system completely ready ? (will be changed for another controller)

    /**
     *
     * ELEMENTS
     * ********************************************************
     * We will define all the elements linked with the player
     * within the controller to avoid repetition
     * ********************************************************
     * 
     */
    
    $s: {

      left_header: '#left-header',
      right_header: '#right-header', // The right header in Unicorn (with research, buttons, etc.)

      sync_icon: '#sync-icon',
      sync_button: '#sync',

      central_page: '#ajax-template-home',

    },

    /**
     *
     * INITS
     * ********************************************************
     * Here we will put all the method used to init big systems
     * such as the player or part of it etc.
     * When the user change something for example
     * ********************************************************
     * 
     */

    /**
     * We init the system on the front-end (player, watcher button, current track, etc.)
     */
    init_global: function() {

      require(['app/controllers/player_controller'], function(Player) {

        // We init the watcher button
        Player.init_watcher();

        // We init the current track (last position, title) on join
        Player.init_current_track_on_join();

        // Finally we init the whole player process
        Player.init_player();

      });

    },

    /**
     * Init system ready elements
     * When the system is ready to use (after the tubeplayer is loaded for the watchers)
     * This is called to enable some elements, etc.
     * @return {void}
     */
    init_system_ready_elements: function() {

      if (Home.unicorn_ready === false) {

        Home.unicorn_ready = true;

        Home.init_header();
        Search.init_search();

        if (Main.config.servers.sync.blink) {
        
          Home.init_sync_blink();

        }

        console.info('%cInfo : Unicorn is ready to use !', 'font-weight: bold');

        Home.init_after_join_processes();

        require(['app/controllers/base_controller'], function(Base) {
          
          Base.init_clear_preloader()
          Home.mechanism_display_central_join();

        });

      }

    },

    /**
     * After the user correctly joined the server and is ready, we call this method
     * @return {void}
     */
    init_after_join_processes: function() {

      require(['app/controllers/server_controller'], function(Server) {
  
        Server.init_try_to_be_referent_if_watcher();

      });

    },

    /**
     * We init the header (switch on the display)
     */
    init_header: function() {

      $(Home.$s.right_header).removeClass('hidden');

    },

    init_sync_blink: function() {

      Home.sync_blink_interval = setInterval(function() {

        if (typeof sync_blink_hidden === "undefined") {

          sync_blink_hidden = false;

        }

        if (sync_blink_hidden) {

          $(Home.$s.sync_icon).removeClass('hidden');
          sync_blink_hidden = false;

        } else {

          $(Home.$s.sync_icon).addClass('hidden');
          sync_blink_hidden = true;

        }
        

      }, 1500);

    },
    
    /**
     * 
     * GETS
     * ********************************************************
     * Here we will put all the method used to get the datas
     * ********************************************************
     * 
     */
    
    /**
     * Get a push success notification
     * @return {void}
     */
    get_notif_push_success: function(user, track) {

      current_user = Datas.get('user');

      // If it's the same user that pushed the track
      if (user._id == current_user._id) {

        text = 'You pushed ' + Variables.trim(track.title, 50, true);

      } else {

        text = user.nickname + ' pushed ' + Variables.trim(track.title, 50, true);

      }

      $(function() {

        new PNotify({
          title: '<i class="fa fa-cloud-upload"></i> Pushed',
          text: text,
          icon: false,
          animation: 'none',
          animate_speed: 'fast',
          delay: '4000'
        });

      });

    },

    /**
     * Get a negative notification
     * @return {void}
     */
    get_notif_wait: function() {

      $(function(){

        new PNotify({
          title: '<i class="fa fa-cloud-upload"></i> Failed',
          text: 'You must wait before push this track',
          icon: false,
          type: 'error',
          animation: 'none',
          animate_speed: 'fast',
          delay: '4000'
        });
        
      });

    },
    
    /**
     * 
     * SETS
     * ********************************************************
     * Here we will put all the method used to set the elements
     * datas, or mechanisms
     * ********************************************************
     * 
     */
    
    // Nothing

    /**
     * ACTIONS
     * ********************************************************
     * Here we will put all the method that will be called when the user use an element
     * It's directly controlled through the routes
     * ********************************************************
     */
    
    /**
     * BeforeAction
     *
     * @description :: Called at first when we run an action from the controller
     *
     */
    before_action: function() {

    },

    /**
     * MECHANISMS
     * ********************************************************
     * Here we will put all the method that can't go else where
     * They're often part of the other methods to make them tinyers
     * These methods are "mechanisms" it means they're between initializing, setting
     * And getting things ; for example, an interval that will work
     * through the page is a mechanism.
     * 
     * NOTE : Mechanisms shouldn't be called from another controller, use another method for it
     * 
     * ********************************************************
     */
    
    mechanism_display_central_join: function() {

      // Load template
      require(['hbs!app/views/home/central_join'], function(template) {

        view_datas = {


        };

        // Inject into the template
        var view = template(view_datas);
        $(Home.$s.central_page).append(view);


      });

    },

    // CURRENTLY NOT IN USE IN THE PROJECT

    /**
     * Display join
     *
     * @description :: Will display the join input
     *
     */
  	/*display_join_input_action: function() {
      
      // Hide block join
		  $('#block-join-link').removeClass('show').addClass('hidden');

      // Display form
    	$('#join-form').removeClass('hidden').addClass('show');

      // Focus on the name
    	$('#join-name').focus();

  	},*/

    /**
     * Redirect join
     *
     * @module      :: Controller
     * @description :: Will redirect the user to the server asked
     *
     */
  	/*redirect_join_action: function() {

      // Clear errors
      $('#join-error').html('');
      $('#joined-error').html('');

  		// Get value of the input text
      var name = $('#join-name').val();
      name = $.trim(name);
      
	     // If not empty
	     if (name != '') 
      {
	       location.href='join/' + name.split('#').join('');
	     }
      else
      {
        // We will display an error
        $('#join-error').html('<div class="notice notice-error bordered">You must fill the field</div><div class="spacer10"></div>');
      }

  	},

    display_action: function() {

      $('[id^=ajax-template-]').each( function () {

        // Get the id
        var id = $(this).attr('id');

        console.log(id);

        if (id != 'ajax-template-home')
        {
          $(this).remove();
        }

        $('#ajax-template-home').show();
    

      });

    }*/

  }

  return Home;
});
