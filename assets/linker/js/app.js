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
      var server = message.server;
      var joinServer = $('#join-datas').data('server');

      if (server == joinServer) {

        var owner = $('#join-datas').data('owner');

        if (owner == true) {

          var player = message.player;
          player = player.split('https://www.youtube.com/watch?v=').join('');
          player = player.split('&feature=youtube_gdata_player').join('');

          player = '<iframe width="560" height="315" src="http://www.youtube.com/embed/' + player + '?autoplay=1" frameborder="0" allowfullscreen></iframe>';
          
          $('#player').html(player);

        }

        var title = message.title;

        $('#current-track').html(title);

        // Send notification
        alertify.log(title);
        
      }

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
      var max_results = 20;

      var query = 'https://gdata.youtube.com/feeds/api/videos?alt=@type&q=@search&max-results=@max-results';

      query = query.split('@type').join('json');
      query = query.split('@search').join(track);
      query = query.split('@max-results').join(max_results);

      $.get(query, function( data ) {

        // Clear results search
        $('#results-search').html('');

        // Hide button to clear results
        $(this).addClass('hidden');

        // Add loading
        $('#results-search').html('<i class="fa fa-repeat fa-spin fa-3x"></i>');

        var results = data.feed.entry;
        var output = '';

        // Have we got results from this search ?
        if (results.length > 0) {

          // Hide loader
          $('#results-search').html('');

          // Add button to clear results (nested search button)
          $('#clear-results').removeClass('hidden');

          // Loop all results
          $.each(results, function(index, value) {
            
            var player = value.media$group.media$player[0].url;

            var durationSeconds = value.media$group.yt$duration.seconds;

            // multiplied  by 1000 because Date() requires miliseconds
            var date = new Date(durationSeconds * 1000);
            var mm = date.getUTCMinutes();
            var ss = date.getSeconds();
            if (mm < 10) {mm = "0"+mm;}
            if (ss < 10) {ss = "0"+ss;}

            var duration = mm + ':' + ss;

            var number_list = index + 1;
            var title = value.media$group.media$title.$t;
            var picture = value.media$group.media$thumbnail[0].url;
            var description = value.media$group.media$description.$t;

            output += '<div class="entry">';
            output += '<div class="pull-left"><span class="title">' + number_list + '. ' + title + '</span> <span class="duration">' + duration + '</span></div>';
            output += '<div class="pull-right"><button id="push" data-title="' + title + '" data-player="' + player + '" class="btn btn-black"><i class="fa fa-cloud-upload"></i> Push</button></div>';
            output += '</div>';

            output += '<div class="clear"></div><hr>';

          });
          
          $('#results-search').html(output);

        } else {

          $('#results-search').html('<strong>Ooops, no results dude !</strong>');

        }


      });

    });

    this.get('#/join', function() {
      $('#join-link').removeClass('show').addClass('hidden');
      $('#join-form').removeClass('hidden').addClass('show');
      $('#join-name').focus();
    });

    this.post('#/try-join', function() {

      // Get value of the input text
      var name = $('#join-name').val();

      // If not empty
      if (name != '') {
        location.href='join/' + name;
      }

    });

  });       
  
  $(document).on('click', '#clear-results', function() {

    // Clear results search
    $('#results-search').html('');

    // Hide button to clear results
    $(this).addClass('hidden');

    // Clear search
    $('#search-track').val('');

    // Give focus
    $('#search-track').focus();

  });

  $(document).on('click', 'button#push', function() {

    var title = $(this).data('title');
    var player = $(this).data('player');
    var server = $('#join-datas').data('server');

    selector = $(this);

    selector.html('Pushing ...');

    $.post('/push-track', {title: title, player: player, server: server}, function(datas) {
      selector.html('Pushed !');
      setTimeout(function() {
        selector.html('<i class="fa fa-cloud-upload"></i> Push');
      }, 2000);

    }); 
  });


  app.run();

