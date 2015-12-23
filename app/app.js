angular

    .module('app', ['ngRoute', 'ui.bootstrap'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when("/",
                {templateUrl: "app/components/intro/intro.html"}
            )
            .when("/register",
                {
                    templateUrl: "app/components/register/register.html",
                    controller: "RegisterCtrl",
                    resolve: {check: checkIsGuest}
                }
            )
            .when("/login",
                {
                    templateUrl: "app/components/login/login.html",
                    controller: "LoginCtrl",
                    resolve: {check: checkIsGuest}
                }
            )
            .when("/logout",
                {
                    template: "",
                    controller: "LogoutCtrl"
                }
            )
            .when("/dashboard",
                {
                    templateUrl: "app/components/dashboard/dashboard.html",
                    resolve: {check: checkPersmission}
                }
            )
            .when("/teams",
                {
                    templateUrl: "app/components/teams/teams.html",
                    controller: "TeamsCtrl",
                    resolve: {check: checkPersmission}
                }
            )
            .when("/games",
                {
                    templateUrl: "app/components/games/games.html",
                    resolve: {check: checkPersmission}
                }
            )
            .otherwise(
                {redirectTo: "/"}
            );
    }])
    .factory('authInterceptor', authInterceptor)
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    }]);

function checkPersmission($location, authService){
    if(!authService.isAuthed()) {
        $location.path("/login").replace();
    }
}

function checkIsGuest($location, authService){
    if(authService.isAuthed()) {
        $location.path("/dashboard").replace();
    }
}

function authInterceptor(API_URL, authService) {
    return {
        // automatically attach Authorization header
        request: function(config) {
            var token = authService.getToken();
            if(config.url.indexOf(API_URL) === 0 && token) {
                config.headers.Authorization = 'Bearer ' + token;
            }

            return config;
        },

        // If a token was sent back, save it
        response: function(res) {
            if(res.config.url.indexOf(API_URL) === 0 && res.data.token) {
                authService.saveToken(res.data.token);
            }

            return res;
        }
    }
}