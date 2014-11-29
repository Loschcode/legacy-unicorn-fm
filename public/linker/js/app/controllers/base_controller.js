/**
 * Base Controller
 *
 * @module      :: Controller
 * @description :: It will be launched when the user enters the application
 *
 */
define(['main', 'app/controllers/player_controller', 'app/controllers/search_controller'], function(Main, Player, Search)  {

  var Base = {


    /**
     *
     * VARIABLES
     * ********************************************************
     * We will define all the variables linked with the player here
     * ********************************************************
     * 
     */
    
    // Nothing

    /**
     *
     * ELEMENTS
     * ********************************************************
     * We will define all the elements linked with the player
     * within the controller to avoid repetition
     * ********************************************************
     * 
     */
    
    // Nothing

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
     * Page preloader when entering Unicorn
     */
    init_preloader: function() {

      // Add loading
      $(Search.$s.results).html('<div class="text-center search-loader"><i class="fa fa-cog fa-spin fa-5x"></i></div>');

    },

    /**
     * Preloader clearing when Unicorn is loaded completely
     */
    init_clear_preloader: function() {

      // Add loading
      $(Search.$s.results).html('');

    },

    /**
     * Will disable all the "blue" selection areas everywhere but the input (to look like a true app)
     */
    init_disable_global_select: function() {

      // DEPRECATED -> We used css (but this method could be converted to something else so we let it here for now)
      //$('body *').not(':has(input)').not('input').disableSelection(); _> SHIT DON'T WORK

    },

    /**
     * Init the different sliders such as volume and duration
     * (no data transfer, it's only a display here)
     */
    init_sliders: function() {

      require(['jqueryui'], function() {

        // We set the volume
        if ($(Player.$s.player_volume).length > 0) {

          $(Player.$s.player_volume).slider({

            range: "min",
            value: 0,
            min: 0,
            max: 100

          });

        }

      $(Player.$s.player_duration).slider({

          range: "min",
          value: 0,
          min: 0,
          max: 0

        });

      });

    },

    /**
     * Init the clear result button from the search bar
     */
    init_clear_result: function() {

      if ($(Search.$s.clear_results).length > 0) {

        $(Search.$s.clear_results).hide();

      }

    },

    /**
     * Init the auto focus from the search bar
     */
    init_auto_focus: function() {

      // Check if search element exists
      if ($(Search.$s.search_input).length > 0) {
        
        $(Search.$s.search_input).focus();

      }

    },

    /**
     * Init the left slider menu
     */
    init_menu: function() {

      // Check if show details exists
      if ($('#show-details').length != 0) {
        
        $('#show-details').click(function() {
          
          $details = $('#details');

          if ($details.hasClass('hidden')) {

            $details.removeClass('hidden').addClass('visible');

          } else {

            $details.removeClass('visble').addClass('hidden');

          }

        });

      }

    },

    /**
     * 
     * GETS
     * ********************************************************
     * Here we will put all the method used to get the datas
     * ********************************************************
     * 
     */
    
    // Nothing
    
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
     * Called first when we run an action from the controller
     *
     */
    before_action: function() {

      // Load bootstrap js
      require(['bootstrap'], function() {

        // Init tooltip system
        $('.js-tooltip').tooltip();

      });

    },

    /**
     * RunAction
     * This will be run when the user comes to the app originally
     */
    run_action: function() {

      /**
       * We will init the basics elements of the page
       */
      Base.init_preloader();
      Base.init_disable_global_select();
      Base.init_sliders();
      Base.init_menu();
      Base.init_auto_focus();
      Base.init_clear_result();

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
    
    // Nothing
    
  }

  return Base;

});
