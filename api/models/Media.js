/**
 * Track
 *
 * @module      :: Model
 * @description :: It's all about the server's tracks
 */

var $h = require(__ROOT__ + '/api/helpers');

module.exports = function(Mongo, validate) {

  var Media = new Mongo.Schema({

    /**
     * Youtube id of the song
     */
    reference: {

      type: String,
      required: true

    },

    /**
     * Picture HTTP link of the song
     */
    picture: {

      type: String,
      required: true

    },

    /**
     * Title of the song
     */
    title: {

      type: String,
      required: true

    },

    /**
     * Duration of the song
     */
    duration: {

      type: Number,
      required: true

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

  Media.pre('save', function(next) {
    this.updated_at = new Date();
    next();
  });

  return Mongo.model('Media', Media);

}