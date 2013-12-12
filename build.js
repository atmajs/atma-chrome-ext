module.exports = {
	'build-source': {
		action: 'shell',
		command: ['cd source && atma && cd ..']
	},

	build: {
		file: "source/panel.html",
		outputMain: "../extension/panel.html",
		outputSources: "../extension/src/",
		includejsFile: "globals.js",
		minify: true,
		
		uglify: {},
		
		defines: {
			DEBUG: true
		}
	},

	copy: {
		files: {
			'source/devtools.html': 'extension/devtools.html',
			'source/devtools.js': 'extension/devtools.js',
			'source/manifest.json': 'extension/manifest.json',
			'source/lib/background.js': 'extension/lib/background.js',
			'source/image/**': 'extension/image/'
		}
	},
	
	zip: {
		action: 'custom',
		script: {
			process: function(){
				var AdmZip = require('adm-zip'),
					zip = new AdmZip,
					dir = new io.Directory('extension/')
					;
				
				zip.addLocalFolder(dir.uri.toLocalDir());
				zip.writeZip('atma-ext.zip');
			}
		}
	}
};