include 
	.load('bindingsView.mask::Template') 
	.done(function(resp){

		function code_bindings(id, path) {
							
			var obj = __atmaDebugger.getModelBingings(id);
			
			return __atmaDebugger.getProperties(obj, path);	
		}
		
		mask.registerHandler(':bindingsView', Compo({
			
			_compoId: null,
			template: resp.load.Template,

			compos: {
				inspector: 'compo: :objectInspector'
			},
			
			pipes: {
				elements: {
					selectionChanged: function(elementsView, compoId){
						
						this._compoId = compoId;
						
						var inspector = this.compos.inspector;
						
						app.eval(
							code_bindings,
							compoId,
							'',
							function(properties){
								
								inspector.setObject({
									properties: properties
								});
							}
						);
					}
				}
			},
			
			requestProperties: function(path, done){
				app.eval(
					code_bindings,
					this._compoId,
					path,
					function(properties){
						done(properties);
					}
				);
			},
			
			onRenderStart: function(model, ctx, container){
				
				this.model = {
					title: 'Model Bindings',
					objects: [
						{}
					]
				};
			},
			onRenderEnd: function(elements, model, ctx, container){
				// ..
			},
	
			//dispose: function(){
			//
			//}
		}));


	});
