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
				files: [
					'src/js/**/*.js',
					'test/tests/**/*.js'
				],
				tasks: ['jshint', 'mocha_phantomjs'],
				options: {
					spawn: false
				}
			},
			coffee: {
				files: [
					'src/coffee/**/*.coffee'
				],
				tasks: ['coffee:src']
			},
			coffeeTest: {
				files: [
					'tests/coffee/**/*.coffee'
				],
				tasks: ['coffee:test']
			}
		},
		coffee: {
			src: {
				expand: true,
				flatten: true,
				cwd: 'src/coffee/',
				src: ['*.coffee'],
				dest: 'src/js/',
				ext: '.js'
			},
//			src: {
//				files: {
//					'src/js/*.js': 'src/coffee/**/*.coffee'
//				}
//			},
			test: {
				files: {
					'tests/*.js': 'tests/coffee/**/*.coffee'
				}
			}
		},
		crx: {
			package: {
				"src": "src/",
				"dest": "dist/crx/"
			}
		},
		mocha_phantomjs: {
			all: ['test/**/*.html']
		}
	});

	// Load the plugin.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-crx');
	grunt.loadNpmTasks('grunt-mocha-phantomjs');
	grunt.loadNpmTasks('grunt-contrib-coffee');

	// Default task(s).
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('build', ['mocha_phantomjs', 'crx']);

};

