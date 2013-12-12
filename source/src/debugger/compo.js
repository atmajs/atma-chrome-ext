var compo_getElements,
	compo_getRoots,
	compo_getTree,
	compo_serialize,
	compo_path
	;
	


(function(){
	
	compo_getElements = function(compo){
		
		if (compo.$) 
			return compo.$.toArray();
		
		if (compo.__elements) 
			return compo.__elements;
		
		var parent = compo,
			p$, ids;
		
		do {
			parent = parent.parent;
		} while(parent != null && parent.$ == null);
		
		if (parent == null) 
			return null;
		
		
		p$ = parent.$;
		ids = getIds(compo, []);
		
		var elements = [],
			imax = p$.length;
		
		while(--imax > -1)
			extractElements(p$[imax], ids, elements);
			
		return (compo.__elements = elements);
	};
	
	compo_getTree = function(compo, out){
		var compos = compo.components;
		if (compos == null) 
			return out;
		
		if (out._components == null) 
			out._components = [];
		
		var i = -1,
			imax = compos.length
			;
		while (++i < imax)
			out._components.push(compo_serialize(compos[i]));
		
		return out;
	};
	
	compo_getRoots = function(){
		if (window.app) 
			return [window.app];
		
		return compo_getForElement(document.body, []);
	};
	
	compo_path = function(compo){
		
		if (compo.ID == null) 
			compo.ID = 'd-' + (++ID);
		
		var path = compo.ID,
			parent = compo.parent;
		
		while(parent != null){
			
			path = parent.ID + '.' + path;
			parent = parent.parent;
		}
		return path;
	};
	
	compo_serialize = function(compo){
		
		if (compo.ID == null) 
			compo.ID = 'd-' + (++ID);
		
		
		_cache[compo.ID] = compo;
		
		var json = {
			_compoName: compo.compoName,
			_attr: {},
			_ID: compo.ID,
			_components: []
		};
		
		var key, val;
		for (key in compo.attr){
			val = compo.attr[key];
			if (val) 
				json._attr[key] = val;
		}
		
		compo_getTree(compo, json);
		
		return json;
	}
	
	// private
	
	var ID = 0;
	
	
	function compo_getForElement(element, out){
		if (out == null) 
			out = [];
		
		var id = element.getAttribute('x-compo-id')
		if (id) {
			
			if (_cache[id] == null) 
				_cache[id] = $(element).compo();
			
			if (out.indexOf(_cache[id]) === -1) 
				out.push(_cache[id]);
			
			return out;
		}
		
		var child = element.firstChild;
		while(child != null){
			
			if (child.nodeType === 1)
				compo_getForElement(child, out);
			
			child = child.nextSibling;
		}
		
		return out;
	}
	
	function getIds(compo, out){
		out.push(compo.ID);
		
		if (compo.components == null) 
			return out;
		
		var imax = compo.components.length,
			i = -1;
		while(++i < imax)
			getIds(compo.components[i], out);
		
		return out;
	}
	
	function extractElements(element, ids, out){
		if (element.hasAttribute('x-compo-id')) {
			
			var id = parseInt(element.getAttribute('x-compo-id'));
			if (ids.indexOf(id) !== -1) {
				
				out.push(element);
				return out;
			}
		}
		
		var child = element.firstChild;
		while(child !== null){
			if (child.nodeType === 1) 
				extractElements(child, ids, out);
			
			child = child.nextSibling;
		}
		
		return out;
	}
	
}());