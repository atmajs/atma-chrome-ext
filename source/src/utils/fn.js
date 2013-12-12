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
