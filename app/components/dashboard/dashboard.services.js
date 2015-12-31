angular

    .module('app')

    .service('dashboardService', ['$http', 'API_URL', 'authService', function($http, API_URL, authService){

        var self = this;

        self.get = function() {
            return $http.get(API_URL + '/dashboard/' + authService.getPlayerId());
        }
    }]);