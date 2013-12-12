include 
	.load('objectInspector.mask::Template') 
	.css('objectInspector.css') //
	.done(function(resp){
		
		var $template;

		mask.registerHandler(':objectInspector', Compo.createClass({
			template: resp.load.Template,

			pipe: {
				elementsView: {
					selectionChanged: function(elementsView){
						
					}
				}
			},
			events: {
				'click: .header': function(event){
					$(event.currentTarget).parent().toggleClass('expanded');
				},
				'click: li.parent': function(event){
					
					if (event.target.tagName === 'A') 
						return;
					
					var $li = $(event.currentTarget);
					
					event.preventDefault();
					event.stopPropagation();
					event.stopImmediatePropagation();
					
					if ($li.next('ol').length) 
						return this.toggleNode($li);
					
					var path = $li.data('name');
					
					var $ol = $li.parent(),
						$parentLi
						;
					while($ol.length && $ol.hasClass('properties-tree') === false){
						
						$parentLi = $ol.prev('li');
						
						//if ($parentLi.length) 
						path = $parentLi.data('name') + '.' + path;
						
						$ol = $parentLi.parent();
					}
					
					
					console.log('>> path:', path);
					
					if ($template == null) {
						$template = jmask(resp.load.Template)
							.filter('#properties')
							.children()
							;
					}
					
					var that = this;
					this
						.parent
						.requestProperties(path, function(properties){
							
							$li.afterMask($template, {
								properties: properties
							});
							
							that.toggleNode($li, true);
						})
					
				}
			},
			onRenderStart: function(model, ctx, container){
				
				
			},
			onRenderEnd: function(elements, model, ctx, container){
				// ..
			},
			
			toggleNode: function($li, state){
				var CLASS = 'expanded',
					expanded = $li.hasClass(CLASS)
					;
				
				if (state != null && state === expanded) 
					return;
				
				if (state == null) 
					state = !expanded;
				
				$li
					.toggleClass(CLASS, state)
					.next('ol')
					.toggleClass(CLASS, state);
			},
			
			Self: {
				setObject: function(obj, title){
					if (title != null) 
						this.model.title = title;
					
					var arr = this.model.objects;
					//	obj = {
					//		properties: obj_toProperties(object, [])
					//	};
					
					if (arr.length) 
						arr.splice(0, 1, obj);
					else
						arr.push(obj);
						
				}
			}
			
		}));


		function obj_toProperties(obj, out) {
			var item,
				val,
				type
				;
			
			var TYPES = {
				Array: 'array',
				Arrguments: 'array',
				RegExp: 'regexp',
				Null: 'null',
				String: 'string',
				Number: 'number',
				Boolean: 'boolean',
				Function: 'string',
				
				Object: 'node',
				Error: 'node',
				global: 'node',
				
				Link: 'link'
			};
			
			for(var key in obj){
				
				item = {};
				item.name = key;
				
				if (item[key] === null) {
					item.value = item.type = 'undefined';
					continue;
				}
				
				val = obj[key];
				
				if (val == null) {
					item.type = 'undefined';
					item.value = 'undefined';
					out.push(item);
					return;
				}
				
				type = obj_typeof(val);
				
				item.value = val.toString();
				item.type = type in TYPES
					? TYPES[type]
					: 'node'
					;
				
				if (typeof val === 'object') 
					item.properties = obj_toProperties(val, []);
				
				out.push(item);
			}
			
			return out;
		}
	});
