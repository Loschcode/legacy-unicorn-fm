define({

	/**
	 * Config RequireJS
	 * 	- Everything about the config of RequireJS
	 */
	shim : {
		'core/dependencies/handlebars' : {
			exports: 'Handlebars'
		},

		'core/dependencies/jquery' : {
			exports: '$'
		}
	},

	hbs: {
		templateExtension: '.hbs'
	}

}); 

