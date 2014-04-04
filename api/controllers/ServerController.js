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

    Track.create({

      title: req.param('title'),
      player: req.param('player')

    }).done(function (error, track) {

      if (error) {
        res.json({error: true, details: error});
      } else {

        var socket = req.socket;
        var io = sails.io;

        io.sockets.emit('message', track);

        res.json(track);
      }

    });

  },

  join: function (req, res) {
    
    var server_id = req.params.id;

    res.view();

  },

  create: function (req, res) {

    var randomString = require('random-string');
    var name = randomString({
      length: 4,
      numeric: false,
      letters: true,
      special: false
    });

    name = name.toLowerCase();

    var current_session = req.sessionID;

    // Check if name exists
    Server.findOne({
      name: name
    }).done(function(error, server) {

      if (error) {

        // Unable to create the server
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
            res.redirect('/join/' + server.id);
          }

        });


      }
    });

  }



  
};
