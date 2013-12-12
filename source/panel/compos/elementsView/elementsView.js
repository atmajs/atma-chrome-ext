include 
	.load('elementsView.mask::Template') 
	.css(
		'elements.css'
	)
	.js('/panel/control/contextMenu/contextMenu.js')
	.done(function(resp){

		mask.registerHandler(':elementsView', Compo({
			template: resp.load.Template,

			
			compos: {
				contextMenu: 'compo: :contextMenu',
				
				$ol: '$: #compos-container'
			},
			
			pipes: {
				elements: {
					treeModified: function( /* array */){
						console.log('>> tree modified:', arguments);
							
						var imax = arguments.length,
							i = -1
							;
						while( ++i < imax)
							this.modify(arguments[i]);
					}
				}
			},
			
			events: {
				// expand-collapse a node
				'click: li.parent': function(event){
					
					if (event.target !== event.currentTarget) 
						return;
					
					var $li = $(event.currentTarget);
					
					if (event.offsetX - 5 > $li.children('.highlight').get(0).offsetLeft) 
						return;
					
					event.preventDefault();
					event.stopPropagation();
					event.stopImmediatePropagation();
					
					this.toggleNode($li);
				},
				
				// select a node
				//'click: li': function(event) {
				//	
				//	
				//},
				
				'mouseenter: li': function(event){
					
					var $li = $(event.currentTarget).addClass('hovered'),
						id = $li.data('id')
						;
					
					this.highlightedID = id;
					
					app.eval(code_highlight, id);
					
					function code_highlight(id) {
						
						__atmaDebugger.highlight(id);
					}
				},
				
				'mouseleave: li': function(){
					var $li = $(event.target),
						id;
					
					if ($li[0].tagName !== 'LI') 
						$li = $li.closest('li');
					
					id = $li.removeClass('hovered').data('id');
					
					if (id !== this.highlightedID) 
						return;
					
					app.eval(function(){
						
						__atmaDebugger.highlight(null);
					});
				},
				
				'mouseup: li': function(event){
					var $li = $(event.currentTarget);
					
					this.selectByNode($li);
					
					if (event.button === 2) {
						
						this.compos.contextMenu.show(event);
					}
				}
				
			},
			
			// highlighted-search-result
			search: function(action, query){
				// cancelSearch
				// performSearch
				
				search_clear(this.compos.$ol);
				
				if (action === 'cancelSearch') 
					return 0;
				
				var arr = search_perform(this.compos.$ol.get(0), query, []);
				
				return arr.length;
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
			
			selectByNode: function($li){
				var CLASS = 'selected',
					id = $li.data('id')
					;
				if ($li.hasClass(CLASS)) 
					return;
				
				app.eval(function(id){
					
					__atmaDebugger.select(id);
					
				}, $li.data('id'));
				
				this
					.$
					.find('li.' + CLASS)
					.removeClass(CLASS)
					.children('.selection')
					.removeClass(CLASS);
					;
				
				$li
					.addClass(CLASS)
					.children('.selection')
					.addClass(CLASS)
					;
				
				this.selectedId = id;
				Compo.pipe('elements').emit('selectionChanged', this, id);
			},
			selectById: function(id){
				var $li = this.compos.$ol.find('li[data-id="' + id + '"]'),
					el = this.compos.$ol.get(0)
					;
				
				var $parents = $li.parentsUntil(el),
					$parent,
					imax = $parents.length,
					i = -1
					;
				while( ++i < imax){
					
					$parent = $parents.eq(i);
					if ($parent.get(0).tagName !== 'OL') 
						continue;
					
					this.toggleNode($parent.prev('li'), true);
				}
				
				this.selectByNode($li);
				
				var el = this.compos.$ol.get(0);
				
				el.parentNode.scrollTop = $li.get(0).offsetTop - 50;
				el.focus();
			},
			
			modify: function(node){
				/* ID, path, tree, type (delete|new) */
				
				if ('delete' === node.type) {
					var $li = this.compos.$ol.find('[data-id="' + node.ID + '"]'),
						$ol = $li.next();
					if ($ol.length && $ol.get(0).tagName === 'OL') 
						$ol.remove();
					
					var $next = $li.prevAll('li');
					
					if ($next.length === 0) 
						$next = $li.nextAll('li');
					
					if ($next.length === 0) 
						$next = $li.closest('ol').prev('li');
					
					if ($next.length) 
						this.selectByNode($next.eq(0));
					
					if ($li.siblings().length === 0) {
						$ol = $li.closest('ol');
						
						$ol
							.prev('li')
							.removeClass('expanded parent');
						$ol.remove();
					}
					
					$li.remove();
					return;
				}
				
				// is `new`
				var $template = jmask(resp.load.Template)
					.filter('#compo-element')
					.children()
					;
				
				var parts = node.path.split('.'),
					parentId = parts[parts.length - 2],
					
					$li = null,
					$ol = this.compos.$ol
					;
				
				if (parentId != null) {
					
					$li = this
						.compos
						.$ol
						.find('[data-id="' + parentId + '"]')
						;
					if ($li.length === 0) 
						return console.error('<parent not present>', parentId);
					
					if ($li.hasClass('parent') === false) {
						$li.addClass('parent expanded');
						
						$('ol')
							.addClass('children expanded')
							.after($li)
							;
					}
					
					$ol = $li.next('ol');
				}
				
			
				
				$ol.appendMask($template, node.compo);
			},
			
			onRenderStart: function(model, ctx, container){
				// ..
			},
			onRenderEnd: function(elements, model, ctx, container){
				this.compos.contextMenu.initialize({
					inspectElement: {
						title: 'Inspect child element',
						enabled: function(event, done){
							
							var id = $(event.currentTarget).data('id');
							
							function code_hasElement(id) {
								return __atmaDebugger.hasElements(id);
							}
							
							app.eval(code_hasElement, id, function(has){
								
								done(has);
							});
						},
						
						selected: function(event){
							
							Page.eval(function(id){
								
								var _id = id || ($c && $c.ID),
									_els = __atmaDebugger.getElements(_id),
									_el = _els && _els[0]
									;
								inspect(_el);
								
							}, this.selectedId);
						}
					}
				})
			}
		}));

		
		function search_clear($container){
			$container
				.find('.highlighted-search-result')
				.each(function(index, node){
					
					var txt = node.textContent;
					
					node.parentNode.insertBefore(document.createTextNode(txt), node);
					node.parentNode.removeChild(node);
				});
		}
		
		function search_perform(node, query, result) {
			if (node.tagName === 'SPAN' && node.textContent === node.innerHTML) {
				
				var txt = node.textContent;
				if (txt.indexOf(query) !== -1) {
					var html = node.innerHTML.replace(
						query, '<span class="highlighted-search-result">' + query + '</span>'
					);
					
					node.innerHTML = html;
					
					result.push(node);
				}
				return result;
			}
			
			var child = node.firstChild;
			while(child != null){
				
				search_perform(child, query, result);
				
				child = child.nextSibling;
			}
			
			return result;
		}
	});
