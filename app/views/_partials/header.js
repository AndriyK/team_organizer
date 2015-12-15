app.controller('HeaderCtrl', ['$location', 'auth', function($location, auth) {
    this.isPageActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

    this.isUserLogged = function () {
        return auth.isAuthed();
    }
}]);