module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    shell: {
      resetProdDb: {
        command: 'node ' + __dirname + '/dbreset.js production',
        options: {
          stdout: true,
          stderr: true
        }
      },
      resetLocalDb: {
        command: 'node ' + __dirname + '/dbreset.js local',
        options: {
          stdout: true,
          stderr: true
        }
      },
      nodemon: {
        command: 'nodemon server.js',
        options: {
          stdout: true,
          stderr: true
        }
      }
    }
    // uglify: {
    //   options: {
    //     banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
    //   },
    //   build: {
    //     src: 'src/<%= pkg.name %>.js',
    //     dest: 'build/<%= pkg.name %>.min.js'
    //   }
    // }
  });

  // Load the plugin that provides the "uglify" task.
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-shell');

  // Default task(s).
  grunt.registerTask('default', [/*'uglify'*/]);

  grunt.registerTask('deploy', function() {
  });

  grunt.registerTask('build', function() {
  });


  grunt.registerTask('resetProdDb', function() {
    grunt.task.run(['shell:dbreset']);
  });

  grunt.registerTask('local', function() {
    grunt.task.run(['shell:resetLocalDb', 'shell:nodemon']);
  })

};