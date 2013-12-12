include
    .css('contextMenu.css')
    .done(function() {
        
        // @reference viewer.mask for usage example
        
        mask.registerHandler(':contextMenu', Compo.createClass({
            
			tagName: 'menu',
			attr: {
				'class': '-ctx-menu'
			},
			
            slots: {
				popoverClose: function(){
					this.hide();
				}
			},
			
			events: {
				'click: menuitem': function(event){
					var $menuitem = $(event.currentTarget),
						name = $menuitem.attr('name'),
						item = this.items[name]
						;
					if ($menuitem.hasClass('disabled')) 
						return;
					
					this.hide();
					
					item.selected && item.selected(event);
				}
			},
			
			onRenderStart: function(){
				
			},
			
			initialize: function(items){
				
				var el = this.$[0];
				for(var name in items){
					
					var item = document.createElement('menuitem');
					item.setAttribute('name', name);
					item.textContent = items[name].title;
					
					el.appendChild(item);
				}
				
				this.items = items;
			},
			
			enabledDelegate: function($item, done){
				
				return function(enabled){
					
					$item.toggleClass('disabled', !enabled);
					done();
				};
			},
			
			show: function(event){
				
				
				var await = new Class.Await();
				for (var name in this.items){
					
					if (this.items[name].enabled) {
						
						var $item = this.$.find('[name="' + name + '"]');
						
						this.items[name].enabled(event, this.enabledDelegate($item, await.delegate()));
					}
				}
				
				
				var offset = this.$.parent().offset(),
					x  = event.pageX,
					y  = event.pageY
					;
				
				x -= offset.left;
				y -= offset.top;
				
				
				var $ = this.$;
				
				await.always(function(){
					$.show();
				});
				
				var width = this.$.innerWidth(),
					height = this.$.innerHeight()
					;
					
				//x -= width;
				
					
				
				var style = this.$.get(0).style;
				style.left = x + 'px';
				style.top = y + 'px';
				
				
				
				document.addEventListener('mouseup', this.hideWorker, true)
			},
			Self: {
				hide: function(){
					
					document.removeEventListener('mouseup', this.hideWorker, true);
					
					this.$.hide();
					//mask.animate(this.$.get(0), {
					//	model: [
					//		'transform | scale(1) > scale(1.5) | 200ms ease',
					//		'opacity| 1 > 0 | 200ms ease'
					//	],
					//	next: [
					//		'display| > none'
					//	]
					//});
				},
				hideWorker: function(event){
					
					if ($(event.target).closest('.-popover').length)
						return;
					
					//event.stopPropagation();
					//event.preventDefault();
					//event.stopImmediatePropagation();
					
					this.hide()
				}
			}
        }));

    });