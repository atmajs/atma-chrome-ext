function css_apply(el, css){
	for(var key in css)
		el.style[key] = css[key];
}