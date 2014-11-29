/**
 * Users
 *
 * @module      :: Model
 * @description :: It's all about the users
 */

var $h = require(__ROOT__ + '/api/helpers');

module.exports = function(Mongo, validate) {

  var User = new Mongo.Schema({

    /**
     * Nickname :
     * The user nickname
     */
    nickname: {

      type: String,
      validate: validate({

          validator: 'isLength',
          arguments: [$h.configs.users.nickname_min_length, $h.configs.users.nickname_max_length],
          message: 'Nickname has incorrect size'

        }),

      required: true

    },

    /**
     * Raw Nickname :
     * The user raw nickname
     */
    raw_nickname: {

      type: String,
      required: true

    },

    /**
     * Encrypted password :
     * The user password (encrypted)
     */
    encrypted_password: {

      type: String,
      min: 4,
      required: true

    },

    /**
     * Email :
     * The user email
     */
    email: {

      type: String,
      required: false

    },

    /**
     * Role :
     * The user role (e.g. 'superadmin', 'admin')
     */
    role: {

      type: String,
      required: true

    },

    /**
     * Last setup the user have made (such as watcher or not, which isn't shared with others)
     */
    setup: {

      /**
       * Was the user watcher at the last change ?
       */
      watcher: {

        type: Boolean,
        required: true

      },

    },

    /**
     * DEPENDENCIES
     */
    
    /**
     * The servers that this user owns
     */
    owned_servers : [{

      type: Mongo.Schema.ObjectId,
      ref: 'Server' 

    }],

    /**
     * The servers where the user is right now
     */
    current_servers: [{

      type: Mongo.Schema.ObjectId,
      ref: 'Server' 

    }],

    /**
     * CreatedAt
     */
    created_at: { 

      type: Date,
      default: Date.now
      
    },

    /**
     * UpdatedAt
     */
    updated_at: { 

      type: Date,
      default: Date.now
      
    }

  });

  User.pre('save', function(next) {
    this.updated_at = new Date();
    next();
  });

  return Mongo.model('User', User);

}

