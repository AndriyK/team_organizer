angular

    .module('app')

    .service('authService', authService)

    .service('userService', userService);

    function authService($window) {
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
            return parsedToken.uid || 0;
        }

        self.getPlayerMail = function () {
            return parsedToken.mail || '';
        }
    }

    function userService($http, API_URL) {
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
    }