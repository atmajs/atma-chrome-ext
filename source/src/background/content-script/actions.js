
var ContentScript = (function(){
	
	var Actions = {
        inject: function(tabId, data, done){
        
            __chrome
				.tabs
				.executeScript(tabId, data, function(){
            		done && done.apply(null, arguments);
				});
        },
        
        emit: function(tabId, eventName){
            
            function code_emit(name) {
               document.dispatchEvent(new CustomEvent(name));
            }
            
			Actions.inject(tabId, {
				code: fn_toString(code_emit, [eventName])
			});
        },
		
		getActiveComponentId: function(tabId, done){
			
			function code_getId(){
				var el = document.activeElement;
				
				var compo = $(el).compo();
				
				return compo == null
					? -1
					: compo.ID
					;
			}
			
			Actions.inject(tabId, {
				code: fn_toString(code_getId)
			}, function(id){
				
				console.log('getActiveComponentId', arguments);
				
				done(id);
			})
		}
    };
	
	return {
		process: function(name, tabId /* .. */){
					
			var fn = Actions[name],
				args = Array.prototype.slice.call(arguments)
				;
			args.shift();
			
			
			if (fn == null) {
				console.error('Unknown action', name);
				return;
			}
			
			fn.apply(Actions, args);
		},
		
		actions: Actions
	}
	
}());
