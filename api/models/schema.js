/**
 * Track
 *
 * @module      :: Model
 * @description :: It's all about the server's tracks
 */

module.exports = function(Mongo, validate) {

  var Schema = new Mongo.Schema({
    
    any: {

      type: Object,
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

  Track.pre('save', function(next) {
    this.updated_at = new Date();
    next();
  });

  return Mongo.model('Schema', Schema);

}