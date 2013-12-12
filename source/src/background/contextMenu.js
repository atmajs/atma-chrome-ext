
__chrome
	.contextMenus
	.onClicked
	.addListener(function(data, tab){
        
		var conn = __connections.first({
			tabId: tab.id
		});
		
		
		if (conn == null) 
			return alert('Please, open the developer tools and activate Atma.js extension first.');
		
		
		devTab = conn.connection.sender.tab;
		
		__chrome
			.windows
			.update(devTab.windowId, {
				focused: true
			}, function(window){
				console.log('WINODW', window)
			});
			
		
		conn.send('inspect');
	});