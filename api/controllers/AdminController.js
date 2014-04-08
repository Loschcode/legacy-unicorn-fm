/**
 * AdminController
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
    
  

  login: function (req, res) {
    res.view();  
  },

  loginExec: function (req, res) {
    
    // Get values
    var password = req.param('password');
    var redirectTo = req.param('redirect-to');

    // Check if the right password
    if (password === 'unicornrocks') {

      // Ok, now you are logged as admin
      req.session.isAnAdmin = true;

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

  logout: function (req, res) {

    delete req.session.isAnAdmin;

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
