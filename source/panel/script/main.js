
include
	.routes({
		compos: '/panel/compos/{0}/{1}.js',
		control: '/panel/control/{0}/{1}.js'
	})
	.cfg('lockedToFolder', true)
	.js(
		'/src/utils/fn.js',
		'/src/utils/obj.js',
		
		'/lib/debugger.js',
		
		'./Page.js::Page',
		'./App.js',
		'./backgroundConnection.js'
	)
	
	.js({
		compos: ['splitView', 'elementsView', 'sideBar']
	})
	.ready(function(resp){
		
		window.doSearch = function(action, query){
			return app.compos.elementsView.search(action, query);
		};
		
		
		///initialize(resp['debugger']);
		
		window.DebugSource = resp['debugger'];
		
		App.build();
	});
