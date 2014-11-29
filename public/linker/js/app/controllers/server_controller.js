/**
 * ServerController
 *
 * @module      :: ServerController
 * @description :: It contains everything about the server section 
 *
 */
define(['main', 'datas', 'queries', 'app/controllers/home_controller', 'app/controllers/player_controller'], function(Main, Datas, Queries, Home, Player)  {

  var Server = {

    /**
     *
     * VARIABLES
     * ********************************************************
     * We will define all the variables linked with the player here
     * ********************************************************
     * 
     */
    
    _tooltip_destroyed: true,
    sync_lag: 0,
    ignore_heartbeat_date: 0,

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

      current_users: '#people',
      server_name_input: '#server-name input',
      server_name: '#server-name',

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
     * We will set the ignore heartbeat date
     * @param  {integer} ms milliseconds
     */
    init_ignore_heartbeat: function(ms) {

      Server.ignore_heartbeat_date = new Date(new Date().getTime() + ms);

    },
    
    /**
     * Will set the sync colors depending on the lag
     * NOTE : When you're referent, it's set to blue but we don't pass through init_sync
     * We use directly set_sync(0, 0) because it's a special case
     */
    init_sync: function(lag) {

      // Lag can be negative so we manage it
      if (lag < 0) {

        lag -= lag*2;

      }

      sync_config = Main.config.servers.sync;

      if (lag <= sync_config.high) {

        Server.set_sync(1, lag);

      } else if (lag <= sync_config.medium) {

        Server.set_sync(2, lag);

      } else if (lag > sync_config.medium) {

        Server.set_sync(3, lag);

      }

      Server.sync_lag = Math.ceil(lag * 100) / 100;

    },
    
    /**
     * We init the server on the front-end
     * @param  {object} server 
     * @param  {boolean} watcher
     * @param {function} callback to execute the next intiializations when this is done
     * @return {void}
     */
    init_server: function(server, watcher, callback) {

      // We filter the datas we received and populate the header
      Datas.reset('server', server);
      Datas.reset('player', server.player);
      Datas.reset('media', server.player.media);
      Datas.reset('options', {watcher: watcher});

      // We initialize the casual socket listener
      require(['app/sockets'], function(Sockets) {

        Sockets.init_server_casual_socket();
        callback(); // We need a callback because we don't want the next functions to execute before we have sent the socket
        
      });

    },

    init_referent_data_sending: function() {

      // First we remove any existing loop in case this is called twice
      Server.init_remove_referent_data_sending();

      /**
       * The referent of the server will send data regularly for everyone to keep synchronized
       */
      Server.referent_position_interval = setInterval(function() {

        // The referent could be a non-watcher so we manage all the possible cases
        youtube_datas = Player.get_player_datas_from_anywhere();

        // We don't heartbeat if there's no good data
        if (youtube_datas.duration !== 0) {

          Queries.emit_socket('server.refresh_track_position', {}, {youtube_datas: youtube_datas});
          console.info('Socket : referent heartbeat (%s/%s)', youtube_datas.position, youtube_datas.duration);

        }

      }, Main.config.servers.referent_heartbeat);

    },

    init_remove_referent_data_sending: function() {

      if (typeof Server.referent_position_interval !== "undefined") {

        clearInterval(Server.referent_position_interval);

      }

    },

    /**
     * We initialize the media (header mainly)
     * @param  {object} media
     * @return {void}
     */
    init_media: function(media) {

      // We populate the media header
      Datas.reset('media', media);

    },

    /**
     * We will send a socket and try to be referent if we are a watcher
     * @return {void}
     */
    init_try_to_be_referent_if_watcher: function() {

      device = Datas.get('device', 'id');
      watcher = Datas.get('options', 'watcher');
      referent_watcher = Datas.get('referent', 'watcher');

      // If the user is watcher and the last referent isn't, let's ask for a new one
      if ((watcher == true) && (referent_watcher == false)) {

        Queries.emit_socket('server.ask_for_new_referent');

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
    
    get_is_ignore_heartbeat_active: function() {

      if (new Date() > Server.ignore_heartbeat_date) {

        return false;

      } else {

        return true;

      }

    },

    get_am_i_referent: function() {

      device_id = Datas.get('device', 'id');
      referent_id = Datas.get('referent', 'device');

      if (device_id === referent_id) {

        return true;

      } else {

        return false;

      }

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
    
    /**
     * Set the current users on the display
     */
    set_current_users: function(number) {

      $(Server.$s.current_users).html(number);

    },

    /**
     * Choose a sync color icon and put the lag (TODO with a tooltip)
     */
    set_sync: function(icon_number, lag) {

      // PERFECT (referent)
      if (icon_number === 0) {

        Server.sync_lag = 0; // Always 0 when we are referent
        $(Home.$s.sync_icon).removeClass('high').removeClass('medium').removeClass('low').addClass('perfect');

      // HIGH
      } else if (icon_number === 1) {

        $(Home.$s.sync_icon).removeClass('perfect').removeClass('medium').removeClass('low').addClass('high');

      // MEDIUM
      } else if (icon_number === 2) {

        $(Home.$s.sync_icon).removeClass('perfect').removeClass('high').removeClass('low').addClass('medium');

      // LOW
      } else if (icon_number === 3) {

        $(Home.$s.sync_icon).removeClass('perfect').removeClass('high').removeClass('medium').addClass('low');

      }

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
    before_action: function(action, params) {

      if (action == 'rename')
      {
        // Check if it's a watcher
        var owners = Main.datas.get('server', 'owners');
        var user_id = Main.datas.get('user', '_id');

        var found = $.inArray(user_id, owners);

        if (found == -1)
        {
          // You aren't an owner, you can't rename the server
          // Just fuck you.
          return false;
        }

        // Check if it's a mobile
        require(['mobile'], function(Mobile) {

          if ( ! Mobile.isMobile())
          {
            return true;
          }

          return false;

        });

      }

    },

    /**
     * Show tooltip with lag on mouse over
     */
    show_tooltip_lag_action: function() {

      Server._tooltip('show', Home.$s.sync_button, {title: Server.sync_lag + 's'});

    },

    /**
     * Rename
     *
     * @description :: We will rename the server
     *
     */
    rename_action: function(selector) {

      if (selector.find('input').length == 0)
      {
        // Set input
        selector.html('<input class="rename-server server-can-edit" type="text" name="" value="" />');

        // Autosize this input
        Server._autosize_input(Server.$s.server_name_input);

        // Give focus
        $(Server.$s.server_name_input).focus();

        Server._restrict_chars(Server.$s.server_name_input);

        // When a key down pushed
        $(Server.$s.server_name_input).keydown( function(event) {

          // <enter> pushed
          if (event.keyCode == 13)
          {
            // Unset focus
            $(Server.$s.server_name_input).blur();
          }

        });

        $(Server.$s.server_name).hover(function() {

          Server._tooltip('destroy', Server.$s.server_name);

        });

        $(Server.$s.server_name_input).focusout( function() {

          // Get the new name
          var new_name = $(this).val();
          
          // Get current name
          var current_name = Main.datas.get('server', 'name');

          // If new name empty or same of current name
          if (new_name == '' || new_name == current_name)
          {
            // Replace input
            selector.html(current_name);
          } 
          else
          {

            var validated = Server._validate_name(new_name, current_name);

            if (validated)
            {

              // Get the server id
              var server_id = Main.datas.get('server', '_id');

              // Post to send in the ajax method
              var post_datas = {
                rename: new_name
              };

              // Update rename
              $.post('/rename/' + server_id, post_datas, function(datas) {

                if (datas.success === true)
                {
                  var new_name = datas.server.name;
                  var new_raw_name = datas.server.raw_name;

                  // Update data of server datas
                  Main.datas.set('server', 'name', new_name);
                  Main.datas.set('server', 'raw_name', new_raw_name);
                  

                  // Change name
                  selector.html(new_name);
                }
                else
                {
                  Server._tooltip('show', Server.$s.server_name, {title: datas.error, title_reset_input: current_name});     
                }
              });
            }
          }
        });
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

    // WE DIDNT FIND OUT WHAT THESE MEANS BELOW

    _tooltip: function(action, selector_string, options) {

      require(['bootstrap'], function() {

        if (action == 'destroy')
        {
          if ( ! Server._tooltip_destroyed)
          {
            $(selector_string).tooltip(action);

            // Flag
            Server._tooltip_destroyed = true;

          }
        }

        if (action == 'show')
        {
          
          $(selector_string).tooltip({
              title: options.title,
              placement: 'bottom'
          });

          $(selector_string).tooltip('show');

          Server._tooltip_destroyed = false;


          setTimeout(function() {

            if ( ! Server._tooltip_destroyed)
            {
              $(selector_string).tooltip('destroy');
              Server._tooltip_destroyed = true;
            }

            if ( ! $(selector_string + ' input').is(':focus'))
            {
              $(selector_string).html(options.title_reset_input);
            }

          }, 2500);

        }

      });

    },

    /**
     * Validate name
     *
     * @description :: Check if name is valid
     *
     */
    _validate_name: function(name, current_name)
    {
      
      var max_chars = Main.config.servers.name_max_length;
      var min_chars = Main.config.servers.name_min_length;

      console.log(min_chars);
      console.log('name ' + name + ' : ' + name.length);

      // Check max length
      if (name.length > max_chars)
      {
        var title = 'The name cannot exceed %s characters in length'.split('%s').join(max_chars);

        Server._tooltip('show', Server.$s.server_name, {title: title, title_reset_input: current_name});

        return false;
      }

      // Check min length
      if (name.length < min_chars)
      {
        var title = 'The name must be at least %s characters in length'.split('%s').join(min_chars);

        Server._tooltip('show', Server.$s.server_name, {title: title, title_reset_input: current_name});

        return false;

      }

      return true;

    },

    /**
     * Autosize input
     *
     * @description :: Load plugin autosize_input on a selector
     *
     */
    _autosize_input: function(selector_string)
    {
        // Load autosize plugin and autosize
        require(['autosize_input'], function() {
          $(selector_string).autosizeInput();
        });

    },

    /**
     * Restrict chars
     *
     * @description :: Will avoid some chars of a selector
     *
     */
    _restrict_chars: function(selector_string)
    {
        // Restrict chars in the input
        require(['alphanum'], function() {
          $(selector_string).alphanum({
              allowSpace: false, // Allow the space character
              allowOtherCharSets: false,
              allow: '-',
              maxLength: Main.config.servers.name_max_length
          });
        });
    }

  }

  return Server;
});
