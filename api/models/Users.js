/**
 * Users
 *
 * @module      :: Model
 * @description :: It's all about the users
 */

// Data encryption lib
var bcrypt = require('bcrypt');

module.exports = {

  adapter: 'mongo',
  schema: true,

  attributes: {
  	
    /**
     * Nickname :
     * The user nickname
     */
  	nickname: {
  		type: 'string',
  		required: true
  	},

    /**
     * Encrypted_password :
     * The user encrypted password
     */
    encrypted_password: {
      type: 'string',
      required: true
    },

    /**
     * Email :
     * The user email
     */
    email: {
      type: 'string',
    },

    /**
     * Role :
     * The user role (e.g. 'superadmin', 'admin')
     */
    role: {
      type: 'string',
      required: true
    }

  },

  beforeCreate: function(values, next) {

      // We encrypt the password before creating the user
      bcrypt.hash(values.encrypted_password, 10, function(err, hash) {

        if (err) return next(err);

        values.encrypted_password = hash;
        next();

      });

    }

};
