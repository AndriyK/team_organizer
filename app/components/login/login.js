angular

    .module('app')

    .controller('LoginCtrl', ['$scope', 'userService', 'authService', '$location', function($scope, userService, authService, $location) {

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