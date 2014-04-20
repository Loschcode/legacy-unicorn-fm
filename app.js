// Services
require('../services/require.js');

// Start sails and pass it command line arguments
require('sails').lift(require('optimist').argv);
