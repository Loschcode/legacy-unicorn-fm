/**
 * Logs system
 *
 * @module      :: Helper
 * @description	:: Here we will put all the methods linked to the log system
 */

require('date-utils');

const winston = require('winston');

var $h = require(__ROOT__ + '/api/helpers');

/**
 * Custom settings
 */
var custom = {

    levels: {

        silly: 0,
        verbose: 1,
        info: 2,
        success: 2,
        data: 3,
        socket: 3,
        warn: 4,
        debug: 5,
        error: 6

    },

    colors: {

        silly: 'yellow',
        verbose: 'cyan',
        info: 'cyan',
        success: 'blue',
        data: 'grey',
        socket: 'green',
        warn: 'magenta',
        debug: 'yellow',
        error: 'red',
    }

};

if ($h.configs.about.mode === "dead") {

    custom_level = "error";

} else {

    custom_level = "silly";

}

/**
 * We start the logs system
 */
var logs = new (winston.Logger)({

	transports: [

    new (winston.transports.File)({

        name: 'file#error',
        level: 'error',
        json: false,
        filename: 'logs/error.log'

    }),

    new (winston.transports.File)({

        name: 'file#warn',
        level: 'warn',
        json: false,
        filename: 'logs/warning.log'

    }),

    new (winston.transports.File)({

        filename: 'logs/app.log', 
        json: false,
        colorize: false

    }),

    new (winston.transports.Console)({

    	colorize: true,
        json: false,
        level: custom_level,
        
        timestamp: function() {

            return new Date().toFormat('HH:MI:SS'); // Using date-utils

        },

    })

    ],

    levels: custom.levels

});

/**
 * We apply the colors
 */
winston.addColors(custom.colors);

/**
 * We extend some methods
 * Depending on the Unicorn mode
 * It will be more or less verbose
 */
logs.object = function(object) {

    if ($h.configs.about.mode === "annoying") {

        $h.logs.data('---------');
        $h.logs.data('{');
        console.log(object);
        $h.logs.data('}');
        $h.logs.data('---------');

    } else if ($h.configs.about.mode === "verbose") {

        if ($h.variables.exists(object._id)) {

            id = object._id;

        } else if ($h.variables.exists(object.id)) {

            id = object.id;

        } else {

            id = 'unknown';

        }

        $h.logs.data('on `'+id+'`');

    }

    return true;

}

/**
 * Export
 */
module.exports = logs;