/**
 * is_an_admin
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any admin user
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  if (req.session.user.role === 'admin') {

    return next();
    
  }

  return res.redirect('/admin/login');

};
