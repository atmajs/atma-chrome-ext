include 
	.load('resourceView.mask::Template') 
	.done(function(resp){

		function code_bindings(id, path) {
							
			var compo = __atmaDebugger.getCompo(id),
				url = compo.__resource,
				obj = {};
			
			if (url) {
				var include = window.include || window.atma.include,
					res = include.getResource(url);
				
				function resolveIncludes(res, out){
					
					out.url = '%webkit-link%'
						+ window.location.origin
						+ res.url;
					
					if (res.includes) {
						res.includes.forEach(function(route){
							
							var res = route.resource,
								type = res.type
								;
							
							if (out[type] == null) 
								out[type] = [];
							
							
							out[type].push(resolveIncludes(res, {}));
						});
					}
					
					return out;
				}
				
				resolveIncludes(res, obj);
			}
			
			return __atmaDebugger.getProperties(obj, path);
		}
		
		mask.registerHandler(':resourceView', Compo({
			
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
					title: 'Resources',
					objects: [
						{
							properties: []
						}
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
