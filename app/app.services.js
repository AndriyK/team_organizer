angular

    .module('app')

    .service('authService', authService)

    .service('userService', userService);

    function authService($window) {
        var self = this;

        self.saveToken = function(token) {
            $window.localStorage['token'] = token;
        }

        self.getToken = function() {
            return $window.localStorage['token'];
        }

        self.isAuthed = function() {
            var token = self.getToken();
            return !!token;
        }

        self.logout = function() {
            $window.localStorage.removeItem('token');
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