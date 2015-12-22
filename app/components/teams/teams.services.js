angular

    .module('app')

    .service('teamsService', ['$http', 'API_URL', function($http, API_URL){

        var self = this;

        self.getTeams = function() {
            return $http.get(API_URL + '/players/' + 14 + '?expand=teams');
        }

    }]);