/**
 * Users
 *
 * @module      :: Model
 * @description :: It's all about the users
 */

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
      required: true
    },

    /**
     * Role :
     * The user role (e.g. 'superadmin', 'admin')
     */
    role: {
      type: 'string',
      required: true
    }

  }


};
