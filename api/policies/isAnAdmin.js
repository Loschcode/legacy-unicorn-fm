/**
 * isAnAdmin
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any admin user
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  if (req.session.isAnAdmin === true) {
    return next();
  }

  return res.redirect('/admin/login');

};
