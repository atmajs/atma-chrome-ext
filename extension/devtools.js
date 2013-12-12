

var panels = chrome.devtools.panels;



panels.create(
	'Atma.js',
	null, // No icon path
	'panel.html',
	function(pane){
		
		//-var button = pane.createStatusBarButton('/image/statusbar.png', 'test', true);
		
		var _window;
		
		
		pane
			.onShown
			.addListener(function(window){
				
				_window = window;
			});
		
		
		pane
			.onSearch
			.addListener(function(action, query, done){
				
				_window.doSearch(action, query);
				
				return 5;
			});
	});


panels.elements.createSidebarPane(
	"Mask: Element", function(sidebar) {
	
	sidebar
		.onShown
		.addListener(updateElement)
		;
	
	panels
		.elements
		.onSelectionChanged
		.addListener(updateElement)
		;
		
	function updateElement() {
			
		sidebar.setExpression("(" + getElementsInfo.toString() + ")()", 'Model & Component');
	}
});


function getElementsInfo() {
	
	var mask = window.mask || (window.atma && window.atma.mask),
		domLib = window.$ || window.jQuery || window.Zepto
		;
	
	if (mask == null || domLib == null || !$0) 
		return null;
	
	var $el = domLib($0),
		compo = $el.compo()
		;
	
	window.$c = compo;
		
	return  compo == null
		? '<No Component>'
		: compo
		;
	
	
};