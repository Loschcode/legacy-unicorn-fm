/**
 * Player Controller
 *
 * @module      :: Controller
 * @description :: Everything linked with the player
 *
 */
define(['main', 'datas', 'queries', 'element', 'tubeplayer', 'jqueryui', 'app/controllers/home_controller'], function(Main, Datas, Queries, Element, Tubeplayer, Jqueryui, Home)  {

  var Player = {

    /**
     *
     * VARIABLES
     * ********************************************************
     * We will define all the variables linked with the player here
     * ********************************************************
     * 
     */
    
    tubeplayer_loaded: false,
    tubeplayer_is_fullscreen: false,
    last_buffering_time: 0,
    last_buffering_start: 0,

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

      player: '#player-unicorn', // The unicorn player itself
      player_position: '#duration', // The duration progress bar within the player
      player_volume: '#volume', // The volume progress bar within the player
      player_thumbnail: '#thumb',

      player_fullscreen_button: '#fullscreen-icon', // The fullscreen button on the player
      player_watch_button: '#watch.player-button', // The "PLAYER" button on the top
      youtube: '#player', // The tubeplayer div which contains the youtube display

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
     * When it starts to buffer
     */
    init_buffering: function() {

      this.last_buffering_start = Date.now();
      Player.set_buffering_display();

    },

    /**
     * When it stops to buffer
     */
    init_stop_buffering: function() {

      this.last_buffering_time = Date.now() - this.last_buffering_start;

      Player.set_clear_buffering_display();

    },
    
    /**
     * Refresh the header and init the playing system
     * @return {void}
     */
    init_play: function() {

      require(['app/controllers/server_controller'], function(Server) {

        // We check the end of the track (we seek to 0 and play)
        duration = Datas.get('media', 'duration');
        position = Math.ceil($(Player.$s.player_position).slider('value') + Server.sync_lag);

        console.log('%s/%s', position, duration);

        if (position >= duration) {

          // We fake a "push"
          Player.init_force_play(Player.get_player_datas_from_anywhere());

        } else {

          // We resume the read
          Datas.set('player', 'status', 'play');
          $(Player.$s.youtube).tubeplayer('play');
          Player.set_play();
          Player.set_resume_play_position();

        }


      });

    },

    /**
     * Refresh the header and init the pausing system
     * @return {void}
     */
    init_pause: function() {

      Datas.set('player', 'status', 'pause');

      Player.set_pause();
      $(Player.$s.youtube).tubeplayer('pause');

      // We stop the progress bar
      Player.set_stop_player_position();

    },

    /**
     * Refresh the header and init the stopping system
     * @return {void}
     */
    init_stop: function() {

      Datas.set('player', 'status', 'stop');

      Player.set_pause();
      $(Player.$s.youtube).tubeplayer('stop');

      // We stop the progress bar
      Player.set_stop_player_position(0);

    },

    /**
     * Refresh the header and init the muting system
     * @return {void}
     */
    init_mute: function() {

      Datas.set('player', 'mute', true);

      $(Player.$s.youtube).tubeplayer('mute');

      // We don't forget to "artificially" set the volume to 0
      Player.set_volume(0);

    },

    /**
     * Refresh the header and init the unmuting system
     * @return {void}
     */
    init_unmute: function() {

      Datas.set('player', 'mute', false);

      $(Player.$s.youtube).tubeplayer('unmute');

      // We don't forget to "artificially" set the volume to the previous volume
      Player.set_volume(Datas.get('player', 'volume'));

    },

    /**
     * Refresh the header and init the volume system
     * @return {void}
     */
    init_volume: function(volume) {

      // We refresh the header datas and we set it on the player
      Datas.set('player', 'volume', volume);

      Player.set_volume(volume);

    },
    
    /**
     * We init the player (will be called everytime the user change his mode as watcher/non-watcher)
     * @return {void}
     */
    init_player: function() {

      require(['app/controllers/server_controller'], function(Server) {

        // We first get some datas about the server
        var options = Datas.get('options');

        // Let's init everyone depending on their positions (watcher/non-watcher)  
        if (options.watcher === false) {

          Player.init_non_watcher_player();

        } else {

          Player.init_watcher_player();

        }

      });

    },

    /**
     * We init the player elements depending on the Datas we got
     */
    init_player_elements: function() {

      /**
       * It's all about the VOLUME
       */
      player = Datas.get('player');
      Player.set_volume(player.volume);

      /**
       * It's all about the mute
       */
      if (player.mute === true) {

        Player.init_mute();

      } else {

        Player.init_unmute();

      }

      /**
       * It's all about the MUSIC status
       */
      if (player.status == 'play') {

        Player.set_play();

      } else if (player.status == 'pause') {

        Player.set_pause();

      } else if (player.status == 'stop') {

        Player.set_stop(); // The same than pause

      }

    },

    /**
     * Init the watcher button on the top
     * @return {void}
     */
    init_watcher: function() {

      var watcher = Datas.get('options', 'watcher');

        if (watcher == true) {

          $(Player.$s.player_watch_button).removeClass('unselected').addClass('selected');

        }

    },

    /**
     * When a new media is pushed, we usually force everyone to play it automatically
     * @param {object} media the media details
     * @return {void}
     */
    init_force_play: function(media) {

      // We set the current media on the player
      Player.init_current_track();

      // We reset the position and duration
      duration = Datas.get('media', 'duration');
      Player.init_position(0, duration);
      
      options = Datas.get('options');

      // If it's a watcher we play effectively the media
      if (options.watcher === true) {

        // We change the youtube video (only if we are a watcher)
        $(Player.$s.youtube).tubeplayer('play', media.reference);

      }

      // We init the play now
      Player.init_play();

    },

    /**
     * This will be called when you join a server only (not called when you change the music for example)
     */
    init_current_track_on_join: function() {

      /**
       * Let's get the last known position and set it back
       */
      position = Datas.get('player', 'last_known_position');
      duration = Datas.get('media', 'duration');

      Player.init_position(position, duration);
      Player.init_current_track();

      /**
       * We will also ask to the referent the current "real" position, not the last known
       * While everything is initialized
       */
      Queries.emit_socket('player.ask_for_track_position_on_join');

    },

    /**
     * Init the current track on the player and set the picture
     * @return {void}
     */
    init_current_track: function() {

      // Fetch current track
      var track = Datas.get('media', 'title');
      var picture = Datas.get('media', 'picture');

      if (track === false) {

        track = 'No current track';

      }

      require(['app/controllers/track_controller'], function(Track) {

        Track.set_title_track(track, false);

      });

      Player.init_thumbnail_picture();

    },

    /**
     * Init the thumbnail picture from the Youtube video
     */
    init_thumbnail_picture: function() {

      // Fetch current picture for the track
      var picture = Datas.get('media', 'picture');

      if (picture !== false) {

          Player.set_picture(picture);

      }

    },

    /**
     * Set the "position" in the music (need the total duration)
     * @param  {integer} position for the progress bar
     * @param  {integer} duration total time to set the progress bar
     * @return {void} 
     */
    init_position: function(position, duration) {

      if (typeof duration == "undefined") {

        // If there's no duration it means we should refresh tubeplayer as well (WARNING : could be extended to everything, but we need to check the code for that)
        Datas.set('player', 'last_known_position', position);
        Player.set_position(position);

        Player.set_resume_play_position(position);

      } else {

        $(Player.$s.player_position).slider({

          range: "min",
          value: position,
          min: 0,
          max: duration

        });

      }

    },

    /**
     * Init the Youtube (tube)player and set all the listeners
     * @return {void}
     */
    init_youtube_player: function() {

      $(Player.$s.youtube).tubeplayer({

        //width: 600, // the width of the player
        //height: 450, // the height of the player

        allowFullScreen: "false", // true by default, allow user to go full screen
        initialVideo: "", // the video that is loaded into the player
        preferredQuality: "default",// preferred quality: default, small, medium, large, hd720
        showControls: 0, // Show play / pause / etc.
        modestbranding: false,

        onPlayerUnstarted: function() { Player.onPlayerUnstarted() },
        onPlayerCued: function() { Player.onPlayerCued() },
        onPlayerPlaying: function() { Player.onPlayerPlaying() },
        onPlayerBuffering: function() { Player.onPlayerBuffering() },
        onPlayerPaused: function() { Player.onPlayerPaused() },
        onPlayerEnded: function() { Player.onPlayerEnded() },
        onErrorNotFound: function() { Player.onErrorNotFound() },

        onPlay: function() { Player.onPlay() }, // after the play method is called
        onPause: function() { Player.onPause() }, // after the pause method is called
        onStop: function() { Player.onStop() }, // after the player is stopped
        onSeek: function(time) { Player.onSeek() }, // after the video has been seeked to a defined point
        onMute: function() { Player.onMute() }, // after the player is muted
        onUnMute: function() { Player.onUnMute() } // after the player is unmuted

      });

    },

    /**
     * Init the non watcher player
     * @return {void}
     */
    init_non_watcher_player: function() {

      //
      // We hide the youtube player and hide the fullscreen button
      //
      $(Player.$s.youtube).addClass('hidden');
      $(Player.$s.player_fullscreen_button).hide();

      // We also stop the player and clearly destroy the element
      $(Player.$s.youtube).tubeplayer('stop');
      $(Player.$s.youtube).tubeplayer('destroy');

      // We stop the possible intervals
      Player.mechanism_position_autostop();

      // We set the player as a non-watcher
      Player.set_player(false);

      console.log('non watcher init');

      // Referent case
      require(['app/controllers/server_controller'], function(Server) {

        if (Server.get_am_i_referent()) {

          console.log('im referent');

          Queries.emit_socket('server.ask_for_new_referent');

        }

      });

    },

    /**
     * Init the watch player
     * @return {void}
     */
    init_watcher_player: function() {

      // 
      // We remove the youtube player hidden attributes and show the fullscreen button
      // Then we init the player
      // 
      $(Player.$s.youtube).removeClass('hidden');
      $(Player.$s.player_fullscreen_button).show();

      // We stop the possible intervals
      Player.mechanism_position_autostop();

      Player.init_youtube_player();

      // And we init the fullscreen system once and the player elements
      Player.init_fullscreen_system();

      // We launch the video if this one is a watcher
      Player.set_player(true);

      // Referent case
      require(['app/controllers/server_controller'], function(Server) {
        
        Server.init_try_to_be_referent_if_watcher();

      });

    },

    /**
     * Init the fullscreen system (called for everyone while loading the page)
     * @return {void}
     */
    init_fullscreen_system: function() {

      // The on click listener is here because the fullscreen doesn't reply correctly when we use our routing system
      $(Player.$s.player_fullscreen_button).click(function() {

        // We change the size
        $(document).find(Player.$s.youtube).find('iframe').css('width', '100%').css('height', '100%');
        $(document).find(Player.$s.youtube).find('object').css('width', '100%').css('height', '100%');

        // Will be useful to catch the click with Youtube (tube)player
        Player.tubeplayer_is_fullscreen = true;

        var real_player = document.getElementById("player");

        // We try to make the fullscreen through the browser
        if (real_player.requestFullscreen) {

          real_player.requestFullscreen();

        } else if (real_player.msRequestFullscreen) {

          real_player.msRequestFullscreen();

        } else if (real_player.mozRequestFullScreen) {

          real_player.mozRequestFullScreen();

        } else if (real_player.webkitRequestFullscreen) {

          real_player.webkitRequestFullscreen();

        }

        // There were a bug (white display instead of fullscreen mode) ; this seems to get around it for no reason.
        $(document).find(Player.$s.youtube).find('[id=^tubeplayer-player-container]').css('width', '100%').css('height', '100%');

      });

      document.addEventListener("fullscreenchange", function () {

        Player.tubeplayer_is_fullscreen = false;


      }, false);

      document.addEventListener("mozfullscreenchange", function () {

        Player.tubeplayer_is_fullscreen = false;

      }, false);

      document.addEventListener("webkitfullscreenchange", function () {

        if (document.webkitIsFullScreen === false) {

          Player.tubeplayer_is_fullscreen = false;
          
          $(document).find(Player.$s.youtube).find('iframe').css('width', '0%').css('height', '0%');
          $(document).find(Player.$s.youtube).find('object').css('width', '0%').css('height', '0%');

        }

      }, false);

    },

    /**
     * Will init the player position and set the correct intervals
     */
    init_player_position: function(watcher, from_itself, youtube_datas) {

        /**
         * We will init the interval and the position depending on the progress bar datas
         * If from_itself is false, it will use the "youtube_datas" argument to set everything
         */
        if (from_itself === true) {

          youtube_datas = Player.get_player_datas_from_header();

          position = youtube_datas.position;
          duration = youtube_datas.duration;
          reference = youtube_datas.reference;

        } else {

          position = youtube_datas.position;
          duration = youtube_datas.duration;
          reference = youtube_datas.reference;

        }

        // We round the position to avoid any bug at the end of the track etc.
        position = Math.ceil(position);

        // If it's a watcher, we will play the video (and switch to the correct status), and initialize the progress bar
        if (watcher === true) {

          // If we are at the end, we directly put at 0
          if (position >= duration) {

            tubeplayer_position = 0;

          } else {

            tubeplayer_position = position;

          }

          // We manage the possible lag with our system
          tubeplayer_position = Player.get_position_with_lag(tubeplayer_position);

          // Here we launch FOR REAL the track after someone switcher and went to the page
          $(Player.$s.youtube).tubeplayer('play', {id: reference, time: tubeplayer_position});

          // We also set the status of the video from the header
          status = Datas.get('player', 'status');
          $(Player.$s.youtube).tubeplayer(status);

          Player.mechanism_position_automove_watcher(position);

        // If it's not a watcher, we just move the progress bar
        } else {

          Player.mechanism_position_automove_nonwatcher(position);

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
    
    /**
     * Get the position and add the probable lag rate (from configs)
     * NOTE : For now it stays simple but we will build a whole lag system depending on the users after
     * 
     * @param  {integer} original_position
     * @return {integer}
     */
    get_position_with_lag: function(original_position) {

      default_lag = Main.config.servers.lag;

      position_with_lag = original_position + default_lag;

      return position_with_lag;

    },
    
    /**
     * Used in the referent socket send
     * Will get the player datas from what we got (watcher or non watcher)
     */
    get_player_datas_from_anywhere: function() {

      watcher = Datas.get('options', 'watcher');
      server = Datas.get('server');

      /**
       * We get the data depending on being a watcher or not
       */
      if (watcher) {

        youtube_datas = Player.get_player_datas_from_tubeplayer();

        // Protection in case it fails -> BETA -> Not sure if good idea to force success here
        if (youtube_datas.duration === 0) {

          youtube_datas = Player.get_player_datas_from_header();

        }

      } else {

        youtube_datas = Player.get_player_datas_from_header();

      }

      return youtube_datas;

    },
    
    /**
     * Get the needed Youtube datas from Tubeplayer itself
     * @return {object}
     */
    get_player_datas_from_tubeplayer: function() {

      tubeplayer_datas = $(Player.$s.youtube).tubeplayer("data");

      // If tubeplayer video is loaded, we retrieve data from it
      if (Element.exists(tubeplayer_datas)) {

        if (typeof tubeplayer_datas.currentTime !== 'undefined') {

          return {

            reference: tubeplayer_datas.videoID,
            position: tubeplayer_datas.currentTime,
            duration: tubeplayer_datas.duration,

          };

        }

      }

      // If there's an error (tubeplayer isn't loaded or position is 0), we output some default datas
      return {

        reference: null,
        position: 0,
        duration: 0

      }

    },
    
    /**
     * Get the needed Youtube datas from the header
     * @return {object}
     */
    get_player_datas_from_header: function() {
      
      media = Datas.get('media');
      player = Datas.get('player');

      /**
       * If the progress bar is already set, we don't get
       * From the last known position but directly from the progress bar
       * (because it's way more accurate)
       */
      if (Player.get_player_position() > 0) {

        player.last_known_position = Player.get_player_position();

      } else if (typeof player.last_known_position !== "number") {

        player.last_known_position = 0;

      }

      return {

        reference: media.reference,
        position: player.last_known_position,
        duration: media.duration,

      };

    },

    /**
     * Get the volume from the player itself
     * @return {mixed} obj/bool
     */
    get_player_volume: function() {

      if (Element.exists($(Player.$s.player_volume).slider('value'))) {

        return $(Player.$s.player_volume).slider('value');

      } else {

        return false;

      }

    },

    /**
     * Get the position from the player itself
     * @return {mixed} obj/bool
     */
    get_player_position: function() {

      if (Element.exists($(Player.$s.player_position).slider('value'))) {

        return $(Player.$s.player_position).slider('value');

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
     * Set the player depending on being a watcher or not
     * Can be called at any moment to change the watcher/non-watcher status
     * 
     * NOTE : This method will launch effectively the track and buffer it, etc.
     *        Also, when we call it, all the casual elements are already set (progressbar position, buttons, etc.)
     * 
     * @param {boolean} watcher set the player for watcher or non-watcher
     * @return {void}
     */
    set_player: function(watcher) {

      // If we are not watcher
      if (watcher === false) {

        /**
         * Launch the watcher mechanism
         */
         Player.mechanism_player_after_non_watcher_ready()
         Player.tubeplayer_loaded = false;

       }

      // If we are watcher (NOTE : Can be loaded before the function, it will be loaded when tubeplayer is loaded, but finally it's quite the same time)
      $.tubeplayer.defaults.afterReady = function($element) {

        /**
         * Launch the watcher mechanism
         */
         Player.mechanism_player_after_watcher_ready();
         Player.tubeplayer_loaded = true;

       }

    },

    /**
     * Restart the player position and engage the interval mechanism
     * In case you don't know the old position it guess it from the progress bar actual position
     * @param {integer} position
     */
    set_resume_play_position: function(position) {

      watcher = Datas.get('options', 'watcher');

      if (watcher) {

        Player.mechanism_position_automove_watcher();

      } else {

        if (typeof position == "undefined") {

          position = $(Player.$s.player_position).slider('value');

        }

        // We get the duration and check if it's the end to put it to 0 if needed
        duration = Datas.get('media', 'duration');

        if (position >= duration) {

          position = 0;

        }

        Player.mechanism_position_automove_nonwatcher(position);

      }

    },

    /**
     * We stop the progress bar ; works we both watchers / non watchers 
     * Depending on the intervals in case
     * NOTE : In some cases like "stop" action (look in sockets) you would want to put a position
     * for the progress bar to stop (0 in this case), that's why i added 'position' as possible argument
     * @param {integer} position the position you want to put the progress bar (optional)
     */
    set_stop_player_position: function(position) {

      if (typeof position != "undefined") {

        $(Player.$s.player_position).slider('value', Math.ceil(position));

      }

      Player.mechanism_position_autostop();

    },

    /**
     * Set the track title to display on the player
     * @param {string} title of the track
     */
    set_track: function(title) {

      $(Player.$s.player).find('#track').html(title);

    },

    /**
     * Set the thumbnail to display on the player
     * @param {string} url_picture the url of the image
     */
    set_picture: function(url_picture) {

      $(Player.$s.player).find('#thumb').find('#buffer').html('<img src="' + url_picture + '"></img>');

    },

    /**
     * Set the player as "playing" (button)
     */
    set_play: function() {

      $(Player.$s.player).find('#player-control').html('<a id="player-pause"><i class="fa fa-pause"></i></a>');

    },

    /**
     * Set the player as "pausing" (button)
     */
    set_pause: function() {

      $(Player.$s.player).find('#player-control').html('<a id="player-play"><i class="fa fa-play"></i></a>');

    },

    /**
     * Set the player as "stopping" (button)
     */
    set_stop: function() {

      Player.set_pause();

    },

    /**
     * Set the volume on Youtube (tube)player and change the progress bar and the icon on the left
     * @param {integer} volume the new volume to set
     */
    set_volume: function(volume) {

      $(Player.$s.youtube).tubeplayer('volume', volume);
      $(Player.$s.player_volume).slider('value', volume);
      Player.set_icon_volume(volume);

    },

    /**
     * Set the position on Youtube (tube)player and change the progress bar
     * @param {integer} volume the new volume to set
     */
    set_position: function(position) {

      $(Player.$s.youtube).tubeplayer('seek', position);
      $(Player.$s.player_position).slider('value', position);

    },

    /**
     * Set the volume icon depending on the volume
     * @param {integer} volume the volume to catch
     */
    set_icon_volume: function(volume) {

      var icon = '';

      if (volume <= 30) {
        icon = '<i class="fa fa-volume-down"></i>';
      }

      if (volume === 0) {
        icon = '<i class="fa fa-volume-off"></i>';
      }

      if (volume > 30) {
        icon = '<i class="fa fa-volume-up"></i>';
      }
     
      $(Player.$s.player).find('#volume-icon').html(icon);

    },

    /**
     * Set the buffering display on the player thumbnail
     */
    set_buffering_display: function() {

      $(Player.$s.player_thumbnail).find('#buffer').addClass("buffering-black");
      $(Player.$s.player_thumbnail).find('#loader').html('<div class="text-center buffering-loader"><i class="fa fa-cog fa-spin fa-3x"></i></div>');

    },

    /**
     * Clear the buffering display on the player thumbnail
     */
    set_clear_buffering_display: function() {

      $(Player.$s.player_thumbnail).find('#buffer').removeClass("buffering-black");
      $(Player.$s.player_thumbnail).find('#loader').html('');

    },

    /**
     * TUBEPLAYER EVENTS HANDLING
     * ********************************************************
     * This is a special area where listeners for the Youtube (Tube)player when activated
     * ********************************************************
     */

    // When the player has cued a video
    onPlayerCued: function() {

    },

    // When the player is playing (with or without tubeplayer methods)
    onPlayerPlaying: function() {

      Player.init_stop_buffering();

      if (Player.tubeplayer_is_fullscreen) {

        // If we try to control from the fullscreen mode, it will emulate a play click
        this.play_action();

      }

    },

    // When the player is buffering
    onPlayerBuffering: function() {

      Player.init_buffering();

    },

    onPlayerUnstarted: function() {

      Player.init_stop_buffering();

    },

    // When the player is paused (with or without tubeplayer methods)
    onPlayerPaused: function() {

      Player.init_stop_buffering();

      if (Player.tubeplayer_is_fullscreen) {

        // If we try to control from the fullscreen mode, it will emulate a pause click
        this.pause_action();

      }

    },
      
    // When the player has ended the music
    onPlayerEnded: function() {

    },

    // When the player couldn't find the music
    onErrorNotFound: function() {

    },

    // When tubeplayer play the music
    onPlay: function() {

    },

    // When tubeplayer pause the music
    onPause: function() {

    },

    // When tubeplayer stop the music
    onStop: function() {

    },

    onSeek: function(time) {

    },

    // When tubeplayer mute the music
    onMute: function() {

    },

    // When tubeplayer unmute the music
    onUnMute: function() {

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
     * Called first when we run an action from the controller
     *
     */
  	before_action: function() {

      /**
       * Ignore heart-beat :
       * When we perform an action, we absolutely must avoid heat-beat conflict
       * For example we click on play at the end of the track, if there's a heart-beat right after it'll blow up the progress bar
       * So we need a security time.
       */
      require(['app/controllers/server_controller'], function(Server) {

        Server.init_ignore_heartbeat(2000);

      });

  	},

    /**
     * When the user click on the "PLAYER" on the top
     * Changes depends on the css class showed and this will set the user as watcher or not
     * @param  {object} selector
     * @return {void}
     */
    watch_action: function(selector) {

      if ($(Player.$s.youtube).length > 0 && $(Player.$s.youtube).css('display') == 'none') {

        //
        // Here we will manage the new watcher
        //

        Datas.set('options', 'watcher', true);

        // We don't forget to change the model as well (say to our model that we are watcher)
        Queries.emit_socket('user.update_model_watcher', {}, {watcher: true});

        $(Player.$s.player_watch_button).removeClass('unselected').addClass('selected');

        Player.init_watcher_player();

      } else {

        //
        // Here we will manage the new non-watcher
        //
  
        Datas.set('options', 'watcher', false);

        // We don't forget to change the model as well (say to our model that we aren't watcher)
        Queries.emit_socket('user.update_model_watcher', {}, {watcher: false});

        $(Player.$s.player_watch_button).removeClass('selected').addClass('unselected');

        Player.init_non_watcher_player();

      }

    },

    /**
     * When the user click on the play button
     * We change the button to 'pause'
     * We emit a socket to tell everyone the track has started
     * @return {void}
     */
    play_action: function() {

      Queries.emit_socket('player.change', {server: Datas.get('server', '_id')}, {action: 'play'}); // {server: Player.Server});

    },

    /**
     * When the user click on the pause button
     * We change the button the 'play'
     * We emit a socket to tell everyone the track has paused
     * @return {void}
     */
    pause_action: function() {

      Queries.emit_socket('player.change', {server: Datas.get('server', '_id')}, {action: 'pause'});

    },

    /**
     * When the user click on the stop button
     * We emit a socket to tell everyone the track has stopped
     * @return {void}
     */
    stop_action: function() {

      Queries.emit_socket('player.change', {server: Datas.get('server', '_id')}, {action: 'stop'});

    },

    pre_position_action: function() {

      // We stop immediately the intervals to avoid the progress bar to go CrAaaAzyYYy
      Player.mechanism_position_autostop();

    },

    position_action: function() {

      position = Player.get_player_position();

      Queries.emit_socket('player.change', {server: Datas.get('server', '_id')}, {action: 'position', position: position });

    },

    /**
     * When the user click on the mute button
     * We emit a socket to tell everyone the track has muted the music
     * @return {void}
     */
    mute_or_unmute_action: function() {

      // Current state of mute
      mute = Datas.get('player', 'mute');

      if (mute) {

        // If it's already muted, we will unmute it
        Queries.emit_socket('player.change', {server: Datas.get('server', '_id')}, {action: 'unmute'});

      } else {

        // It's not muted, let's mute it
        Queries.emit_socket('player.change', {server: Datas.get('server', '_id')}, {action: 'mute'});

      }

    },

    /**
     * When the user click on the volume progress bar
     * We emit a socket to tell everyone the volume track has changed
     * @return {void}
     */
    volume_action: function(selector) {

      volume = Player.get_player_volume();

      Queries.emit_socket('player.change', {server: Datas.get('server', '_id')}, {action: 'volume', volume: volume});

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

    mechanism_player_after_non_watcher_ready: function() {

      // We init the player elements (needs nothing but it's better to be sync with the watcher similar function)
      Player.init_player_elements();

      // We init the intervals (from itself, there will be a socket call after)
      Player.init_player_position(false, true);

      /**
       * We init the research after everything is ready (otherwise there will some big conflicts)
       * Some other things can be added here if you want to enable things after everything is ready
       */
      Home.init_system_ready_elements();

    },

    /**
     * Mechanism mainly used in set_player() method ; set the player when it's ready
     * (happens when entering the server and when changing the watcher/nonwatcher status)
     * @return {void}
     */
    mechanism_player_after_watcher_ready: function() {

      // We init the player elements (needs tubeplayer to be loaded)
      Player.init_player_elements();

      // We init the intervals (from itself, there will be a socket call after)
      Player.init_player_position(true, true);

      /**
       * We init the research after everything is ready (otherwise there will some big conflicts)
       * Some other things can be added here if you want to enable things after everything is ready
       */
      Home.init_system_ready_elements();

    },

    /**
     * Mechanism which's used to move the position progress bar (for non-watcher, guessing and checking with sockets)
     * It removes the possible old intervals and make new one
     * @param  {integer} position the default position before moving
     * @return {void} 
     */
    mechanism_position_automove_nonwatcher: function(position) {

      // First we clear the old interval
      Player.mechanism_position_autostop();

      // A small security in case the system is on pause
      // In this case we won't launch the loop for nothing
      status = Datas.get('player', 'status');

      if ((status === 'pause') || (status === 'stop')) {

        return;

      }

      /**
       * This interval work from itself, it doesn't ask external datas
       * And guess the positions (to avoid intempestive socket calls)
       * Everything is already set from above (we will receive referent heart-beat regularly to adjust)
       */
      Player.position_interval = setInterval(function() {

        position = position + 0.5;
        $(Player.$s.player_position).slider('value', position);

        Player.mechanism_check_track_end(position);

      }, 500); // Why 400 ? This is weird but the true rate on youtube isn't second per second so we adjust a little (if it doesn't go fater enough we should put 500 again)


    },

    /**
     * Mechanism which's used to move the position progress bar (for watcher, checking with the Youtube (tube)player)
     * It removes the possible old intervals and make new one
     * @return {void}
     */
    mechanism_position_automove_watcher: function() {

      // First we clear the old interval
      Player.mechanism_position_autostop();

      // A small security in case the system is on pause
      // In this case we won't launch the loop for nothing
      status = Datas.get('player', 'status');

      if ((status === 'pause') || (status === 'stop')) {

        return;

      }

      /**
       * This interval will get the Youtube (tube)player datas and refresh
       * The progress bar every 0.5s with the datas (it doesn't call any socket)
       */
      Player.position_interval = setInterval(function() {

        position = Player.get_player_datas_from_tubeplayer().position;
        $(Player.$s.player_position).slider('value', position);

        Player.mechanism_check_track_end(position);

      }, 500);

    },

    /**
     * Stop the move of the position slider
     * (music duration from user that don't have the video or simply the second interval)
     * @return {void}
     */
    mechanism_position_autostop: function() {

      if (typeof Player.position_interval_refresh != "undefined") {

        clearInterval(Player.position_interval_refresh);

      }

      if (typeof Player.position_interval != "undefined") {
        
        clearInterval(Player.position_interval);

      }

    },

    /**
     * We check the track end from the progress bar (because it's universal, even if we aren't watcher)
     * It will change the play/pause handler
     * @param  {integer} position
     * @return {void}
     */
    mechanism_check_track_end: function(position) {

      duration = Datas.get('media', 'duration');

      // We round up the number because the check can fail otherwise
      rounded_position = Math.ceil(position);

      //console.log(rounded_position + '/' + duration);

      // The track has ended, we cut the loop and set the player to play it again
      if (rounded_position >= duration) {

        // We make sure the position of the progress bar is at the very end (sometimes there's a small gap)
        $(Player.$s.player_position).slider('value', rounded_position);

        Player.init_pause();
        Player.mechanism_position_autostop();

      }

    },

  }

  return Player;
  
});
