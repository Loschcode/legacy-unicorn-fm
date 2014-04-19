define(function() {

	var routes = [

		['get', '', 'home', 'auto_focus'],
		['post', '#/search', 'search', 'run'],
		['post', '#/push/:id', 'track', 'push'],
		['get', '#/join', 'home', 'display_join_input'],
		['post', '#/try-join', 'home', 'redirect_join'],
		['get', '#/clear-results', 'search', 'clear_results']

	];

	return routes;

});