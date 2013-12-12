var CompoListener = (function(){
	
	mask.on('compoCreated', listener_Created);
	
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
		
		mask.Compo.attachDisposer(compo, function(){
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