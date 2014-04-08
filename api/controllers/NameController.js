/**
 * NameController
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

  create: function(req, res) {

    // Find last name
    Name.find()
    .sort('createdAt desc')
    .limit(1)
    .exec(function(err, nameMongo) {

      // Init last name
      var lastName = false;

      // Found
      if (typeof nameMongo !== 'undefined') {
        lastName = nameMongo[0].name;
      } 

      res.view({lastName: lastName});

    });


  },

  createExec: function(req, res) {
    
    // Load some npm packages 
    var string = require('string');
    var extendsString = require('../helpers/extends_string.js');

    // Get the name
  	var name = req.param('name');

    // Security
    var name = name.toLowerCase();

    if (string(name).isEmpty()) {
      req.session.error = 'Name can\'t be empty';
      return res.redirect('/create-name');
    }

    // Check if the name not empty, and have only 1 word
  	if (extendsString.countWords(name) != 1) {
  		req.session.error = 'Name must contain only one word';
  		return res.redirect('/create-name');
  	}

    // Check if the name contains only letters
    if ( ! string(name).isAlpha()) {
      req.session.error = 'Name must contain only letters';
      return res.redirect('/create-name');
    }

    // Check if already exists in the database
    Name.findOne({
      name: name
    }).done(function(err, nameDatas) {


      if (typeof err === 'undefined') {

        // No records found, so we will add the name
        Name.create({

          name: name

        }).done(function(err, nameDatas) {


          if (err) {

            req.session.error = 'Unable to add this name right now, sorry !';

          } else {

            // Add session success
            req.session.success = 'Name ' + name + ' added !';
          }

          res.redirect('/create-name');

        });

      } else {
        req.session.error = 'This name already exists';

        res.redirect('/create-name');

      }


    });



  },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to NameController)
   */
  _config: {}

  
};
