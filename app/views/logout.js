app.controller('LogoutCtrl', ['$location', 'auth', function($location, auth) {
        auth.logout();
        $location.path('/login').replace();
}]);