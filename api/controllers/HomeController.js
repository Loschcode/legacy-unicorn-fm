/**
 * HomeController
 *
 * @module      :: Controller
 * @description	:: It contains the homepage and these kind of static pages
 */

module.exports = {
  
  /**
   * Unicorn home page
   */
  index: function (req, res) {

    // Load view home and set title
    res.view({title: 'Unicorn'});
    
  },

  test: function (req, res) {

    Users.findOne({id: req.session.user.id}, function(err, user) {

      console.log(user);

    });

  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to HomeController)
   */
  _config: {}

  
};
