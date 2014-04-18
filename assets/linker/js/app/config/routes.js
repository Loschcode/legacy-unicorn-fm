define(function() {

	var routes = [

		['post', '#/search', 'search', 'run'],
		['post', '#/push/:id', 'track', 'push'],
		['get', '#/join', 'home', 'display_join_input'],
		['post', '#/try-join', 'home', 'redirect_join']

	];

	return routes;

});