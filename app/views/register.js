app.controller('RegisterCtrl', ['$scope', '$http', '$window', '$location', function($scope, $http, $window, $location) {

    $scope.register = function() {
        $scope.error = '';
        $http.post('http://localhost/team/api/index.php/v1/players', $scope.player).success(
            function (data) {
                $window.sessionStorage.access_token = data.access_token;
                $location.path('/player').replace();
            }).error(
            function (data) {
                angular.forEach(data, function (error) {
                    $scope.error= error.message;
                });
            }
        );
    }

}]);