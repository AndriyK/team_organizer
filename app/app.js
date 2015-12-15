var app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when("/",
            {templateUrl: "views/intro.html"}
        )
        .when("/register",
            {templateUrl: "views/register.html", controller: "RegisterCtrl"}
        )
        .when("/login",
            {templateUrl: "views/login.html", controller: "LoginCtrl"}
        )
        .when("/logout",
            {template: "", controller: "LogoutCtrl"}
        )
        .when("/player",
            {templateUrl: "views/player.html"}
        )
        .otherwise(
            {redirectTo: "/"}
        );
}]);

app.constant('API', 'http://localhost/team/api/index.php/v1');

app.service('auth', authService);
app.service('user', userService);

function authService($window) {
    var self = this;

    // Add JWT methods here
    self.parseJwt = function(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse($window.atob(base64));
    }

    self.saveToken = function(token) {
        $window.localStorage['token'] = token;
    }

    self.getToken = function() {
        return $window.localStorage['token'];
    }

    self.isAuthed = function() {
        var token = self.getToken();
        if(token) {
            //var params = self.parseJwt(token);
            //return Math.round(new Date().getTime() / 1000) <= params.exp;
            return true;
        }
        return false;
    }

    self.logout = function() {
        $window.localStorage.removeItem('token');
    }
}

function userService($http, API) {
    var self = this;

    // add authentication methods here
    self.register = function(data) {
        return $http.post(API + '/players', data)
    }

    self.login = function(email, password, rememberMe) {
        return $http.post(API + '/auth/login', {
            email: email,
            password: password,
            rememberMe: rememberMe
        })
    };

}