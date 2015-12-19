module.exports = function(config){
    config.set({

        basePath : './',

        files : [
            'assets/libs/angular/angular_1.4.js',
            'assets/libs/angular/angular_route_1.4.js',
            'assets/libs/angular/angular_mock_1.4.js',
            'app/app.js',
            'app/*.js',
            'app/shared/header/*.js',
            'app/components/login/*.js',
            'app/components/logout/*.js',
            'app/components/register/*.js'
        ],

        autoWatch : true,

        frameworks: ['jasmine'],

        browsers : ['Chrome'],

        plugins : [
            'karma-chrome-launcher',
            'karma-jasmine'
            //'karma-junit-reporter'
        ]

        /*reporters: ['progress', 'junit'],

        junitReporter : {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }*/

    });
};