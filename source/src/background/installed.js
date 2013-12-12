
__runtime
	.onInstalled
	.addListener(function(){

    
		__chrome.contextMenus.create({
			id: 'ctx-atma-menu',
			title: 'Inspect component',
			contexts: ['all']
		}, function(){
			
			if (chrome.runtime.lastError) 
				console.error('<install: ctxmenu>', chrome.runtime.lastError);    
		});
	});