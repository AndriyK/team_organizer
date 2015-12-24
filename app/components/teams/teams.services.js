angular

    .module('app')

    .service('teamsService', ['$http', 'API_URL', 'authService',function($http, API_URL, authService){

        var self = this;

        self.getTeams = function() {
            return $http.get(API_URL + '/players/' + authService.getPlayerId() + '?expand=teams');
        }

        self.createTeam = function (teamName, teamSport) {
            return $http.post(API_URL + '/teams', {name: teamName, sport: teamSport});
        }

        self.joinPlayer = function (teamId, mail) {
            return $http.put(API_URL + '/teams/'+teamId, {join_player: mail});
        }

        self.removePlayer = function (teamId, mail) {
            return $http.put(API_URL + '/teams/'+teamId, {remove_player: mail});
        }

    }]);