angular

    .module('app')

    .controller('RegisterCtrl', ['$scope', 'userService', 'authService', '$location', function($scope, userService, authService, $location) {

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