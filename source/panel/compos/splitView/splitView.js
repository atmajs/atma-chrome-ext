include 
	.load('splitView.mask::Template') 
	.css('splitView.css') 
	.done(function(resp){
		
		var RIGHT = 250;
		
		mask.registerHandler(':splitView', Compo.createClass({
			//template: resp.load.Template,

			tagName: 'div',
			attr: {
				'class': 'split-view split-view-vertical visible'
			},

			onRenderStart: function(model, ctx, container){
				
				var $nodes = jmask(this.nodes),
					$template = jmask(resp.load.Template)
					;
				
				function replace(name){
					
					var $tag = $nodes.filter('@' + name);
					
					$tag = $template
						.filter('@' + name)
						.tag('div')
						.addClass($tag.attr('class'))
						.mask($tag.get(0).nodes)
						;
					
					if (name === 'left') {
						$tag.css('right', RIGHT + 'px');
						return;
					}
					
					$tag.css('width', RIGHT + 'px');
				}
				
				replace('left');
				replace('right');
				
				$template
					.filter('.split-view-resizer')
					.css('right', RIGHT + 'px')
					;
				
				this.nodes = $template;
			},
			onRenderEnd: function(elements, model, ctx, container){
				var el = elements[0],
					left = el.querySelector('.split-view-contents-first'),
					right = el.querySelector('.split-view-contents-second'),
					splitter = el.querySelector('.split-view-resizer')
					;
				
				ResizerX.enable(left, right, splitter, RIGHT);
			},
			
			stop: function(event){
				event.preventDefault();
				event.stopPropagation();
			},
			
			Self: {
				move: function(event){
					this.stop(event);
				},
				
				mousedown: function(event){
					
				},
				
				mouseup: function(){
					
				}
				
			}
		}));

		
		var ResizerX = (function(){
			
			var _$left,
				_$right,
				_$splitter,
				_right,
				
				
				width,
				lastX,
				dx,
				dragging,
				moved;
			
			
			function stop(event) {
				event.preventDefault();
				event.stopPropagation();
			}
			function mousemove(event){
				moved = true;
				
				stop(event);
				
				dx += lastX - event.pageX;
				
				lastX = event.pageX;
				return;
				
				var next = _right + dx + (lastX - event.pageX);
				
				lastX = event.pageX;
				
				
				if ( next < 5 || 150 > next)
					return;
				
				
				dx = _right - next;
			}
			function mouseup(event){
				document.body.style.cursor = 'default';
				dragging = false;
				
				
				if (moved === false) 
					return;
				
				stop(event);
				document.removeEventListener('mousemove', mousemove, true);
				document.removeEventListener('mouseup', mouseup, true);
			}
			function update(){
				if (dragging === false) 
					return;
				
				if (dx !== 0) {
						
					_right += dx;
					
					_$right.style.width = _right + 'px';
					
					_$left.style.right = _right + 'px';
					_$splitter.style.right = _right + 'px';
					
					dx = 0;
				}
				
				requestAnimationFrame(update);
			}
			
			return {
				enable: function($left, $right, $splitter, right){
					
					_$left = $left;
					_$right = $right;
					_$splitter = $splitter;
					_right = right;
					
					
					$splitter.addEventListener('mousedown', function(event){
						
						dx = 0;
						lastX = event.pageX;
						moved = false;
						dragging = true;
						width = $splitter.parentNode.offsetWidth;
						
						document.addEventListener('mousemove', mousemove, true);
						document.addEventListener('mouseup', mouseup, true);
						
						document.body.style.cursor = 'ew-resize';
						
						
						update();
					}, false);
				}
			};
		}());
		

	});
