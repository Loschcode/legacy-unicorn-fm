define(function()  {

  var Youtube = {

    url_search: 'https://gdata.youtube.com/feeds/api/videos?alt=@type&q=@search&max-results=@max-results',
    max_results_search: 20,

    init: function() {

    },

    search_action: function() {

      // Get the track to search
      var track = $('#search-track').val();

      // Perform query
      query = this.url_search;
      query = query.split('@type').join('json');
      query = query.split('@search').join(track);
      query = query.split('@max-results').join(this.max_results_search);

      console.log(query);

    },

  }

  return Youtube;
});
