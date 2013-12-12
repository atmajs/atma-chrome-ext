


__runtime
	.onConnect
	.addListener(function(devToolsConnection, sender) {
	
		__connections.push({
			connection: devToolsConnection
		});
		
	});