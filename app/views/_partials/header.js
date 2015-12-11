app.controller('HeaderCtrl', ['$location', function($location) {
    this.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
}]);