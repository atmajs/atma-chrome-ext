__chrome
	.tabs
	.onUpdated
	.addListener(function(tabId, info){
		
		var conn = __connections.first({
			tabId: tabId
		});
		
		if (conn == null) 
			return;
		
		if (info.status !== 'complete') 
			return conn.send('loading');
		
		setTimeout(function(){
			
			conn.send('refresh');	
		}, 200);
		
	});