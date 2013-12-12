module.exports = {
	'import': {
			files: [
				'src/background/background.js',
				'src/debugger/debugger.js'
			],
			output: 'lib/'
	},

	build: {
		file: "panel.html",
		outputMain: "build/panel.html",
		outputSources: "build/",
		minify: true,
		/** UglifyJS compressor settings */
		uglify: {},
		/** is used in UglifJS:def_globals and in conditional comment derectives */
		defines: {
			DEBUG: false
		}
	},
	
	defaults: ['import']
}