

include.exports = {
	debug: function(){
		
		var mask = window.mask || (window.atma && window.atma.mask);
		
		if (mask == null || mask.Compo == null) 
			return;
		
		if (window.__atmaDebugger) 
			return;
		
		
		mask.plugin('(' + DebuggerPlugin.toString() + ')();');
		
		function DebuggerPlugin(){
			
			var _cache = {},
				_dispose = [],
				_activeElement
				;
			
			// import compo.js
			// import ../utils/fn.js
			// import ../utils/obj.js
			// import ../utils/css.js
			
			// import hover-highlight.js
			// import compo-listener.js
			
			window.__atmaDebugger = {
				getComponents: function(){
					
					var rootCompos = compo_getRoots(),
						root = {
							components: rootCompos,
						},
						out = {}
						;
					
					var tree = compo_getTree(root, out);
					
					CompoListener.ensure();
					
					return tree;
				},
				
				highlight: function(id){
					Highlighter.highlight(id);
				},
				
				select: function(id){
					window.$c = _cache[id];
				},
				
				getActiveElement: function(){
					return _activeElement;
				},
				
				getModelBingings: function(compoId){
					var compo = _cache[compoId],
						model;
					if (compo == null) {
						console.error('<getModelBindings> no component', compoId);
						return null;
					}
					
					model = compo.model;
					if (model == null || model.__observers == null) 
						return {};
					
					var obj = {},
						observers = model.__observers,
						key
						;
					
					for( key in observers ) {
						
						if (key.substring(0, 2) === '__') 
							continue; 
						
						obj[key] = obj_getProperty(model, key);
					}
					
					return obj;
				},
				
				getModel: function(compoId){
					var compo = _cache[compoId],
						model;
					if (compo == null) {
						console.error('<getModelBindings> no component', compoId);
						return null;
					}
					return compo.model
				},
				
				getCompo: function(compoId){
					
					return _cache[compoId];
				},
				
				hasElements: function(id){
					var compo = _cache[id];
					if (compo == null) 
						return null;
					
					return compo_getElements(compo).length !== 0;
				},
				
				getElements: function(id){
					var compo = _cache[id];
					if (compo == null) 
						return null;
					
					return compo_getElements(compo);
				},
				
				getProperties: function(obj, property){
					
					if (property) 
						obj = obj_getProperty(obj, property);
					
					return obj_formatProperties(obj);
				}
			};
			
			if (window.$c != null) 
				console.warn('`$c` property for the selected component is already occupied');
			else 
				window.$c = null;
			
			
			document.addEventListener('mousedown', function(event){
				if(event.button == 2) 
					_activeElement = event.target;
			}, true)
			
			
			var disposer = (function(){
				
				function dispose(){
					
					_dispose.forEach(function(dispose){
						dispose();
					});
					
					//- document.removeEventListener('atma-debugger-dispose', dispose, true);
				}
				
				document.addEventListener('atma-debugger-dispose', dispose, true);
				
			}());
			
		}
		
	},
	
	utils: function(){
		
		if (window.__atmaDebuggerUtil) 
			return;
		
		function util_send(eventName, args){
				
			var event;
			
			args.unshift(eventName);
			event = new CustomEvent('atma-debugger-proxy', { detail: args });
			
			document.dispatchEvent(event);
		};
		
		window.__atmaDebuggerUtil = {
			
			send: util_send,
			
			evalAsync: function(id, fn /** args */){
				
				function done(){
					var args = Array.prototype.slice.call(arguments);
					
					args.unshift(id);
					
					util_send('async-complete', args);
				}
				
				var args = Array.prototype.slice.call(arguments, 2);
				args.push(done);
				
				fn.apply(null, args);
			}
		}
		
	},
	
	//=> for the page > background messages
	messageProxy: function(){
		// (content script)
		if (window.__atmaProxyListner) 
			return;
		
		window.__atmaProxyListner = function(event){
			
			var args = event.detail;
			
			args.unshift('content-script-message');
			chrome.runtime.sendMessage(args);
		}
		
		document.addEventListener(
			'atma-debugger-proxy',
			window.__atmaProxyListner,
			false
		);
	}
	
	
};