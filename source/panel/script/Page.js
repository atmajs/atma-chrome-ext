(function(){
	var __callbacks = {},
		__counter = 0
		;
	window.Page = include.exports = {
	
		eval: function(mix /* ... args, done */){
			
			if (Array.isArray(mix)) {
				
				var length = arguments.length,
					listener = arguments[length - 1],
					await = new Class.Await
					;
				
				var args = Array.prototype.slice.call(arguments, 1, length - 1),
					i = mix.length,
					
					_arguments
					;
					
				while(--i){
					
					_arguments = [mix[i]].concat(args);
					_arguments.push(await.delegate());
					
					Page.eval.apply(null, _arguments);
				}
				
				await.always(function(){
					listener();
				});
				
				return;
			}
			
			
			
			evalEx
				.apply(null, [false].concat(toArray(arguments)));
		},
		
		evalAsync: function(fn /* ... args, done */){
			
			evalEx
				.apply(null, [true].concat(toArray(arguments)));
		},
		
		resolve: function(id /* ..args */){
			var args = toArray(arguments, 1),
				fn = __callbacks[id]
				;
			
			if (fn == null) 
				return console.error('<Page.resolve> fn is undefined', id);
			
			fn.apply(null, args);
			
			delete __callbacks[id];
		},
		
		sendMessage: function(){
			var args = Array.prototype.slice.call(arguments),
				id = ++__counter;
			
			
			if (typeof args[args.length - 1] === 'function') 
				__callbacks[id] = args.pop();
			
			
			args.unshift(id);
			args.splice(2, 0, chrome.devtools.inspectedWindow.tabId);
			
			
			//-console.log('sending Message', args);
			
			// [awaitID, actionName, tabID, ...]
			__connection.postMessage(args);
		},
		
		
		// methods
		
		checkAtma: function(done){
			
			Page.eval(function(){
				return !!(window.mask || (window.atma && window.atma.mask));
			}, done)
		},
		
		onLoad: function(done){
			Page.evalAsync(function(done){
				
				var include = window.include || (window.atma && window.atma.include);
				if (include) {
					
					if (include.state === 4) 
						return done();
					
					include.ready(function(){
						
						
						setTimeout(done, 100);
					});
					
					return;
				}
				
				if (document.readyState !== 'complete') {
					
					function loaded(){
						window.removeEventListener('load', loaded, false);
						done();
					}
					
					window.addEventListener('load', loaded, false);
					return;
				}
				
				done();
				
			}, done);
		}
	};
	
	
	// private
	
	function toArray(args, start){
		return Array.prototype.slice.call(args, start || 0);
	}
	
	function evalEx(isAsync, fn /* ... args, done */ ){
		var args = Array.prototype.slice.call(arguments, 2),
			done,
			code
			;
			
		if (typeof args[args.length - 1] === 'function') 
			done = args.pop();
		
		if (done == null) 
			isAsync = false;
			
		if (isAsync) {
			__callbacks[++__counter] = done;
			
			args.unshift(__counter);
		}
		
		code = isAsync
			? fn_toStringAsync(fn, args)
			: fn_toString(fn, args)
			;
		
		chrome
			.devtools
			.inspectedWindow
			.eval(code, function(result, error){
				
				if (error) 
					console.error('<inspectedWindow: error>', error.value, code);
					
					
				isAsync !== true && done && done.apply(null, arguments);
			});
	}
	
	
}());
