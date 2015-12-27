angular

    .module('app')

    .service('teamsService', ['$http', 'API_URL', 'authService',function($http, API_URL, authService){

        var self = this;

        self.getTeams = function() {
            return $http.get(API_URL + '/players/' + authService.getPlayerId() + '?expand=teams');
        }

        // GET /teams/search?name=<name>&email=<mail>
        self.find = function (name, mail) {
            return $http.get(API_URL + '/teams/search?name='+name+'&email='+mail);
        }

        self.createTeam = function (teamName, teamSport) {
            return $http.post(API_URL + '/teams', {name: teamName, sport: teamSport});
        }

        self.updateTeam = function (teamId, data) {
            return $http.put(API_URL + '/teams/'+teamId, data);
        }

        self.joinPlayer = function (teamId, mail) {
            return self.updateTeam(teamId, {join_player: mail});
        }

        self.removePlayer = function (teamId, mail) {
            return self.updateTeam(teamId, {remove_player: mail});
        }

        self.renameTeam = function (teamId, newName) {
            return self.updateTeam(teamId, {name: newName});
        }

        self.leaveTeam = function (teamId) {
            return self.removePlayer(teamId, authService.getPlayerMail());
        }

        self.joinToTeam = function (teamId) {
            return self.joinPlayer(teamId, authService.getPlayerMail());
        }

        self.removeTeam = function (teamId) {
            return $http.delete(API_URL + '/teams/'+teamId);
        }
    }]);