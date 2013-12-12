

// from content-script to devtools extension via background-script
__runtime
	.onMessage
	.addListener(function(message, sender){
   
		var conn =__connections.first({
			tabId: sender.tab.id
		});
		
		
		if (conn) {
			var args = Array.isArray(message)
				? message
				: [message]
				;
			
			
			
			conn.send.apply(conn, args);
		}
		
	 });