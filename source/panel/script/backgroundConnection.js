include
	.use('Page')
	.done(function(resp, Page){
	
		window.__connection = chrome.runtime.connect();
		
		window.__connection
			.onMessage
			.addListener(function(args) {
				
				console.log('.>>bg on message', JSON.stringify(args));
				
				var mix = args[0],
					type
					;
				
				if ('number' === typeof mix) 
					return Page.resolve.apply(Page, args);
				
				
				if ('string' === typeof mix) {
					args.shift();
					
					
					if (mix in Actions) 
						return Actions[mix].apply(null, args);
					
					
					if (mix === 'content-script-message') {
						
						type = args.shift();
						
						
						switch(type){
							case 'async-complete':
								Page.resolve.apply(Page, args);
								return;
							case 'compo-tree-changed':
								var array = args.shift();
								Compo
									.pipe('elements')
									.emit('treeModified', array)
									;
								return;
						}
					}
				}
				
				
				
				
				console.warn('<Invalid Message>', mix, type, args);
			});
		
		
		
		var Actions = {
			inspect: function(){
				function code_getCompoId(){
							
					var compo = $(__atmaDebugger.getActiveElement()).compo();
					
					return compo == null
						? -1
						: compo.ID
						;
				}
				
				Page.eval(code_getCompoId, function(id){
					if (id === -1) {
						alert('No Component for the element');
						return;
					}
					
					app.compos.elementsView.selectById(id);
				});
			},
			
			refresh: function(){
				
				App.build();
			},
			
			loading: function(){
				if (window.app) 
					window.app.remove();
					
				window.app = App.initialize('#layout-page-loading');
			}
		}
	});