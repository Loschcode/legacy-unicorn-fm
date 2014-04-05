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

    /*
    var randomString = require('random-string');
    var name = randomString({
      length: 4,
      numeric: false,
      letters: true,
      special: false
    });
    */

    var string = require('../helpers/string.js');

    name = string.randomReadable(4);
    console.log(name);
    name = name.toLowerCase();

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

            // Auto join the server created
            res.redirect('/join/' + server.name);
          }

        });


      }
    });

  }



  
};
