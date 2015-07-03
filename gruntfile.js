"use scrict"

module.exports = function(grunt){

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint:{
			jshitrc:'.jshitrc',
			ignores:['/public/libs/'],
			all:['controller/*.js','models/*.js','public/js/*.js','router/*.js','app.js']
		},
		watch:{
			scripts:{
				files:['*.js','**/*.js'],
				tasks:['jshint'],
				options: {
					livereload: true,
				}
			}
		}
	})
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.registerTask('default',['jshint']);
}
