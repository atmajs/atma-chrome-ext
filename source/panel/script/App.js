window.App = Compo.createClass({
	template: '#layout',
	compos: {
		elementsView: 'compo: :elementsView'
	},
	
	eval: Page.eval,
	send: Page.sendMessage,
	
	Static: {
		
		initialize: function(mix, model){
			
			var Proto;
			if (typeof mix === 'string') 
				Proto = Compo({ template: mix });
			
			if (Proto == null) {
				Proto = this;
				model = mix;
			}
			
			return Compo.initialize(Proto, model || {}, document.body);
		},
		
		
		build: function(){
			
			if (window.app) 
				window.app.remove();
		
		
			Page.checkAtma(onAtmaChecked);
			
			function onAtmaChecked(has){
				if (has === false) 
					return window.app = App.initialize('#layout-no-atma');
				
				Page.eval(DebugSource.utils, onUtilsInjected);
			}
			
			function onUtilsInjected() {
				
				Page.sendMessage('inject', {
					code: fn_toString(DebugSource.messageProxy)
				}, onProxyInjected);
			}
			
			function onProxyInjected(){
				
				Page.onLoad(onPageLoaded);
			}
			
			function onPageLoaded(has){
				
				
				Page.eval(DebugSource.debug, onDebuggerInjected);
				
			}
			
			function onDebuggerInjected(){
				Page.eval(
					function code_inspected_getTree(){
						
						return __atmaDebugger.getComponents();
					},
					function(tree){
						
						window.app = App.initialize(tree);
					}
				);	
			}
		}
		
	}
})