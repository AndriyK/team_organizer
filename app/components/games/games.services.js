angular

    .module('app')

    .service('gamesService', ['$http', 'API_URL', 'authService', function($http, API_URL, authService){

        var self = this;

        self.addGame = function(teamId, date, location, description) {
            return $http.post(API_URL + '/games', {team_id:teamId, datetime:date, location:location, title:description});
        }

        self.getTeamGames = function (teamId){
            return $http.get(API_URL + '/teams/' + teamId + "?expand=games");
        }

        self.getPlayerGames = function (){
            return $http.get(API_URL + '/players/' + authService.getPlayerId() + "?expand=games");
        }

        self.removeGame = function (gameId){
            return $http.delete(API_URL + '/games/' + gameId);
        }

        self.updateGame = function (gameId, data){
            return $http.put(API_URL + '/games/' + gameId, data);
        }

        self.joinGame = function (gameId){
            return self.updateGame(gameId, {'join_player': authService.getPlayerId()});
        }

        self.rejectGame = function (gameId){
            return self.updateGame(gameId, {'reject_player': authService.getPlayerId()});
        }
    }]);