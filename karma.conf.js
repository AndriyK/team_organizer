module.exports = function(config){
    config.set({

        basePath : './',

        files : [
            'app/js_lib/angular_1.4.js',
            'app/js_lib/angular_route_1.4.js',
            'app/js_lib/angular_mock_1.4.js',
            'app/*.js',
            'app/_partials/*.js'
        ],

        autoWatch : true,

        frameworks: ['jasmine'],

        browsers : ['Chrome'],

        plugins : [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
        ],

        junitReporter : {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }

    });
};