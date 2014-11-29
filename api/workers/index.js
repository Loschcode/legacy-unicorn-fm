/**
 * We load all the services
 */

module.exports = function($s) {

	return {

		queries: require(__ROOT__ + '/api/workers/queries')($s),
		//systems: require(__ROOT__ + '/api/workers/systems')($s) -> NOTHING ELSE YET

	};

}