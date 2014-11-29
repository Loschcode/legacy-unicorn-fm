/**
 * App Controller
 *
 * @module      :: Controller
 * @description	:: It will go to the application
 */

module.exports = {
  
  /**
   * Application page
   */
  app: function(req, res) {

    /**
     * We launch our services
     */
    var $h = require(__ROOT__ + '/api/helpers');
    var $s = require(__ROOT__ + '/api/services')(req, res);
    var $w = require(__ROOT__ + '/api/workers')($s);

    /**
     * We initialize socket (it's the core of all the applicaiton here)
     */

      var sockets = require(__ROOT__ + '/api/services/sockets')(req.sockets); 
      sockets.init($s, $w);

    /**
     * We will generate a unique id for this device
     * This is the only thing we setup before we open the page
     * Because it will be used in every socket callback/listeners afterwards
     */
    device_id = $h.formats.set_device_id();

    // Memory for sockets
    $s.memories.set('device', {id: device_id});

  	/**
  	 * We render the application through the view
  	 */
  	res.render('index', { title: 'Unicorn', device: {id: device_id} });

  },

  /**
   * Configs
   * Will be loaded at first through AJAX from the front-end
   */
  configs: function(req, res) {

    /**
     * We launch our services
     */
    var $h = require(__ROOT__ + '/api/helpers');

    res.json($h.configs);

  }

}