/**
 * TrackController
 *
 * @module      :: Controller
 * @description :: Handle push actions
 *
 */
define(['main', 'datas', 'queries', 'variables', 'app/controllers/player_controller', 'pnotify'], function(Main, Datas, Queries, Variables, Player)  {

  var Track = {

    /**
     *
     * VARIABLES
     * ********************************************************
     * We will define all the variables linked with the player here
     * ********************************************************
     * 
     */
    
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

      push_details: '#push-details',

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
    
    // Nothing
    
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
    
    set_title_track: function(current_title) {
      
      if (current_title.length > Main.config.players.max_track_title_display) {

        current_title = Variables.trim(current_title,  Main.config.players.max_track_title_display, true);

      }

      Player.set_track(current_title);

    },

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
     * The user will try to push a track on the server
     * @param  {object} selector the track element he clicked on
     * @return {void}
     */
    push_track_action: function(selector) {

      // First we disable the button from now
      is_disabled = selector.attr('disabled');

      /**
       * We protect the system
       * It's impossible to click twice when the user is pushing
       */
      if (is_disabled !== 'disabled') {

        selector.attr('disabled', '');

        // Get infos about the pusher
        user = Main.datas.get('user');

        // Get datas about the server
        server = Main.datas.get('server');

        // Get infos about the track
        id = selector.data('id');
        title = selector.data('title');
        picture = selector.data('picture');
        duration = selector.data('duration');

        $(selector).find(Track.$s.push_details).html('Pushing ...');

        media = {

          reference: id,
          title: title,
          picture: picture,
          duration: duration,

        };

        Queries.emit_socket('server.push_track', {server: server._id}, {media: media}, selector);

      }


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
    
  return Track;

});
