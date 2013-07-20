module.exports = function(grunt) {

// Project configuration.
	grunt.initConfig({

		jshint: {
			all: ['Gruntfile.js', 'Chrome/js/**/*.js']
		},
		watch: {
			scripts: {
				files: ['Chrome/js/**/*.js'],
				tasks: ['jshint'],
				options: {
					spawn: false
				}
			}
		}
	});

	// Load the plugin.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task(s).
	grunt.registerTask('default', ['watch']);

};

