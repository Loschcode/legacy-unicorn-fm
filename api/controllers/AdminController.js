/**
 * AdminController
 *
 * @module      :: Controller
 * @description	:: It contains all the admin section
 *
 */

module.exports = {

  /**
   * Admin dashboard
   */
  dashboard: function(req, res) {

    res.view();

  },

  /**
   * Login view
   */
  login: function (req, res) {

    if (sessions.user_has_role(req, 'admin')) {

      res.redirect('/admin/dashboard');

    } else {
    
      res.view();  

    }

  },

  /**
   * Execute the login process
   */
  login_exec: function (req, res) {
    
    // Get values
    var password = req.param('password');

    // Check if the right password
    if (password == 'unicornrocks') {

      req.session.user = {};
      req.session.user.role = 'admin';

    } else {

      // Add session error
      req.session.error = 'Wrong password';

    }

    // Finaly must redirect to the login method
    res.redirect('/admin/login');

  },

  /**
   * Execute the logout process
   */
  logout_exec: function (req, res) {

    delete req.session.user;

    req.session.success = 'Disconnected';

    // Redirect
    res.redirect('/admin/login');

  },




  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to AdminController)
   */
  _config: {}

  
};
