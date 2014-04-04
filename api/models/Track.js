/**
 * Track
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  adapter: 'mongo',
  schema: true,

  attributes: {
  	
  	/* e.g.
  	nickname: 'string'
  	*/
  	title: {
  		type: 'string',
  		required: true
  	},

  	player: {
  		type: 'string',
  		required: true
  	}

  }

};
