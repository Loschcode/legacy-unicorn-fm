/**
 * ServerController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
  
  pushTrack: function(req, res) {

    var server = req.param('server');
    var track = {title: req.param('title'), player: req.param('player'), server: server}

    var socket = req.socket;
    var io = sails.io;

    io.sockets.emit('message', track);

    res.json(track);

  },

  join: function (req, res) {
    
    // Get the server name to join
    var server_name = req.params.name;

    // Security, because findOne() isn't sensitive
    server_name = server_name.toLowerCase();

    // Check if the server exists
    Server.findOne({
      name: server_name
    }).done(function(error, server) {

      // Error query or no result match !
      if (error || typeof error == 'undefined') {

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

  create: function (req, res) {

    // Find before pretty name if never tried (into the database)
    if (req.session.alreadyTryFindName !== true) {

      // Find all
      Name.find().done(function(err, nameMongo) {

        // Count nb records found
        var countNames = nameMongo.length;

        if (countNames > 0) {

          // Random find 
          var name = nameMongo[Math.floor(Math.random() * countNames)].name;

          // We will use this name
          req.session.useName = name;

        } else {

          // No name found, so we can't use ...
          req.session.useName = false;
        }

        // Tell to the system : Hey dude i tried to find a pretty name
        req.session.alreadyTryFindName = true;

        // Redirect to this method
        // to continue the script
        res.redirect('/create');

      });

    } else {

      // We already try to find a pretty name for this server

      // We init a name var (In effect, it's really helpful to know this ...)
      var name = '';

      // Check if we found a pretty name to use
      if (req.session.useName === false) {

        // No ? Ok we will generate a random string
        var string = require('../helpers/extends_string.js');

        name = string.randomReadable(4);
        name = name.toLowerCase();

      } else {

        // Yes we found a pretty name
        var name = req.session.useName;

      }

      // We used the name or not, but we must do this
      // to avoid end-less loop
      req.session.useName = false;

      // Get the current session of the user
      var current_session = req.sessionID;

      // Check if name exists
      Server.findOne({
        name: name
      }).done(function(error, server) {

        if (typeof server !== 'undefined') {

          // Server already created
          // So we auto redirect the user in this
          // method, to re-try create server
          res.redirect('/create');

        } else {
          
          // We will create the server
          Server.create({
            name: name,
            owner: current_session

          }).done(function(error, server) {

            if (error) {

              res.send('Error : Problem when we created the server');
              
            } else {

              // Delete some sessions
              delete req.session.useName;
              delete req.session.alreadyTryFindName;

              // Auto join the server created
              res.redirect('/join/' + server.name);
            }

          });


        }
      });

    }

  }



  
};
