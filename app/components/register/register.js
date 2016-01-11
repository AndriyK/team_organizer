(function (){

    var app = angular.module('user.register', []);

    app.controller('RegisterCtrl', ['$scope', 'userService', 'authService', '$location', function($scope, userService, authService, $location) {

        $scope.register = function() {
            $scope.errors = [];

            userService.register($scope.player)
                .success(
                    function (data) {
                        authService.saveToken(data.token);
                        $location.path('/teams').replace();
                    }
                )
                .error(
                    function (data) {
                        angular.forEach(data, function (error) {
                            $scope.errors.push(error.message);
                        });
                    }
                );
        }
    }]);

    app.controller('LoginCtrl', ['$scope', 'userService', 'authService', '$location', function($scope, userService, authService, $location) {

        $scope.login = function() {
            $scope.errors = [];

            userService.login($scope.user.email, $scope.user.password, $scope.user.rememberMe)
                .success(
                    function (data) {
                        //authService.saveToken(data.token);
                        $location.path('/dashboard').replace();
                    }
                )
                .error(
                    function (data) {
                        angular.forEach(data.errors, function (error) {
                            $scope.errors.push(error);
                        });
                    }
                );
        }
    }]);

    app.controller('LogoutCtrl', ['$location', 'authService', function($location, authService) {
        authService.logout();
        $location.path('/login').replace();
    }]);

})();