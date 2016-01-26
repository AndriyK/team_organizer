exports.config = {

    //specs: ['IndexSpec.js'],

    suites: {
        index: 'IndexSpec.js',
        register: 'RegisterSpec.js',
        all: ['LoginSpec.js', 'DashboardSpec.js', 'GamesSpec.js', 'TeamsSpec.js']
    },

    baseUrl: 'http://localhost/team_organizer/',

    seleniumAddress: 'http://localhost:4444/wd/hub',

    framework: 'jasmine'
};