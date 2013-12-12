var Highlighter = (function(){
			
	var _$elements = [];
	
	function highlight(element, info, index){
		var $el = _$elements[index];
		if ($el == null) {
			_$elements[index] = $el = document.createElement('div');
			
			css_apply($el, {
				backgroundColor: 'rgba(80,117,152,.5)',
				position: 'absolute',
				zIndex: 99999999,
			});
			
			var span = document.createElement('span');
			css_apply(span, {
				display: 'inline-block',
				padding: '0px 4px',
				background: 'rgba(255, 255, 194, .8)',
				color: 'block',
				fontSize: '12px',
				fontFamily: 'monospace',
				position: 'relative',
				top: '1px',
				left: '1px'
			});
			
			$el.appendChild(span);
		}
		
		if ($el.parentNode) 
			$el.parentNode.removeChild($el);
		
		
		css_apply($el, {
			display: 'block',
			height: info.height + 'px',
			width: info.width + 'px',
			left: info.left + 'px',
			top: info.top + 'px'
		});
		
		var txt = info.compoName
			+ ' <span style="font-size: .9em">'
			+ info.width
			+ 'px\u2237'
			+ info.height
			+ 'px ['
			+ info.left
			+ 'px\u2236'
			+ info.top
			+ 'px]</span>'
			;
		
		$el.querySelector('span').innerHTML = txt;	
		
		
		element.parentNode.appendChild($el);
	}
	
	
	function getOffset(el){
		
		if (el == null) 
			return null;
		
		var top = el.offsetTop,
			left = el.offsetLeft
			;
		
		var _top = top,
			_left = left
			;
		
		var parent = el.offsetParent,
			p = el.parentNode,
			
			style;
		
		if (p != null && p !== parent) {
			while(p.parentNode !== parent)
				p = p.parentNode;
			
			
			style = getComputedStyle(p);
			
			if (style) {
				left -= parseInt(style.marginLeft);
				top -= parseInt(style.marginTop);
			}
		}
		
		
		
		return {
			top: top,
			left: left
		};
	}
	
	function dehighlightAll(){
		_$elements.forEach(function(el){
			el.style.display = 'none';
		});
	}
	
	_dispose.push(dehighlightAll);
	
	return {
		highlight: function(id){
			
			if (id == null) {
				dehighlightAll();
				return;
			}
			
			var compo = _cache[id];
			if (compo == null) {
				console.error('<highlight> Component not found', id);
				return;
			}
			
			var els = compo_getElements(compo);
			if (els == null) {
				console.warn('<highlight> has no elements', compo);
				return;
			}
			
			if (els.length === 0) {
				return;
			}
			
			var sizes = [],
				info,
				i = -1,
				imax = els.length,
				x
				;
			
			while(++i < imax) {
				x = els[i];
				info = getOffset(x);
				
				info.width = x.offsetWidth;
				info.height = x.offsetHeight;
				info.compoName = compo.compoName;
				
				sizes.push(info);
			}
			
			imax = sizes.length;
			i = -1;
			while(++i < imax){
				highlight(els[i], sizes[i], i);
			}
			
			imax = _$elements;
			i--;
			while(++i < imax){
				_$elements[i].style.display = 'none';
			}
		}
	}
	
}());