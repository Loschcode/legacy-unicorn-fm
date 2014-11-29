/**
 * Schema Controller
 *
 * @module      :: Schema
 * @description :: Basic schema every controller must respect
 *
 */
define(['main'], function(Main)  {

  var Name = {

    /**
     *
     * VARIABLES
     * ********************************************************
     * We will define all the variables linked with the player here
     * ********************************************************
     * 
     */
    
    $s: {


    },

    /**
     *
     * ELEMENTS
     * ********************************************************
     * We will define all the elements linked with the player
     * within the controller to avoid repetition
     * ********************************************************
     * 
     */
    
    // Nothing

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
    
    // Nothing
    
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
    
    // Nothing

    /**
     * MECHANISMS
     * ********************************************************
     * Here we will put all the method that can't go else where
     * They're often part of the other methods to make them tinyers
     * These methods are "mechanisms" it means they're between initializing, setting
     * And getting things ; for example, an interval that will work
     * through the page is a mechanism.
     * 
     * NOTE : Mechanisms shouldn't be called from another controller, use another method for it
     * 
     * ********************************************************
     */
    
    // Nothing
    
    }

    return Name;

});
