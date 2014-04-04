/**
 * app.js
 *
 * This file contains some conventional defaults for working with Socket.io + Sails.
 * It is designed to get you up and running fast, but is by no means anything special.
 *
 * Feel free to change none, some, or ALL of this file to fit your needs!
 */


(function (io) {

  // as soon as this file is loaded, connect automatically, 
  var socket = io.connect();
  if (typeof console !== 'undefined') {
    log('Connecting to Sails.js...');
  }

  socket.on('connect', function socketConnected() {

    // Listen for Comet messages from Sails
    socket.on('message', function messageReceived(message) {

      ///////////////////////////////////////////////////////////
      // Replace the following with your own custom logic
      // to run when a new message arrives from the Sails.js
      // server.
      ///////////////////////////////////////////////////////////
      
      var player = message.player;
      player = player.split('https://www.youtube.com/watch?v=').join('');
      player = player.split('&feature=youtube_gdata_player').join('');

      player = '<iframe width="560" height="315" src="http://www.youtube.com/embed/' + player + '?autoplay=1" frameborder="0" allowfullscreen></iframe>';
      $('#current-track').html(player);

      //////////////////////////////////////////////////////

    });


    ///////////////////////////////////////////////////////////
    // Here's where you'll want to add any custom logic for
    // when the browser establishes its socket connection to 
    // the Sails.js server.
    ///////////////////////////////////////////////////////////
    log(
        'Socket is now connected and globally accessible as `socket`.\n' + 
        'e.g. to send a GET request to Sails, try \n' + 
        '`socket.get("/", function (response) ' +
        '{ console.log(response); })`'
    );
    ///////////////////////////////////////////////////////////


  });


  // Expose connected `socket` instance globally so that it's easy
  // to experiment with from the browser console while prototyping.
  window.socket = socket;


  // Simple log function to keep the example simple
  function log () {
    if (typeof console !== 'undefined') {
      console.log.apply(console, arguments);
    }
  }
  

})(

  // In case you're wrapping socket.io to prevent pollution of the global namespace,
  // you can replace `window.io` with your own `io` here:
  window.io

);


  var app = $.sammy('#main', function() {

    this.post('#/search', function() {

      // Get the track to search
      var track = $('#search-track').val();
      var max_results = 1;

      var query = 'https://gdata.youtube.com/feeds/api/videos?alt=@type&q=@search&max-results=@max-results';

      query = query.split('@type').join('json');
      query = query.split('@search').join(track);
      query = query.split('@max-results').join(max_results);

      $.get(query, function( data ) {

        var results = data.feed.entry;
        var output = '<table class="table"><tbody>';

        $.each(results, function(index, value) {
          
          var player = value.media$group.media$player[0].url;

          var number_list = index + 1;
          var title = value.media$group.media$title.$t;
          var picture = value.media$group.media$thumbnail[0].url;
          var description = value.media$group.media$description.$t;

          output += '<tr><td>' + title + ' <button id="push" data-title="' + title + '" data-player="' + player + '">Push</button></td></tr>';

        });

        output += '</tbody></table>';

        $('#results-search').html(output);

      });

    });

  });       
  
  $(document).on('click', 'button#push', function() {

    var title = $(this).data('title');
    var player = $(this).data('player');

    $.post('/push-track', {title: title, player: player}, function(datas) {
      console.log(datas);
    }); 
  });
        
  app.run();

