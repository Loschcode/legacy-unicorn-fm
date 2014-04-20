/**
 * setAnonymous
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */

module.exports = function(req, res, next) {

  // If the user is already in session
  if (req.session.user) {

  		// We go to the next policies
  	   return next();

  	} else {

  		/**
  		 * 
  		 * Let's create a new anonymous user
  		 * 
  		 */
      
  		Users.create({

  			nickname: 'Anonymous' + dates.uniqid_from_time(),
  			encrypted_password: 'anonymous',
  			email: '',
  			role: 'anonymous'

  		}).done(function(error, user) {

  			if (error) {

  				res.forbidden('Error : Problem when creating your anonymous session');

  			} else {

              req.session.user = user;

              return next();

          }

      });

  	}

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
 
};
