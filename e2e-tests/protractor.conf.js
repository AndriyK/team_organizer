exports.config = {

    //specs: ['IndexSpec.js'],

    suites: {
        index: 'IndexSpec.js',
        register: 'RegisterSpec.js',
        login: 'LoginSpec.js',
        teams: 'TeamsSpec.js',
        games: 'GamesSpec.js',
        dashboard: 'DashboardSpec.js'
    },

    baseUrl: 'http://localhost/team_organizer/',

    seleniumAddress: 'http://localhost:4444/wd/hub',

    framework: 'jasmine'
};