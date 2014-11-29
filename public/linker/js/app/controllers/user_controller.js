/**
 * UserController
 *
 * @module      :: Controller
 * @description :: It contains all the user section (subscribe/login)
 *
 */
define(['main', 'datas', 'app/controllers/player_controller'], function(Main, Datas, Player)  {

  var User = {


    /**
     *
     * VARIABLES
     * ********************************************************
     * We will define all the variables linked with the player here
     * ********************************************************
     * 
     */
    
    // Nothing

    /**
     *
     * ELEMENTS
     * ********************************************************
     * We will define all the elements linked with the player
     * within the controller to avoid repetition
     * ********************************************************
     * 
     */
    
    $s: {


    },

    /**
     *
     * INITS
     * ********************************************************
     * Here we will put all the method used to init big systems
     * such as the player or part of it etc.
     * When the user change something for example
     * ********************************************************
     * 
     */
    
    /**
     * We initialize the user datas (header)
     * @param  {object}   user
     * @param  {function} callback
     * @return {void} 
     */
    init_user: function(user, callback) {

      // We filter the datas we received and populate the header
      Datas.reset('user', user);

      // We initialize the casual socket listener
      require(['app/sockets'], function(Sockets) {

        Sockets.init_user_casual_socket();
        callback();
        
      });

    },
    
    /**
     * 
     * GETS
     * ********************************************************
     * Here we will put all the method used to get the datas
     * ********************************************************
     * 
     */
    
    // Nothing
    
    /**
     * 
     * SETS
     * ********************************************************
     * Here we will put all the method used to set the elements
     * datas, or mechanisms
     * ********************************************************
     * 
     */
    
    // Nothing

    /**
     * ACTIONS
     * ********************************************************
     * Here we will put all the method that will be called when the user use an element
     * It's directly controlled through the routes
     * ********************************************************
     */
    
    /**
     * BeforeAction
     *
     * @description :: Called at first when we run an action from the controller
     *
     */
    before_action: function(controller, action, params) {
      
    },

  }

  return User;
});
