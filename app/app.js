(function (){

    var app = angular.module('app', ['ngRoute', 'ui.bootstrap', 'user.register','dashboard', 'games', 'teams', 'shared.components']);

    app.constant('API_URL', 'http://localhost/team/api/index.php/v1');

    app.config(['$routeProvider', function($routeProvider) {
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
                    templateUrl: "app/components/register/login.html",
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
    }]);

    app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    }]);

    app.factory('authInterceptor', ['API_URL', 'authService', '$location', '$q', function (API_URL, authService, $location, $q) {
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
    }]);

    app.service('authService', ['$window', function ($window) {
        var self = this;

        var parsedToken = null;

        self.saveToken = function(token) {
            $window.localStorage['token'] = token;
        }

        self.getToken = function() {
            return $window.localStorage['token'];
        }

        self.isAuthed = function() {
            var token = self.getToken();
            if(!token) {
                return false;
            }

            var params = self.parseToken(token);
            return Math.round(new Date().getTime() / 1000) <= params.exp;
        }

        self.logout = function() {
            $window.localStorage.removeItem('token');
            parsedToken = null;
        }

        self.parseToken = function(token) {
            if(parsedToken === null){
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace('-', '+').replace('_', '/');
                parsedToken = JSON.parse($window.atob(base64));
            }

            return parsedToken;
        }

        self.getPlayerId = function () {
            if(parsedToken === null) {
                return 0;
            }

            return parsedToken.uid || 0;
        }

        self.getPlayerMail = function () {
            return parsedToken.mail || '';
        }
    }]);

    app.service('userService', ['$http', 'API_URL', function ($http, API_URL) {
        var self = this;

        self.register = function(data) {
            return $http.post(API_URL + '/players', data)
        }

        self.login = function(email, password, rememberMe) {
            return $http.post(API_URL + '/auth/login', {
                email: email,
                password: password,
                rememberMe: rememberMe
            })
        };
    }]);

    app.directive('sportIcon', function(){
        return {
            restrict: "E",
            scope: {},
            template: '<img ng-src="assets/img/{{sport}}.gif" width="{{size}}px" height="{{size}}px" align="top">',
            link: function (scope, elem, attr){
                scope.sport = attr.sport;
                scope.size = attr.size || 17;
            }

        }
    });

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

})();