var Connection = Class({
	
	Base: Class.Serializable,
	
	
	tabId: null,
	connection: null,
	
	Construct: function(){
		
		this
			.connection
			.onMessage
			.addListener(this.onMessage)
			;
		this
			.connection
			.onDisconnect
			.addListener(this.onDisconnect)
			;
	},
	
	send: function(){
		
		this.connection.postMessage(Array.prototype.slice.call(arguments));
	},
	
	_unbind: function(){
		this
			.connection
			.onMessage
			.removeListener(this.onMessage)
			;
		this
			.connection
			.onDisconnect
			.removeListener(this.onDisconnect)
			;
	},
	
	Self: {
		
		onDisconnect: function(){
			
			if (__connections.remove(this).length === 0)
				console.warn('Connection not removed');
			
			if (this.tabId) 
				ContentScript.actions.emit(this.tabId, 'atma-debugger-dispose');
			
			this._unbind();
		},
		
		onMessage: function(args, sender){
			
			var awaitId = args.shift(),
				name = args[0],
				tabId = args[1],
				
				done
				;
			
			if (this.tabId == null && typeof tabId === 'number')
				this.tabId = tabId;
			
			if (typeof awaitId === 'number') 
				done = this.responder(awaitId)
			
			
			args.push(done);
			
			ContentScript.process.apply(null, args);
		},
		
		responder: function(awaitId){
			
			var that = this;
			return function(error, data){
			
				that.connection.postMessage([awaitId, error, data]);
			};
		}
			
	}
});