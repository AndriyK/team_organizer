angular

    .module('app')

    .controller('LogoutCtrl', ['$location', 'authService', function($location, authService) {
            authService.logout();
            $location.path('/login').replace();
    }]);