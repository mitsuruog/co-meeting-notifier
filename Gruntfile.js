module.exports = function (grunt) {

// Project configuration.
	grunt.initConfig({
		manifest: grunt.file.readJSON('src/manifest.json'),
		jshint: {
			all: [
				'Gruntfile.js',
				'src/js/**/*.js',
				'!src/js/analytics.js'
			]
		},
		watch: {
			scripts: {
				files: ['src/js/**/*.js'],
				tasks: ['jshint'],
				options: {
					spawn: false
				}
			},
		},
		crx: {
			package: {
				"src": "src/",
				"dest": "dist/crx/"
			}
		}
	});

	// Load the plugin.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-crx');

	// Default task(s).
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('build', ['crx']);

};

