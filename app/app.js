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

function authInterceptor(API_URL, authService, $location, $q) {
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
            if(res.config.url.indexOf(API_URL) === 0) {

                // auth response - token is passed in body
                if(res.data.token){
                    authService.saveToken(res.data.token);
                }

                // in authed requests - token is expected to be returned in headers
                // and may be changed in expire prolongation case
                var token = res.headers('X-Token');
                if(token && authService.getToken() != token){
                    authService.saveToken(token);
                }
            }

            return res;
        },

        responseError: function(res) {
            // process 401 - response - force login page
            if (res.status === 401) {
                authService.logout();
                $location.path('/login').replace();
            }
            return $q.reject(res);
        }
    }
}