app.controller('LoginCtrl', ['$scope', 'user', 'auth', '$location', function($scope, user, auth, $location) {

    $scope.login = function() {
        $scope.errors = [];

        user.login($scope.user.email, $scope.user.password, $scope.user.rememberMe)
            .success(
                function (data) {
                    auth.saveToken(data.token);
                    $location.path('/player').replace();
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