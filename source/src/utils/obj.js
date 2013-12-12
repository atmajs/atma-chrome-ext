
// String
// Number
// Date
// RegExp
// Function
// Error
// Boolean
// Array
// Arguments
// Object
// global
// Null

var LINK_PREFIX = '%webkit-link%';

function obj_typeof(x) {
	if (x != null
		&& typeof x === 'object'
		&& typeof x.length === 'number'
		&& typeof x.slice === 'function') {
		
		return 'Array';
	}
	
	if (typeof x === 'string') {
		
		if (x.substring(0, LINK_PREFIX.length) === LINK_PREFIX) 
			return 'Link';
		
		return 'String';
	}
	
	return Object
        .prototype
        .toString
        .call(x)
        .replace('[object ', '')
        .replace(']', '');
}

var obj_getProperty = function(obj, property) {
	var chain = property.split('.'),
		imax = chain.length,
		i = -1;
	while ( ++i < imax ) {
		if (obj == null) 
			return null;
		
		obj = obj[chain[i]];
	}
	return obj;
};


var obj_setProperty = function(obj, property, value) {
	var chain = property.split('.'),
		imax = chain.length - 1,
		i = -1,
		key;
	while ( ++i < imax ) {
		key = chain[i];
		if (obj[key] == null) 
			obj[key] = {};
		
		obj = obj[key];
	}
	obj[chain[i]] = value;
};

var obj_dimissCircular = (function() {
    var cache;

    function clone(mix) {
        if (mix == null) 
            return mix;
        
		
        var type = obj_typeof(mix),
            cloned;
        
        switch (type) {
            case 'String':
            case 'Number':
            case 'Date':
            case 'RegExp':
            case 'Function':
            case 'Error':
            case 'Boolean':
                return mix;
            case 'Array':
            case 'Arguments':
                cloned = [];
                for (var i = 0, imax = mix.length; i < imax; i++) {
                    cloned[i] = clone(mix[i]);
                }
                return cloned;
			case 'Object':
            case 'global':
                if (cache.indexOf(mix) !== -1) 
                    return '<circular>';
                
                cache.push(mix);
                cloned = {};
                
                for (var key in mix) {
                    cloned[key] = clone(mix[key]);
                }
                return cloned;
			default:
				return type;
        }
    }

    return function(mix) {
        if (typeof mix === 'object' && mix != null) {
            cache = [];
            mix = clone(mix);
            cache = null;
        }

        return mix;
    };
}());

var obj_formatProperties = function(obj){
	var arr = [],
						
		key, val, type, formatted
		;
	for(key in obj){
		val = obj[key];
		type = obj_typeof(val)
		formatted = obj_formatValue(val, type);
		
		
		arr.push({
			name: key,
			value: formatted,
			type: type.toLowerCase(),
			properties: [],
			
			hasChildren: obj_hasChildren(val, formatted, type),
			isDimmed: key.substring(0, 2) === '__'
		});
	}
	
	arr.sort(function(a, b){
		var c1 = a.name.charCodeAt(0),
			c2 = b.name.charCodeAt(0)
			;
		if (c1 === c2) 
			return 0;
		
		return c1 < c2
			? -1
			: 1
			;
	});
	
	return arr;
};

var obj_hasChildren = function(obj, formatted, type){
	if (obj == null) 
		return false;
	
	switch(type){
		case 'String':
		case 'Function':
		case 'Boolean':
		case 'RegExp':
		case 'Date':
		case 'Number':
		case 'Link':
			return false;
		
		default:
			return formatted.indexOf('[0]') === -1;
	}
}

var obj_formatValue = (function(){
	
	return function(val, type){
		
		if (val == null) 
			return '<null>';
		
		type = type || obj_typeof(val);
		
		switch(type){
			case 'String':
				return '"' + val + '"';
			case 'Link':
				return val.replace(LINK_PREFIX, '');
			
			case 'Function':
			case 'Boolean':
			case 'RegExp':
				return val.toString();
			case 'Date':
				return val.toISOString();
			case 'Number':
				return val;
			
			case 'Array':
				return 'Array[' + val.length + ']';
		}
		
		if (typeof val === 'object') 
			return type + '[' + Object.keys(val).length + ']';
		
		return '<unknown ' + type + '>';
	};
}());