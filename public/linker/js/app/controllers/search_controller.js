/**
 * SearchController
 *
 * @module      :: Controller
 * @description :: Everything about the youtube search
 *
 */
define(['main', 'dates'], function(Main, Dates)  {

  var Search = {

    /**
     *
     * VARIABLES
     * ********************************************************
     * We will define all the variables linked with the player here
     * ********************************************************
     * 
     */
    
    // Youtube API URL
    url_search: 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=@search&key=@key&orderBy=@order-by&maxResults=@max-results',
    // url_search: 'https://gdata.youtube.com/feeds/api/videos?alt=@type&q=@search&max-results=@max-results&orderBy=@order-by',

    // Last search results number
    last_research_number_results: 0,

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

      search_input: '#search-track',
      results: '#results-search',
      clear_results: '#clear-results',


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
    
    init_search: function() {

      $(Search.$s.search_input).removeClass('hidden');
      $(Search.$s.search_input).focus();

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
     *
     * @description :: Called at first when we run an action from the controller
     *
     */
    before_action: function() {

      // Delayed event to catch click on the clear results button
      $(document).on('click', '#clear-results', function() {

        Search.mechanism_clear_results();

      });

    },

    /**
     * Fetch results
     *
     * @description :: Will perform a request and display results (or not)
     *
     */
    fetch_results_action: function() {

      // Get the track to search
      var track = $(Search.$s.search_input).val();
      track = $.trim(track);

      // We encode the track for URLs
      track = encodeURIComponent(track);

      if (track.length > 0) {

        $(Search.$s.clear_results).show();
        
        // Add loading
        $(Search.$s.results).html('<div class="text-center search-loader"><i class="fa fa-cog fa-spin fa-5x"></i></div>');

        // Prepare url to get
        var query = Search.mechanism_prepare_query_action(track);

        $.get(query, function( datas ) {

          // Check if we have some results
          if (typeof datas.items[0] === "undefined") {

            Search.mechanism_display_no_results();

          } else  {

            Search.mechanism_display_results(datas.items);

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
    
    /**
     * Prepare query action
     *
     * @description :: Take the youtube url and parse with the right values
     *
     */
    mechanism_prepare_query_action: function(search) {

      // Get url 
      var query = Search.url_search;

      // Transform
      query = query.split('@type').join('json');
      query = query.split('@search').join(search);
      query = query.split('@key').join(Main.config.searches.youtube_api_key);
      query = query.split('@max-results').join(Main.config.searches.max_results);
      query = query.split('@order-by').join('viewCount');

      // Done, just return the query parsed
      return query; 

    },

    fetch_track_detail: function(video_id, callback) {

      api_call = "https://www.googleapis.com/youtube/v3/videos?id="+video_id+"&part=contentDetails&key="+Main.config.searches.youtube_api_key;
      
      $.get(api_call, function(datas) {

        callback(datas);

      });

    },

    /**
     * Display results
     *
     * @description :: Really, you wants a description for Search ? Fuck you !
     *
     */
    mechanism_display_results: function(datas) {

      self = this;

      last_research_number_results = 0;

      require(['moment'], function() {

        // Clear results
        $(Search.$s.results).html('');

          // Antipush system
          // We will check if the user will can push musics found
          
          /*var disabled = false;

          if (Main.antipush.get_state() == 'cant_push')
          {
            var disabled = true;
          }*/
          
        // Load template
        require(['hbs!app/views/search/results_search'], function(template) {

          var number_list = 0;

          Search.last_research_number_results = 0;

          $.each(datas, function(index, value) {

            number_list = number_list+1;

            // ID
            var id = value.id.videoId;

            self.fetch_track_detail(id, function(feedback) {

              // Duration
              var duration = Dates.convert_weird_time_format(feedback.items[0].contentDetails.duration);

              // Picture
              var picture = value.snippet.thumbnails.medium.url;

              // Category
              var category = 'music'

              // Title
              var title = value.snippet.title;

              // Transform seconds into hh:mm:ss format
              var readable_duration = Dates.format(duration);

              var view_datas = {

                title: title,
                number_list: number_list,
                picture: picture,
                duration: duration,
                readable_duration: readable_duration,
                category: category,
                id: id,
                //disabled: disabled

              };

              // Inject into the template
              var view = template(view_datas);
              $(Search.$s.results).append(view);
              Search.last_research_number_results++;

            });

          });

          // In case there's no result (even tho we found some result it's possible they are not music so we won't display them)
          if (Search.last_research_number_results === 0) {

            Search.mechanism_display_no_results();

          }
          
          $(Search.$s.clear_results).removeClass('hidden').addClass('visible');

          /*if (disabled) {

              Main.antipush.back_to_push_state();

          }*/


        });

      });

    },

    /**
     * Display no results
     *
     * @description :: No tracks found, so we will display an "error"
     *
     */
    mechanism_display_no_results: function() {

      $(Search.$s.results).html('<div class="no-result">Snap ! No result.<br /><i class="fa fa-thumbs-o-down fa-5x"></i></div>');

    },

    /**
     * Clear results
     *
     * @description :: Will clear tracks found
     *
     */
    mechanism_clear_results: function() {

      $(Search.$s.results).html('');
      $(Search.$s.clear_results).removeClass('visible').addClass('hidden');

      $(Search.$s.search_input).val('');
      $(Search.$s.search_input).focus();


    }

  }

  return Search;
});
