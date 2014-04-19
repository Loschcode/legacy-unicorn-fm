define(function()  {

  var Search = {

    url_search: 'https://gdata.youtube.com/feeds/api/videos?alt=@type&q=@search&max-results=@max-results&orderBy=@order-by',
    max_results_search: 20,

    init: function() {
      
      $(document).on('click', '#clear-results', function() {

        Search.clear_results_action();

      });

    },

    run_action: function() {

      // Add loading
      $('#results-search').html('<div class="text-center"><i class="fa fa-repeat fa-spin fa-3x"></i></div>');

      // Get the track to search
      var track = $('#search-track').val();

      // Prepare url to get
      var query = this.prepare_query_action(track);

      $.get(query, function( datas ) {

        // Check if we have some results
        if (typeof datas.feed.entry == 'undefined') {

          Search.display_no_results();

        } else {

          Search.display_results(datas.feed.entry);

        }

      });


    },

    prepare_query_action: function(search) {

      // Get url 
      var query = this.url_search;

      // Transform
      query = query.split('@type').join('json');
      query = query.split('@search').join(search);
      query = query.split('@max-results').join(this.max_results_search);
      query = query.split('@order-by').join('viewCount');

      console.log(query);

      // Done, just return the query
      return query;

    },

    display_results: function(datas) {

      // Clear results
      $('#results-search').html('');

      // Load template
      require(['hbs!../app/views/search/results_search'], function(template) {

        var number_list = 0;

        $.each(datas, function(index, value) {

          number_list = number_list+1;

          var player = value.media$group.media$player[0].url;

          var duration = value.media$group.yt$duration.seconds;

          // Transform seconds into hh:mm:ss format
          var date = new Date(duration * 1000);
          var hh = date.getUTCHours();
          var mm = date.getUTCMinutes();
          var ss = date.getSeconds();
          if (hh < 10) hh = '0' + hh
          if (mm < 10) mm = '0' + mm
          if (ss < 10) ss = '0' + ss

          if (hh == '00') {

            duration = mm + ':' + ss;

          } else {

            duration = hh + ':' + mm + ':' + ss;

          }

          // Init value view datas
          var view_datas = {};

          // Fill view datas
          view_datas.name = value.media$group.media$title.$t;
          view_datas.number_list = number_list;
          view_datas.picture = value.media$group.media$thumbnail[0].url;
          view_datas.duration = duration;
          view_datas.player = player;

          // Inject into the template
          var view = template(view_datas);

          $('#results-search').append(view);

        });

        $('#clear-results').removeClass('hidden').addClass('visible');

      });

    },

    display_no_results: function() {

      $('#results-search').html('<div class="notice notice-red no-results">Snap ! No results dude</div>');

    },

    clear_results_action: function() {

      $('#results-search').html('');
      $('#clear-results').removeClass('visible').addClass('hidden');

    }

  }

  return Search;
});
