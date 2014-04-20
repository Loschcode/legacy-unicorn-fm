/**
 * Servers
 *
 * @module      :: Model
 * @description :: It's all about the music servers
 */

module.exports = {

  adapter: 'mongo',
  schema: true,

  attributes: {
  	
    /**
     * Name :
     * The server name (can be changed as the time flies)
     */
  	name: {
  		type: 'string',
  		required: true
  	},

    /**
     * Owner :
     * The owner id which can be changed if you pass the server to someone else
     */
    owner: {
      type: 'string',
      required: true
    },
    
    /**
     * Options :
     * The server options (empty yet)
     */
    options: {
    }, 

    /**
     * Tracks :
     * Here we manage all the tracks playlists we'll got
     */
    tracks: {

      // Track Id
      id: {

      type: 'integer',
      required: true

      },

      // Media object (e.g. Youtube datas)
      media: {

      type: 'json',
      required: true

      },

      // Provider Id (any user)
      provider: {

      type: 'integer',
      required: true

      }

    },

    /**
     * Chronicles :
     * The historical system for each server
     */
    chronicles: {

      // Chronicle Id
      id: {

      type: 'integer',
      required: true

      },

      // Media object (e.g. Youtube datas)
      media: {

      type: 'json',
      required: true

      },

      // Provider Id (any user)
      provider: {

      type: 'integer',
      required: true

      },

      // The datetime where it was pushed
      push: {

      type: 'datetime',
      required: true

      }

    }


  }

};
