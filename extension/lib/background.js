
// source /vendor/class.js
// source ../src/umd.js
(function(root, factory){
	"use strict";

	var _isCommonJS = false,
		_global,
		_exports;
	
	if (typeof exports !== 'undefined' && (root == null || root === exports || root === global)){
		// raw nodejs module
        _global = global;
		_isCommonJS = true;
    }
	
	if (_global == null) {
		_global = typeof window === 'undefined'
			? global
			: window
			;
	}
	
	if (_exports == null) {
		_exports = root || _global;
	}
	
	
	factory(_global, _exports);
	
	if (_isCommonJS) {
		module.exports = _exports.Class;
	}
	
}(this, function(global, exports){
	"use strict";
// end:source ../src/umd.js
	
	// source ../src/vars.js
	var _Array_slice = Array.prototype.slice,
		_Array_sort = Array.prototype.sort;
	// end:source ../src/vars.js
	
	// source ../src/util/is.js
	function is_Function(x) {
		return typeof x === 'function';
	}
	
	function is_Object(x) {
		return x != null &&  typeof x === 'object';
	}
	
	function is_Array(x) {
		return x != null
			&& typeof x.length === 'number'
			&& typeof x.slice === 'function';
	}
	
	function is_String(x) {
		return typeof x === 'string';
	}
	
	function is_notEmptyString(x) {
		return typeof x === 'string' && x !== '';
	}
	// end:source ../src/util/is.js
	// source ../src/util/array.js
	function arr_each(array, callback) {
		
		if (arr_isArray(array)) {
			for (var i = 0, imax = array.length; i < imax; i++){
				callback(array[i], i);
			}
			return;
		}
		
		callback(array);
	}
	
	function arr_isArray(array) {
		return array != null
			&& typeof array === 'object'
			&& typeof array.length === 'number'
			&& typeof array.splice === 'function';
	}
	
	if (typeof Array.isArray !== 'function') {
		Array.isArray = function(array){
			if (array instanceof Array){
				return true;
			}
			
			if (array == null || typeof array !== 'object') {
				return false;
			}
			
			
			return array.length !== void 0 && typeof array.slice === 'function';
		};
	}
	// end:source ../src/util/array.js
	// source ../src/util/proto.js
	
	
	var class_inherit = (function() {
		
		var PROTO = '__proto__';
		
		function proto_extend(proto, source) {
			if (source == null) {
				return;
			}
			if (typeof proto === 'function') {
				proto = proto.prototype;
			}
		
			if (typeof source === 'function') {
				source = source.prototype;
			}
			
			for (var key in source) {
				proto[key] = source[key];
			}
		}
		
		var _toString = Object.prototype.toString,
			_isArguments = function(args){
				return _toString.call(args) === '[object Arguments]';
			};
		
		
		function proto_override(__super, fn) {
	        var __proxy = __super == null
					? function() {}
					: function(args){
					
						if (arguments.length === 1 && _isArguments(args)) {
							return fn_apply(__super, this, args);
						}
						
						return fn_apply(__super, this, arguments);
					};
	        
	        return function(){
	            this['super'] = __proxy;
	            
	            return fn_apply(fn, this, arguments);
	        };
	    }
	
		function inherit(_class, _base, _extends, original, _overrides) {
			
			var prototype = original,
				proto = original;
	
			prototype.constructor = _class.prototype.constructor;
	
			if (_extends != null) {
				proto[PROTO] = {};
	
				arr_each(_extends, function(x) {
					proto_extend(proto[PROTO], x);
				});
				proto = proto[PROTO];
			}
	
			if (_base != null) {
				proto[PROTO] = _base.prototype;
			}
	
			
			if (_overrides != null) {
				for (var key in _overrides) {
					prototype[key] = proto_override(prototype[key], _overrides[key]);
				}
			}
			
			_class.prototype = prototype;
		}
	
	
		// browser that doesnt support __proto__ 
		function inherit_protoLess(_class, _base, _extends, original, _overrides) {
			
	
			if (_extends != null) {
				arr_each(_extends, function(x) {
					
					delete x.constructor;
					proto_extend(_class, x);
				});
			}
			
			if (_base != null) {
				var tmp = function() {};
	
				tmp.prototype = _base.prototype;
	
				_class.prototype = new tmp();
				_class.prototype.constructor = _class;
			}
			
			if (_overrides != null) {
				var prototype = _class.prototype;
				for (var key in _overrides) {
					prototype[key] = proto_override(prototype[key], _overrides[key]);
				}
			}
			
			
			proto_extend(_class, original); 
		}
	
		return '__proto__' in Object.prototype === true ? inherit : inherit_protoLess;
	
	}());
	
	function proto_getProto(mix) {
		if (typeof mix === 'function') {
			return mix.prototype;
		}
		return mix;
	}
	
	var class_inheritStatics = function(_class, mix){
		if (mix == null) {
			return;
		}
		
		if (typeof mix === 'function') {
			for (var key in mix) {
				if (typeof mix[key] === 'function' && mix.hasOwnProperty(key) && _class[key] == null) {
					_class[key] = mix[key];
				}
			}
			return;
		}
		
		if (Array.isArray(mix)) {
			var imax = mix.length,
				i = 0;
			
			// backwards for proper inhertance flow
			while (imax-- !== 0) {
				class_inheritStatics(_class, mix[i++]);
			}
			return;
		}
		
		if (mix.Static) {
			mix = mix.Static;
			for (var key in mix) {
				if (mix.hasOwnProperty(key) && _class[key] == null) {
					_class[key] = mix[key];
				}
			}
			return;
		}
	};
	
	function class_extendProtoObjects(proto, _base, _extends){
		var key,
			protoValue;
			
		for (key in proto) {
			protoValue = proto[key];
			
			if (!obj_isRawObject(protoValue))
				continue;
			
			if (_base != null){
				if (obj_isRawObject(_base.prototype[key])) 
					obj_defaults(protoValue, _base.prototype[key]);
			}
			
			if (_extends != null) {
				arr_each(_extends, function(x){
					x = proto_getProto(x);
					
					if (obj_isRawObject(x[key])) 
						obj_defaults(protoValue, x[key]);
				});
			}
		}
	}
	// end:source ../src/util/proto.js
	// source ../src/util/json.js
	var JSONHelper = (function() {
		
		var _date_toJSON = Date.prototype.toJSON,
			_skipped;
		
		return {
			skipToJSON: function(toJSON){
				_skipped && console.error('@TODO: Not implemented: only one skipped value allowed');
				_skipped = toJSON;
			},
			// Create from Complex Class Instance a lightweight json object 
			toJSON: function() {
				var obj = {},
					key, val;
	
				for (key in this) {
	
					// _ (private)
					if (key.charCodeAt(0) === 95)
						continue;
	
					if ('Static' === key || 'Validate' === key)
						continue;
	
					val = this[key];
	
					if (val == null)
						continue;
	
					switch (typeof val) {
						case 'function':
							continue;
						case 'object':
							var toJSON = val.toJSON;
							
							if (toJSON === _date_toJSON) {
								// do not serialize Date
								break;
							}
							
							if (toJSON === _skipped) {
								// skip to json - @TODO quick hack to skip MongoDB.ObjectID
								break;
							}
							
							if (is_Function(toJSON)) {
								obj[key] = val.toJSON();
								continue;
							}
					}
	
					obj[key] = val;
				}
	
				// make mongodb's _id property not private
				if (this._id != null)
					obj._id = this._id;
	
				return obj;
			},
	
			arrayToJSON: function() {
				var array = new Array(this.length),
					i = 0,
					imax = this.length,
					x;
	
				for (; i < imax; i++) {
	
					x = this[i];
	
					if (typeof x !== 'object') {
						array[i] = x;
						return;
					}
	
					array[i] = is_Function(x.toJSON)
						? x.toJSON()
						: JSONHelper.toJSON.call(x)
						;
	
				}
	
				return array;
			}
		};
	
	}());
	// end:source ../src/util/json.js
	// source ../src/util/object.js
	function obj_inherit(target /* source, ..*/ ) {
		if (typeof target === 'function') {
			target = target.prototype;
		}
		var i = 1,
			imax = arguments.length,
			source, key;
		for (; i < imax; i++) {
	
			source = typeof arguments[i] === 'function' ? arguments[i].prototype : arguments[i];
	
			for (key in source) {
				
				if ('Static' === key) {
					if (target.Static != null) {
						
						for (key in source.Static) {
							target.Static[key] = source.Static[key];
						}
						
						continue;
					}
				}
				
				
				target[key] = source[key];
				
			}
		}
		return target;
	}
	
	
	
	function obj_getProperty(obj, property) {
		var chain = property.split('.'),
			length = chain.length,
			i = 0;
		for (; i < length; i++) {
			if (obj == null) {
				return null;
			}
	
			obj = obj[chain[i]];
		}
		return obj;
	}
	
	
	function obj_setProperty(obj, property, value) {
		var chain = property.split('.'),
			length = chain.length,
			i = 0,
			key = null;
	
		for (; i < length - 1; i++) {
			key = chain[i];
			if (obj[key] == null) {
				obj[key] = {};
			}
			obj = obj[key];
		}
	
		obj[chain[i]] = value;
	}
	
	function obj_isRawObject(value) {
		if (value == null) 
			return false;
		
		if (typeof value !== 'object')
			return false;
		
		return value.constructor === Object;
	}
	
	function obj_defaults(value, _defaults) {
		for (var key in _defaults) {
			if (value[key] == null) {
				value[key] = _defaults[key];
			}
		}
		return value;
	}
	
	function obj_extend(target, source) {
		for (var key in source) {
			if (source[key]) 
				target[key] = source[key];
			
		}
		return target;
	}
	
	
	function obj_isNullOrGlobal(ctx){
		return ctx === void 0 || ctx === global;
	}
	// end:source ../src/util/object.js
	// source ../src/util/function.js
	function fn_proxy(fn, ctx) {
	
		return function() {
			return fn_apply(fn, ctx, arguments);
		};
	}
	
	function fn_apply(fn, ctx, _arguments){
		
		switch (_arguments.length) {
			case 0:
				return fn.call(ctx);
			case 1:
				return fn.call(ctx, _arguments[0]);
			case 2:
				return fn.call(ctx,
					_arguments[0],
					_arguments[1]);
			case 3:
				return fn.call(ctx,
					_arguments[0],
					_arguments[1],
					_arguments[2]);
			case 4:
				return fn.call(ctx,
					_arguments[0],
					_arguments[1],
					_arguments[2],
					_arguments[3]);
			case 5:
				return fn.call(ctx,
					_arguments[0],
					_arguments[1],
					_arguments[2],
					_arguments[3],
					_arguments[4]
					);
		};
		
		return fn.apply(ctx, _arguments);
	}
	
	function fn_isFunction(fn){
		return typeof fn === 'function';
	}
	
	function fn_createDelegate(fn /* args */) {
		var args = _Array_slice.call(arguments, 1);
		return function(){
			if (arguments.length > 0) 
				args = args.concat(_Array_slice.call(arguments));
			
			return fn_apply(fn, null, args);
		};
	}
	// end:source ../src/util/function.js
	
	
	
	// source ../src/business/Serializable.js
	function Serializable(data) {
		
		if (this === Class || this == null || this === global) {
			
			var Ctor = function(data){
				Serializable.call(this, data);
			};
			
			Ctor.prototype._props = data;
			
			//- 
			//obj_extend(Ctor.prototype, Serializable.prototype);
			
			return Ctor;
		}
		
		if (data != null) {
			
			if (this.deserialize) 
				this.deserialize(data);
			else
				Serializable.deserialize(this, data);
			
		}
		
	}
	
	Serializable.serialize = function(instance) {
			
		if (is_Function(instance.toJSON)) 
			return instance.toJSON();
		
		
		return JSONHelper.toJSON.call(instance);
	};
	
	Serializable.deserialize = function(instance, json) {
			
		if (is_String(json)) {
			try {
				json = JSON.parse(json);
			}catch(error){
				console.error('<json:deserialize>', json);
				return instance;
			}
		}
		
		if (is_Array(json) && is_Function(instance.push)) {
			instance.length = 0;
			for (var i = 0, imax = json.length; i < imax; i++){
				instance.push(json[i]);
			}
			return instance;
		}
		
		var props = instance._props,
			key,
			val,
			Mix;
		
		for (key in json) {
			
			val = json[key];
			
			if (props != null) {
				Mix = props[key];
				
				if (Mix != null) {
					
					if (is_Function(Mix)) {
						instance[key] = val instanceof Mix
							? val
							: new Mix(val)
							;
						continue;
					}
					
					var deserialize = Mix.deserialize;
					
					if (is_Function(deserialize)) {
						instance[key] = deserialize(val);
						continue;
					}
					
				}
			}
			
			instance[key] = val;
		}
		
		return instance;
	}
	
	
	
	// end:source ../src/business/Serializable.js
	// source ../src/business/Deferred.js
	function Deferred(){}
	
	Deferred.prototype = {
		_isAsync: true,
			
		_done: null,
		_fail: null,
		_always: null,
		_resolved: null,
		_rejected: null,
		
		defer: function(){
			this._rejected = null;
			this._resolved = null;
		},
		
		resolve: function() {
			this._fail = null;
			this._resolved = arguments;
	
			var _done = this._done,
				_always = this._always,
				
				imax, i;
			
			this._done = null;
			this._always = null;
			
			if (_done != null) {
				imax = _done.length;
				i = -1;
				while ( ++i < imax ) {
					fn_apply(_done[i], this, arguments);
				}
				_done.length = 0;
			}
	
			if (_always != null) {
				imax = _always.length;
				i = -1;
				while ( ++i < imax ) {
					_always[i].call(this, this);
				}
			}
	
			return this;
		},
		
		reject: function() {
			this._done = null;
			this._rejected = arguments;
			
			var _fail = this._fail,
				_always = this._always,
				imax, i;
			
			this._fail = null;
			this._always = null;
	
			if (_fail != null) {
				imax = _fail.length;
				i = -1;
				while ( ++i < imax ) {
					fn_apply(_fail[i], this, arguments);
				}
			}
	
			if (_always != null) {
				imax = _always.length;
				i = -1;
				while ( ++i < imax ) {
					_always[i].call(this, this);
				}
			}
	
			return this;
		},
		
		resolveDelegate: function(){
			return fn_proxy(this.resolve, this);
		},
		
		rejectDelegate: function(){
			return fn_proxy(this.reject, this);
		},
		
		done: function(callback) {
			if (this._resolved != null)
				fn_apply(callback, this, this._resolved);
			else
				(this._done || (this._done = [])).push(callback);
	
			return this;
		},
		
		fail: function(callback) {
			
			if (this._rejected != null)
				fn_apply(callback, this, this._rejected);
			else
				(this._fail || (this._fail = [])).push(callback);
	
			return this;
		},
		
		always: function(callback) {
		
			if (this._rejected != null || this._resolved != null)
				callback.call(this, this);
			else
				(this._always || (this._always = [])).push(callback);
	
			return this;
		},
	};
	
	// end:source ../src/business/Deferred.js
	// source ../src/business/EventEmitter.js
	var EventEmitter = (function(){
	 
		function Emitter() {
			this._listeners = {};
		}
	 
		
	    Emitter.prototype = {
	        constructor: Emitter,
			
	        on: function(event, callback) {
	            if (callback != null){
					(this._listeners[event] || (this._listeners[event] = [])).push(callback);
				}
				
	            return this;
	        },
	        once: function(event, callback){
				if (callback != null) {
					callback._once = true;
					(this._listeners[event] || (this._listeners[event] = [])).push(callback);
				}
				
	            return this;
	        },
			
			pipe: function(event){
				var that = this,
					args;
				return function(){
					args = _Array_slice.call(arguments);
					args.unshift(event);
					
					fn_apply(that.trigger, that, args);
				};
			},
	        
	        trigger: function() {
	            var args = _Array_slice.call(arguments),
	                event = args.shift(),
	                fns = this._listeners[event],
	                fn, imax, i = 0;
	                
	            if (fns == null)
					return this;
				
				for (imax = fns.length; i < imax; i++) {
					fn = fns[i];
					fn_apply(fn, this, args);
					
					if (fn._once === true){
						fns.splice(i, 1);
						i--;
						imax--;
					}
				}
			
	            return this;
	        },
	        off: function(event, callback) {
				var listeners = this._listeners[event];
	            if (listeners == null)
					return this;
				
				if (arguments.length === 1) {
					listeners.length = 0;
					return this;
				}
				
				var imax = listeners.length,
					i = -1;
					
				while (++i < imax) {
					
					if (listeners[i] === callback) {
						
						listeners.splice(i, 1);
						i--;
						imax--;
					}
					
				}
			
	            return this;
			}
	    };
	    
	    return Emitter;
	    
	}());
	
	// end:source ../src/business/EventEmitter.js
	// source ../src/business/Validation.js
	var Validation = (function(){
		
		
		function val_check(instance, validation, props) {
			if (is_Function(validation)) 
				return validation.call(instance);
			
			var result,
				property;
			
			if (props) {
				for (var i = 0, imax = props.length; i < imax; i++){
					
					property = props[i];
					result = val_checkProperty(instance, property, validation[property]);
					
					if (result) 
						return result;
				}
				
				return;
			}
			
			for (property in validation) {
				
				result = val_checkProperty(instance, property, validation[property]);
				
				if (result)
					return result;
			}
		}
		
		
		function val_checkProperty(instance, property, checker) {
			
			if (is_Function(checker) === false) 
				return '<validation> Function expected for ' + property;
			
			
			var value = obj_getProperty(instance, property);
			
			return checker.call(instance, value);
		}
		
		
		function val_process(instance /* ... properties */) {
			var result,
				props;
			
			if (arguments.length > 1 && typeof arguments[1] === 'string') {
				props = _Array_slice.call(arguments, 1);
			}
			
			if (instance.Validate != null) {
				result  = val_check(instance, instance.Validate, props);
				if (result)
					return result;
			}
			
			// @TODO Do nest recursion check ?
			//
			//for (var key in instance) {
			//	if (instance[key] == null || typeof instance !== 'object' ) 
			//		continue;
			//	
			//	result = val_process(instance, instance[key].Validate)
			//}
			
		}
		
		return {
			validate: val_process
		};
		
	}());
	// end:source ../src/business/Validation.js
	
	// source ../src/Class.js
	var Class = function(data) {
		var _base = data.Base,
			_extends = data.Extends,
			_static = data.Static,
			_construct = data.Construct,
			_class = null,
			_store = data.Store,
			_self = data.Self,
			_overrides = data.Override,
			
			key;
	
		if (_base != null) {
			delete data.Base;
		}
		if (_extends != null) {
			delete data.Extends;
		}
		if (_static != null) {
			delete data.Static;
		}
		if (_self != null) {
			delete data.Self;
		}
		if (_construct != null) {
			delete data.Construct;
		}
		
		if (_store != null) {
			
			if (_extends == null) {
				_extends = _store;
			} else if (is_Array(_extends)) {
				_extends.unshift(_store)
			} else {
				_extends = [_store, _extends];
			}
			
			delete data.Store;
		}
		
		if (_overrides != null) {
			delete data.Override;
		}
		
		if (data.toJSON === void 0) {
			data.toJSON = JSONHelper.toJSON;
		}
	
	
		if (_base == null && _extends == null && _self == null) {
			if (_construct == null) {
				_class = function() {};
			} else {
				_class = _construct;
			}
	
			data.constructor = _class.prototype.constructor;
	
			if (_static != null) {
				for (key in _static) {
					_class[key] = _static[key];
				}
			}
	
			_class.prototype = data;
			return _class;
	
		}
	
		_class = function() {
			
			//// consider to remove 
			////if (this instanceof _class === false) 
			////	return new (_class.bind.apply(_class, [null].concat(arguments)));
			
		
			if (_extends != null) {
				var isarray = _extends instanceof Array,
					
					imax = isarray ? _extends.length : 1,
					i = 0,
					x = null;
				for (; i < imax; i++) {
					x = isarray
						? _extends[i]
						: _extends
						;
					if (typeof x === 'function') {
						fn_apply(x, this, arguments);
					}
				}
			}
	
			if (_base != null) {
				fn_apply(_base, this, arguments);
			}
			
			if (_self != null && obj_isNullOrGlobal(this) === false) {
				
				for (var key in _self) {
					this[key] = fn_proxy(_self[key], this);
				}
			}
	
			if (_construct != null) {
				var r = fn_apply(_construct, this, arguments);
				if (r != null) {
					return r;
				}
			}
			
			this['super'] = null;
			
			return this;
		};
	
		if (_static != null) {
			for (key in _static) {
				_class[key] = _static[key];
			}
		}
		
		if (_base != null) {
			class_inheritStatics(_class, _base);
		}
		
		if (_extends != null) {
			class_inheritStatics(_class, _extends);
		}
	
		class_extendProtoObjects(data, _base, _extends);
		class_inherit(_class, _base, _extends, data, _overrides);
	
	
		data = null;
		_static = null;
	
		return _class;
	};
	// end:source ../src/Class.js
	
	// source ../src/business/Await.js
	var Await = (function(){
		
		return Class({
			Base: Deferred,
		
			_wait: 0,
			_timeout: null,
			_result: null,
		
			delegate: function(name, errorable) {
				return await_createDelegate(this, name, errorable);
			},
		
			deferred: function(name) {
				
				var dfr = new Deferred,
					delegate = await_createDelegate(this, name, true),
					
					args
					;
				
				return dfr
					.done(function(){
						args = _Array_slice.call(arguments);
						args.unshift(null);
						
						delegate.apply(null, args);
					})
					.fail(function(error){
						
						delegate(error);
					})
					;
			},
		
			Static: {
		
				TIMEOUT: 2000
			}
		});
	
		
		function await_createDelegate(await, name, errorable){
			if (errorable == null) 
				errorable = true;
			
			if (await._timeout)
				clearTimeout(await._timeout);
	
			await.defer();
			await._wait++;
	
			if (name){
				if (!await._result)
					await._result = {};
				
				if (name in await._result) 
					console.warn('<await>', name, 'already awaiting');
				
				await._result[name] = null;
			}
			
			var delegate = fn_createDelegate(await_listener, await, name, errorable)
				;
	
			await._timeout = setTimeout(delegate, Await.TIMEOUT);
	
			return delegate;
		}
		
		function await_listener(await, name, errorable /* .. args */ ) {
			
			if (arguments.length === 0) {
				// timeout
				await._wait = 0;
				await.reject('408: Timeout');
				return;
			}
			
			if (await._wait === 0) 
				return;
			
			var result = await._result;
			
			if (name) {
				var args = _Array_slice.call(arguments, 3);
				
				result[name] = {
					error: errorable ? args.shift() : null,
					arguments: args
				};
			} else if (errorable && arguments[3] != null) {
				
				if (result == null) 
					result = await._result = {};
				
				result.__error = arguments[3];
			}
			
			if (--await._wait === 0) {
				clearTimeout(await._timeout);
				
				var error = result && result.__error
					;
				var val,
					key;
				
				if (error == null) {
					for(key in result){
						
						val = result[key];
						error = val && val.error;
						
						if (error) 
							break;
					}
				}
				
				if (error) {
					await.reject(error, result);
					return;
				}
				
				await.resolve(result);
			}
		}
	
	}());
	// end:source ../src/business/Await.js

	// source ../src/Class.Static.js
	/**
	 * Can be used in Constructor for binding class's functions to class's context
	 * for using, for example, as callbacks
	 *
	 * @obsolete - use 'Self' property instead
	 */
	Class.bind = function(cntx) {
		var arr = arguments,
			i = 1,
			length = arguments.length,
			key;
	
		for (; i < length; i++) {
			key = arr[i];
			cntx[key] = cntx[key].bind(cntx);
		}
		return cntx;
	};
	
	
	Class.Serializable = Serializable;
	Class.Deferred = Deferred;
	Class.EventEmitter = EventEmitter;
	Class.Await = Await;
	Class.validate = Validation.validate;
	// end:source ../src/Class.Static.js
	
	// source ../src/collection/Collection.js
	Class.Collection = (function(){
		
		// source ArrayProto.js
		
		var ArrayProto = (function(){
		
			function check(x, mix) {
				if (mix == null)
					return false;
				
				if (typeof mix === 'function') 
					return mix(x);
				
				if (typeof mix === 'object'){
					
					if (x.constructor === mix.constructor && x.constructor !== Object) {
						return x === mix;
					}
					
					var value, matcher;
					for (var key in mix) {
						
						value = x[key];
						matcher = mix[key];
						
						if (typeof matcher === 'string') {
							var c = matcher[0],
								index = 1;
							
							if ('<' === c || '>' === c){
								
								if ('=' === matcher[1]){
									c +='=';
									index++;
								}
								
								matcher = matcher.substring(index);
								
								switch (c) {
									case '<':
										if (value >= matcher)
											return false;
										continue;
									case '<=':
										if (value > matcher)
											return false;
										continue;
									case '>':
										if (value <= matcher)
											return false;
										continue;
									case '>=':
										if (value < matcher)
											return false;
										continue;
								}
							}
						}
						
						// eqeq to match by type diffs.
						if (value != matcher) 
							return false;
						
					}
					return true;
				}
				
				console.warn('No valid matcher', mix);
				return false;
			}
		
			var ArrayProto = {
				length: 0,
				push: function(/*mix*/) { 
					for (var i = 0, imax = arguments.length; i < imax; i++){
						
						this[this.length++] = create(this._ctor, arguments[i]);
					}
					
					return this;
				},
				pop: function() {
					var instance = this[--this.length];
			
					this[this.length] = null;
					return instance;
				},
				shift: function(){
					if (this.length === 0) 
						return null;
					
					
					var first = this[0],
						imax = this.length - 1,
						i = 0;
					
					for (; i < imax; i++){
						this[i] = this[i + 1];
					}
					
					this[imax] = null;
					this.length--;
					
					return first;
				},
				unshift: function(mix){
					this.length++;
					
					var imax = this.length;
					
					while (--imax) {
						this[imax] = this[imax - 1];
					}
					
					this[0] = create(this._ctor, mix);
					return this;
				},
				
				splice: function(index, count /* args */){
					
					var length = this.length;
					var i, imax, y;
					
					// clear range after length until index
					if (index >= length) {
						count = 0;
						for (i = length, imax = index; i < imax; i++){
							this[i] = void 0;
						}
					}
					
					var	rm_count = count,
						rm_start = index,
						rm_end = index + rm_count,
						add_count = arguments.length - 2,
						
						new_length = length + add_count - rm_count;
					
					
					// move block
					
					var block_start = rm_end,
						block_end = length,
						block_shift = new_length - length;
					
					if (0 < block_shift) {
						// move forward
						
						i = block_end;
						while (--i >= block_start) {
							
							this[i + block_shift] = this[i];
							
						}
		
					}
					
					if (0 > block_shift) {
						// move backwards
						
						i = block_start;				
						while (i < block_end) {
							this[i + block_shift] = this[i];
							i++;
						}
					}
					
					// insert
					
					i = rm_start;
					y = 2;
					for (; y < arguments.length; y) {
						this[i++] = create(this._ctor, arguments[y++]);
					}
					
					
					this.length = new_length;
					return this;
				},
				
				slice: function(){
					return fn_apply(_Array_slice, this, arguments);
				},
				
				sort: function(fn){
					_Array_sort.call(this, fn);
					return this;
				},
				
				reverse: function(){
					var array = _Array_slice.call(this),
						imax = this.length,
						i = -1
						;
					while( ++i < imax) {
						this[i] = array[imax - i - 1];
					}
					return this;
				},
				
				toString: function(){
					return _Array_slice.call(this, 0).toString()
				},
				
				each: function(fn, ctx){
					var imax = this.length,
						i = -1
						;
					while( ++i < imax ) {
						
						fn.call(ctx || this, this[i], i);
					}
		            return this;
				},
				
				
				where: function(mix){
					
					var collection = new this.constructor();
					
					for (var i = 0, x, imax = this.length; i < imax; i++){
						x = this[i];
						
						if (check(x, mix)) {
							collection[collection.length++] = x;
						}
					}
					
					return collection;
				},
				remove: function(mix){
					var index = -1,
						array = [];
					for (var i = 0, imax = this.length; i < imax; i++){
						
						if (check(this[i], mix)) {
							array.push(this[i]);
							continue;
						}
						
						this[++index] = this[i];
					}
					for (i = ++index; i < imax; i++) {
						this[i] = null;
					}
					
					this.length = index;
					return array;
				},
				first: function(mix){
					if (mix == null)
						return this[0];
					
					var i = this.indexOf(mix);
					return i !== -1
						? this[i]
						: null;
						
				},
				last: function(mix){
					if (mix == null)
						return this[this.length - 1];
					
					var i = this.lastIndexOf(mix);
					return i !== -1
						? this[i]
						: null;
				},
				indexOf: function(mix, index){
					if (mix == null)
						return -1;
					
					if (index != null) {
						if (index < 0) 
							index = 0;
							
						if (index >= this.length) 
							return -1;
						
					}
					else{
						index = 0;
					}
					
					
					var imax = this.length;
					for(; index < imax; index++) {
						if (check(this[index], mix))
							return index;
					}
					return -1;
				},
				lastIndexOf: function(mix, index){
					if (mix == null)
						return -1;
					
					if (index != null) {
						if (index >= this.length) 
							index = this.length - 1;
						
						if (index < 0) 
							return -1;
					}
					else {
						index = this.length - 1;
					}
					
					
					for (; index > -1; index--) {
						if (check(this[index], mix))
							return index;
					}
					
					return -1;
				}
			};
			
			
			return ArrayProto;
		}());
		
		// end:source ArrayProto.js
		
		function create(Constructor, mix) {
			
			if (mix instanceof Constructor) 
				return mix;
			
			return new Constructor(mix);
		}
		
		var CollectionProto = {
			toArray: function(){
				var array = new Array(this.length);
				for (var i = 0, imax = this.length; i < imax; i++){
					array[i] = this[i];
				}
				
				return array;
			},
			
			toJSON: JSONHelper.arrayToJSON
		};
		
		//////function overrideConstructor(baseConstructor, Child) {
		//////	
		//////	return function CollectionConstructor(){
		//////		this.length = 0;
		//////		this._constructor = Child;
		//////		
		//////		if (baseConstructor != null)
		//////			return baseConstructor.apply(this, arguments);
		//////		
		//////		return this;
		//////	};
		//////	
		//////}
		
		function Collection(Child, Proto) {
			
			//////Proto.Construct = overrideConstructor(Proto.Construct, Child);
			
			Proto._ctor = Child;
			
			
			obj_inherit(Proto, CollectionProto, ArrayProto);
			return Class(Proto);
		}
		
		
		return Collection;
	}());
	// end:source ../src/collection/Collection.js
	
	// source ../src/fn/fn.js
	(function(){
		
		// source memoize.js
		
		
		function args_match(a, b) {
			if (a.length !== b.length) 
				return false;
			
			var imax = a.length,
				i = 0;
			
			for (; i < imax; i++){
				if (a[i] !== b[i])
					return false;
			}
			
			return true;
		}
		
		function args_id(store, args) {
		
			if (args.length === 0)
				return 0;
		
			
			for (var i = 0, imax = store.length; i < imax; i++) {
				
				if (args_match(store[i], args))
					return i + 1;
			}
			
			store.push(args);
			return store.length;
		}
		
		
		function fn_memoize(fn) {
		
			var _cache = {},
				_args = [];
				
			return function() {
		
				var id = args_id(_args, arguments);
		
				
				return _cache[id] == null
					? (_cache[id] = fn_apply(fn, this, arguments))
					: _cache[id];
			};
		}
		
		
		function fn_resolveDelegate(cache, cbs, id) {
			
			return function(){
				cache[id] = arguments;
				
				for (var i = 0, x, imax = cbs[id].length; i < imax; i++){
					x = cbs[id][i];
					fn_apply(x, this, arguments);
				}
				
				cbs[i] = null;
				cache = null;
				cbs = null;
			};
		}
		
		function fn_memoizeAsync(fn) {
			var _cache = {},
				_cacheCbs = {},
				_args = [];
				
			return function(){
				
				var args = _Array_slice.call(arguments),
					callback = args.pop();
				
				var id = args_id(_args, args);
				
				if (_cache[id]){
					fn_apply(callback, this, _cache[id])
					return; 
				}
				
				if (_cacheCbs[id]) {
					_cacheCbs[id].push(callback);
					return;
				}
				
				_cacheCbs[id] = [callback];
				
				args = _Array_slice.call(args);
				args.push(fn_resolveDelegate(_cache, _cacheCbs, id));
				
				fn_apply(fn, this, args);
			};
		}
		
			
			
		
		// end:source memoize.js
		
		Class.Fn = {
			memoize: fn_memoize,
			memoizeAsync: fn_memoizeAsync
		};
		
	}());
	// end:source ../src/fn/fn.js
	
	exports.Class = Class;
	
}));
// end:source /vendor/class.js

// source Connection.js
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
// end:source Connection.js

// source scope.js
var __chrome = chrome,
	__runtime = chrome.runtime,
    __connections = new (Class.Collection(Connection, {}))
	;

var __Array_slice = Array.prototype.slice;
// end:source scope.js

// source ../utils/fn.js
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

// end:source ../utils/fn.js

// source installed.js

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
// end:source installed.js

// source chrome.js
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
// end:source chrome.js
// source contextMenu.js

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
// end:source contextMenu.js
// source communication/runtime.js


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
// end:source communication/runtime.js
// source communication/devTools.js



__runtime
	.onConnect
	.addListener(function(devToolsConnection, sender) {
	
		__connections.push({
			connection: devToolsConnection
		});
		
	});
// end:source communication/devTools.js
// source content-script/actions.js

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

// end:source content-script/actions.js
