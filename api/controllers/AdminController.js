/**
 * AdminController
 *
 * @module      :: Controller
 * @description	:: It contains all the admin section
 *
 */

module.exports = {

  /**
   * Login view
   */
  login: function (req, res) {
    res.view();  
  },

  /**
   * Execute the login process
   */
  login_exec: function (req, res) {
    
    // Get values
    var password = req.param('password');
    var redirectTo = req.param('redirect-to');

    // Check if the right password
    if (password == 'unicornrocks') {

      // Ok, now you are logged as admin
      req.session.is_an_admin = true;

      // Check if exist redirect
      if (redirectTo.length > 0 && redirectTo !== 'undefined') {

        // Delete redirectTo session
        delete req.session.redirectTo;

        // Redirect user
        return res.redirect(redirectTo);

      } else {

        // No redirect, just display great msg 
        req.session.success = 'Logged as admin';

      }

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

    delete req.session.is_an_admin;

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
