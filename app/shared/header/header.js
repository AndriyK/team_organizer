angular

    .module('app')

    .controller('HeaderCtrl', ['$location', 'authService', function($location, authService) {
        this.isPageActive = function (viewLocation) {
            return viewLocation === $location.path();
        };

        this.isUserLogged = function () {
            return authService.isAuthed();
        }

    }]);