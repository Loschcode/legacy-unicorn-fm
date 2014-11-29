/**
 * Servers
 *
 * @module      :: Model
 * @description :: It's all about the music servers
 */

var $h = require(__ROOT__ + '/api/helpers');

module.exports = function(Mongo, validate) {

  var Server = new Mongo.Schema({
    
      /**
       * Name :
       * The server name (can be changed as the time flies)
       */
    	name: {

    		type: String,
        validate: validate({

          validator: 'isLength',
          arguments: [$h.configs.servers.name_min_length, $h.configs.servers.name_max_length],
          message: 'Server name has incorrect size'

        }),

        //validate('len', config.servers.name_min_length, config.servers.name_max_length),
    		required: true

    	},

      /**
       * Raw name
       * The server name which is processed by our system
       */
      raw_name: {

        type: String,
        required: true

      },

      /**
       * Type
       * The server type public|private
       */
      type: {

        type: String,
        required: true,
        enum: ['public', 'protected', 'private']

      },

      /**
       * Player :
       * It's all about the player of the server
       */  
      player : {

         /**
          * Status :
          * The player status (play|pause|stop)
          */
          status: {

          type: String,
          required: true

          },

         /**
          * Volume :
          * The player volume (0..100)
          */
          volume: {

          type: Number,
          required: true

          },

         /**
          * Mute :
          * Did we mute the player ?
          */
          mute: {

          type: Boolean,
          required: true

          },

          /**
           * A replicate of the media (equivalent to the last chronicle)
           */
          media: {

            type: Mongo.Schema.ObjectId,
            ref: 'Media'

          },

          /**
           * Last known position in the music
           * NOTE : Before to ask referent where to go we will systematically reset it here
           */
          last_known_position: {

            type: Number,
            required: false

          },

      },

      /**
       * Referent object
       */
      referent: {

         /**
          * Id
          * User id (won't be used but exist to be used someday)
          */
          user: {

            type: Mongo.Schema.ObjectId,
            ref: 'User'

          },

         /**
          * Device
          * On which device is the referent
          */
          device: {

            type: String,
            required: false

          },

         /**
          * Watcher
          * Is the referent a watcher ? Very important for the referent quality of his replies
          */
          watcher: {

            type: Boolean,
            required: false

          },

      },

      /**
       * DEPENDENCIES
       */

      /**
       * Online Users :
       * The number of user connected to the server
       */
      current_users: [{

        type: Mongo.Schema.ObjectId,
        ref: 'User'

      }],

      /**
       * Owner :
       * The owner id which can be changed if you pass the server to someone else
       */
      owners: [{

        type: Mongo.Schema.ObjectId,
        ref: 'User'

      }],
      
      chronicles: [{

        type: Mongo.Schema.ObjectId,
        ref: 'Chronicle'

      }],

      tracks: [{

        type: Mongo.Schema.ObjectId,
        ref: 'Track'

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

  Server.pre('save', function(next) {
    this.updated_at = new Date();
    next();
  });

  return Mongo.model('Server', Server);

}

