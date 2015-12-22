angular

    .module('app')

    .controller('TeamsCtrl', ['teamsService', function(teamsService) {
        var self = this;

        self.teams = [];

        self.hasTeams = function () {
            return self.teams.length > 0;
        }

        self.getTeams = function () {
            return self.teams;
        }

        teamsService.getTeams()
            .success(function(data){
                self.teams = data.teams;
            });
    }]);