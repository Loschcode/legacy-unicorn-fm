/**
 * ServerController
 *
 * @module      :: Controller
 * @description	:: It contains all the server listener/creation/pushing system
 */

module.exports = {
  
  /**
   * Push a track to the server
   */
  push_track: function(req, res) {

    // Get track pushed
    var track = {name: req.param('name'), player: req.param('player'), server: req.param('server')}

    // Init socket.io
    var socket = req.socket;
    var io = sails.io;

    // Now we will send a push to all devices
    // Ex : 'baba-track-pushed'
    io.sockets.emit('track-pushed', track);

    // Return the object to the front
    res.json(track);

  },

  /**
   * Join a server
   */
  join: function (req, res) {

    // Get the server name to join
    var server_name = req.params.name;

    // Security, because findOne() isn't sensitive
    server_name = server_name.toLowerCase();

    // Check if the server exists
    Servers.findOne({
      name: server_name
    }).done(function(error, server) {

      // Error query or no result match !
      if (!variables.exists(error)) {

        // Create session
        req.session.errorMsg = 'Unable to join this server';

        // Redirect to index
        res.redirect('/#/join');

      } else {
        
        // Check if the user it's the owner of the server
        if (req.sessionID == server.owner) {
          var owner = true;
        } else {
          var owner = false;
        }

        res.view({owner: owner, server: server_name, title: 'Unicorn'});

      }

    });


  },

  /**
   * Create a server
   */
  create: function (req, res) {

      // We generate a name
      var name = '';
      name = strings.random_readable(4);
      name = name.toLowerCase();

      // Get the current session of the user
      var current_session = req.sessionID;

      // Check if name exists
      Servers.findOne({

        name: name

      }).done(function(error, server) {

        if (typeof server !== 'undefined') {

          // Server already created
          // So we auto redirect the user in this
          // method, to re-try create server
          res.redirect('/create');

        } else {
          
          // We will create the server
          Servers.create({

            name: name,
            owner: current_session

          }).done(function(error, server) {

            if (error) {

              res.send('Error : Problem when we created the server');
              
            } else {


              // Auto join the server created
              res.redirect('/join/' + server.name);
            }

          });


        }
      });


  }



  
};
