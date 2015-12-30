angular

    .module('app')

    .service('gamesService', ['$http', 'API_URL', function($http, API_URL){

        var self = this;

        self.addGame = function(teamId, date, location, description) {
            return $http.post(API_URL + '/games', {team_id:teamId, datetime:date, location:location, title:description});
        }

        self.getTeamGames = function (teamId){
            return $http.get(API_URL + '/teams/' + teamId + "?expand=games");
        }

        self.removeGame = function (gameId){
            return $http.delete(API_URL + '/games/' + gameId);
        }
    }]);