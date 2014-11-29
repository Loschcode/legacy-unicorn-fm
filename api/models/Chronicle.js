/**
 * Chronicle
 *
 * @module      :: Model
 * @description :: It's all about the server's chronicles
 */

var $h = require(__ROOT__ + '/api/helpers');

module.exports = function(Mongo, validate) {

  var Chronicle = new Mongo.Schema({

    /**
     * Media of the chronicle
     */
    media: {

      type: Mongo.Schema.ObjectId,
      ref: 'Media'

    },

    /**
     * DEPENDENCIES
     */
    
    /**
     * The user which pushed originally
     */
    user: {

      type: Mongo.Schema.ObjectId,
      ref: 'User'

    },

    /**
     * The user where it was pushed
     */
    server : {

      type: Mongo.Schema.ObjectId,
      ref: 'Server' 

    },

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

  Chronicle.pre('save', function(next) {
    this.updated_at = new Date();
    next();
  });

  return Mongo.model('Chronicle', Chronicle);

}
