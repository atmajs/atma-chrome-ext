

include.exports = {
	debug: function(){
		
		var mask = window.mask || (window.atma && window.atma.mask);
		
		if (mask == null || mask.Compo == null) 
			return;
		
		if (window['__atmaDebugger']) 
			return;
		
		
		mask.plugin('(' + DebuggerPlugin.toString() + ')();');
		
		function DebuggerPlugin(){
			
			var _cache = {},
				_dispose = [],
				_activeElement
				;
			
			// source compo.js
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
			// end:source compo.js
			// source ../utils/fn.js
			var fn_toString,
				fn_toStringAsync,
				fn_before
				;
				
			(function(){
			
				fn_toString = function(fn, args){
					return fn_toStringEx(false, fn, args);
				};
			
				fn_toStringAsync = function(fn, args){
					return fn_toStringEx(true, fn, args);
				};
				
				fn_before = function(fn, beforeFn){
					
					return function(){
						beforeFn.apply(this, arguments);
						fn.appy(this, arguments);
					};
				};
				
				
				// PRIVATE
				
				function fn_toStringEx(isAsync, fn, args){
					var code = '';
					
					code += isAsync !== true
						? '('
						: ('__atmaDebuggerUtil.evalAsync('
							+ args.shift()
							+ ','
							)
						;
				
					code += isAsync !== true
						? (fn.toString() + ')(')
						: (fn.toString()
							+ (args.length === 0 ? '' : ',')
							)
						;
				
					
					if (args == null) 
						return code + ');';
					
					var i = -1,
						imax = args.length,
						val
						;
					while(++i < imax){
						
						val = args[i];
						
						if (typeof val !== 'number') 
							val = JSON.stringify(val);
						
						code += val;
						
						if (i !== imax - 1) 
							code += ',';
					}
				
					return code + ');';
				}
				
			}());
			
			// end:source ../utils/fn.js
			// source ../utils/obj.js
			
			// String
			// Number
			// Date
			// RegExp
			// Function
			// Error
			// Boolean
			// Array
			// Arguments
			// Object
			// global
			// Null
			
			var LINK_PREFIX = '%webkit-link%';
			
			function obj_typeof(x) {
				if (x != null
					&& typeof x === 'object'
					&& typeof x.length === 'number'
					&& typeof x.slice === 'function') {
					
					return 'Array';
				}
				
				if (typeof x === 'string') {
					
					if (x.substring(0, LINK_PREFIX.length) === LINK_PREFIX) 
						return 'Link';
					
					return 'String';
				}
				
				return Object
			        .prototype
			        .toString
			        .call(x)
			        .replace('[object ', '')
			        .replace(']', '');
			}
			
			var obj_getProperty = function(obj, property) {
				var chain = property.split('.'),
					imax = chain.length,
					i = -1;
				while ( ++i < imax ) {
					if (obj == null) 
						return null;
					
					obj = obj[chain[i]];
				}
				return obj;
			};
			
			
			var obj_setProperty = function(obj, property, value) {
				var chain = property.split('.'),
					imax = chain.length - 1,
					i = -1,
					key;
				while ( ++i < imax ) {
					key = chain[i];
					if (obj[key] == null) 
						obj[key] = {};
					
					obj = obj[key];
				}
				obj[chain[i]] = value;
			};
			
			var obj_dimissCircular = (function() {
			    var cache;
			
			    function clone(mix) {
			        if (mix == null) 
			            return mix;
			        
					
			        var type = obj_typeof(mix),
			            cloned;
			        
			        switch (type) {
			            case 'String':
			            case 'Number':
			            case 'Date':
			            case 'RegExp':
			            case 'Function':
			            case 'Error':
			            case 'Boolean':
			                return mix;
			            case 'Array':
			            case 'Arguments':
			                cloned = [];
			                for (var i = 0, imax = mix.length; i < imax; i++) {
			                    cloned[i] = clone(mix[i]);
			                }
			                return cloned;
						case 'Object':
			            case 'global':
			                if (cache.indexOf(mix) !== -1) 
			                    return '<circular>';
			                
			                cache.push(mix);
			                cloned = {};
			                
			                for (var key in mix) {
			                    cloned[key] = clone(mix[key]);
			                }
			                return cloned;
						default:
							return type;
			        }
			    }
			
			    return function(mix) {
			        if (typeof mix === 'object' && mix != null) {
			            cache = [];
			            mix = clone(mix);
			            cache = null;
			        }
			
			        return mix;
			    };
			}());
			
			var obj_formatProperties = function(obj){
				var arr = [],
									
					key, val, type, formatted
					;
				for(key in obj){
					val = obj[key];
					type = obj_typeof(val)
					formatted = obj_formatValue(val, type);
					
					
					arr.push({
						name: key,
						value: formatted,
						type: type.toLowerCase(),
						properties: [],
						
						hasChildren: obj_hasChildren(val, formatted, type),
						isDimmed: key.substring(0, 2) === '__'
					});
				}
				
				arr.sort(function(a, b){
					var c1 = a.name.charCodeAt(0),
						c2 = b.name.charCodeAt(0)
						;
					if (c1 === c2) 
						return 0;
					
					return c1 < c2
						? -1
						: 1
						;
				});
				
				return arr;
			};
			
			var obj_hasChildren = function(obj, formatted, type){
				if (obj == null) 
					return false;
				
				switch(type){
					case 'String':
					case 'Function':
					case 'Boolean':
					case 'RegExp':
					case 'Date':
					case 'Number':
					case 'Link':
						return false;
					
					default:
						return formatted.indexOf('[0]') === -1;
				}
			}
			
			var obj_formatValue = (function(){
				
				return function(val, type){
					
					if (val == null) 
						return '<null>';
					
					type = type || obj_typeof(val);
					
					switch(type){
						case 'String':
							return '"' + val + '"';
						case 'Link':
							return val.replace(LINK_PREFIX, '');
						
						case 'Function':
						case 'Boolean':
						case 'RegExp':
							return val.toString();
						case 'Date':
							return val.toISOString();
						case 'Number':
							return val;
						
						case 'Array':
							return 'Array[' + val.length + ']';
					}
					
					if (typeof val === 'object') 
						return type + '[' + Object.keys(val).length + ']';
					
					return '<unknown ' + type + '>';
				};
			}());
			// end:source ../utils/obj.js
			// source ../utils/css.js
			function css_apply(el, css){
				for(var key in css)
					el.style[key] = css[key];
			}
			// end:source ../utils/css.js
			
			// source hover-highlight.js
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
						if (els == null) 
							return;
						
						if (els.length === 0) 
							return;
						
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
			// end:source hover-highlight.js
			// source compo-listener.js
			var CompoListener = (function(){
				
				Mask.on('compoCreated', listener_Created);
				
				function listener_Created(compo){
					setTimeout(function(){
						
						if (_cache[compo.ID] == null) {
							_cache[compo.ID] = compo;
							
							attach_Disposer(compo);
							
							if (compo.parent && compo.parent.ID in _cache == false) 
								listener_Created(compo.parent);
						}
						
						Queue.add({
							type: 'new',
							path: compo_path(compo),
							compo: compo
						});
						
					});
				}
				
				function listener_Disposed(compo){
					
					Queue.add({
						type: 'delete',
						path: compo_path(compo),
						compo: compo
					});
				}
				
				function attach_Disposer(compo){
					if (_attachedDisposer[compo.ID]) 
						return;
					
					_attachedDisposer[compo.ID] = true;
					
					Mask.Compo.attachDisposer(compo, function(){
						listener_Disposed(this);
					});
				}
				
				var _timer,
					_attachedDisposer = {},
					_package = [];
				
				var Queue = {
					add: function(node){
						clearTimeout(_timer);
						
						_package.push(node);
						_timer = setTimeout(Queue.send, 200);
					},
					
					send: function(){
						
						_package
							.sort(function(a, b){
								var aL = a.path.length,
									bL = b.path.length
									;
								if (aL === bL) 
									return 0;
								
								return aL < bL
									? -1
									: 1
									;
							});
							
						pckg_reduce();
						
						var array = _package.map(function(node){
							return {
								path: node.path,
								type: node.type,
								ID: node.compo.ID,
								
								compo: node.type === 'new'
									? compo_serialize(node.compo)
									: null
							};
						})
						
						_package.length = 0;
						__atmaDebuggerUtil.send('compo-tree-changed', [array]);
					}
				}
				
				
				function pckg_reduce(){
					var i = _package.length,
						j = i,
						
						node, prev;
					
					while (--i > -1){
						
						node = _package[i];
						j = i;
						while (--j > -1){
							
							prev = _package[j];
							
							if (node.path === prev.path) {
								removePrev();
								continue;
							}
							
							if (node.path.indexOf(prev.path + '.') !== -1) {
								removeCurrent();
								continue;
							}
							
							if (prev.path.indexOf(node.path + '.') !== -1) {
								removePrev();
								continue;
							}
						}
					}
					
					function removeCurrent(){
						_package.splice(i, 1);
					}
					function removePrev(){
						_package.splice(j, 1);
						
						i--;
					}
				}
				
				return {
					ensure: function(){
						for(var id in _cache){
							
							attach_Disposer(_cache[id]);
						}
					}
				}
			}());
			// end:source compo-listener.js
			
			window['__atmaDebugger'] = {
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
		
		if (window['__atmaDebuggerUtil']) 
			return;
		
		function util_send(eventName, args){
				
			var event;
			
			args.unshift(eventName);
			event = new CustomEvent('atma-debugger-proxy', { detail: args });
			
			document.dispatchEvent(event);
		};
		
		window['__atmaDebuggerUtil'] = {
			
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