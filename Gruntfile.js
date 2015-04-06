module.exports = function(grunt) {
    grunt.initConfig({
        babel: {
            options: {
                experimental: true,
                compact: false,
                modules: "amd"
            },
            scripts: {
                files: [{
                    expand: true,
                    cwd: "src/",
                    dest: "build/",
                    ext: ".c.js",
                    extDot: "last",
                    src: ["**/*.js"]
                }]
            }
        },
        uglify: {
            minify: {
                options: {
                    beautify: false,
                    compress: {
                        sequences: true,
                        properties: true,
                        dead_code: true,
                        drop_debugger: true,
                        conditionals: true,
                        comparisons: true,
                        evaluate: true,
                        booleans: true,
                        loops: true,
                        unused: true,
                        hoist_funs: true,
                        if_return: true,
                        join_vars: true,
                        cascade: true,
                        negate_iife: true,
                    },
                    mangle: false
                },
                files: [{
                    expand: true,
                    cwd: "build/",
                    dest: "build/",
                    ext: ".min.js",
                    extDot: "last",
                    src: ["**/*.c.js"]
                }]
            },
            beautify: {
                options: {
                    beautify: {
                        beautify: true,
                        width: 200,
                        space_colon: false
                    },
                    compress: false,
                    screw_ie8: true,
                    mangle: false
                },
                files: [{
                    expand: true,
                    cwd: "build/",
                    dest: "build/",
                    src: ["**/*.c.js"]
                }]
            }
        },
        less: {
            compile: {
                options: {
                    ieCompat: false
                },
                files: [{
                    expand: true,
                    cwd: "src/",
                    dest: "build/",
                    ext: ".css",
                    extDot: "last",
                    src: ["**/*.less"]
                }]
            }
        },
        cssmin: {
            minify: {
                files: [{
                    expand: true,
                    cwd: "build/",
                    dest: "build/",
                    ext: ".min.css",
                    extDot: "last",
                    src: ["**/*.css", "!**/*.min.css"]
                }]
            }
        },
        htmlmin: {
            minify: {
                options: {
                    removeComments: true,
                    useShortDoctype: true,
                    customAttrAssign: [/\?=/g]
                },
                files: [{
                    expand: true,
                    cwd: "src/",
                    dest: "build/",
                    ext: ".min.html",
                    extDot: "last",
                    src: ["**/*.html"]
                }]
            }
        },
        vulcanize: {
            vulcanize: {
                options: {
                    inline: true,
                    strip: true
                },
                files: {
                    "src/external/vulcanized.html": "src/external/polymer.html"
                }
            }
        },
        copy: {
            manifest: {
                files: [{
                    expand: true,
                    cwd: "src/",
                    dest: "build/",
                    src: ["**/*.appcache"]
                }]
            }
        },
        watch: {
            options: {
                atBegin: true
            },
            transpileScripts: {
                files: ["src/**/*.js"],
                tasks: ["babel:scripts"]
            },
            minifyScripts: {
                files: ["build/**/*.c.js"],
                tasks: ["uglify:minify"]
            },
            beautifyScripts: {
                files: ["build/**/*.c.js"],
                tasks: ["uglify:beautify"]
            },
            compileLESS: {
                files: ["src/**/*.less"],
                tasks: ["less:compile"]
            },
            minifyCSS: {
                files: ["build/**/*.css", "!build/**/*.min.css"],
                tasks: ["cssmin:minify"]
            },
            minifyHTML: {
                files: ["src/**/*.html"],
                tasks: ["htmlmin:minify"]
            },
            vulcanizePolymer: {
                files: ["src/app/polymer.html"],
                tasks: ["vulcanize:vulcanizePolymer"]
            },
            copy: {
                files: ["src/**/*.appcache"],
                tasks: ["copy"]
            }
        }
    });
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-babel");
    grunt.loadNpmTasks("grunt-vulcanize");
    grunt.loadNpmTasks("grunt-contrib-htmlmin");
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.registerTask("default", ["watch"]);
    grunt.registerTask("run", ["babel", "uglify", "less", "cssmin", "vulcanize", "htmlmin", "copy"]);
};