module.exports = function(config){
    config.set({

        basePath : './',

        files : [
            'assets/libs/angular/angular_1.4.js',
            'assets/libs/angular/angular_route_1.4.js',
            'assets/libs/angular/angular_mock_1.4.js',
            'assets/libs/angular/ui-bootstrap.js',
            'app/*.js',
            'app/shared/*.js',
            'app/components/register/*.js',
            'app/components/dashboard/*.js',
            'app/components/teams/*.js',
            'app/components/games/*.js'
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