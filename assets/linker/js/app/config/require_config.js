define({
	shim : {
		'handlebars' : {
			exports: 'Handlebars'
		}
	},

	hbs: {
		templateExtension: '.hbs'
	},

	urlArgs: { 'bust': Date.now() }

}); 

