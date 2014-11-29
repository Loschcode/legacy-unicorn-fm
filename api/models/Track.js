/**
 * Track
 *
 * @module      :: Model
 * @description :: It's all about the server's tracks
 */

var $h = require(__ROOT__ + '/api/helpers');

module.exports = function(Mongo, validate) {

  var Track = new Mongo.Schema({
    
    /**
     * Media of the track
     */
    media: {

      type: Mongo.Schema.ObjectId,
      ref: 'Media'

    },

    /**
     * Number of play of this track
     */
    hits: {

      type: Number,
      default: 0

    },

    /**
     * DEPENDENCIES
     */
    
    users: [{

      type: Mongo.Schema.ObjectId,
      ref: 'User'

    }],

    server: {

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

  Track.pre('save', function(next) {
    this.updated_at = new Date();
    next();
  });

  return Mongo.model('Track', Track);

}