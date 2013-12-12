include 
	.load('sideBar.mask::Template') 
	.css('sidebarPane.css') //
	.js({
		control: 'objectInspector'
	})
	.js(
		'./bindingsView/bindingsView.js',
		'./compoView/compoView.js',
		'./resourceView/resourceView.js'
	)
	.done(function(resp){

		mask.registerHandler(':sideBar', Compo({
			template: resp.load.Template,

			onRenderStart: function(model, ctx, container){
				// ..
			},
			onRenderEnd: function(elements, model, ctx, container){
				// ..
			}
		}));


	});
