app.controller('RegisterCtrl', ['$scope', 'user', 'auth', '$location', function($scope, user, auth, $location) {

    $scope.register = function() {
        $scope.errors = [];

        user.register($scope.player)
            .success(
                function (data) {
                    auth.saveToken(data.token);
                    $location.path('/player').replace();
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