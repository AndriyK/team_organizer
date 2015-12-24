angular

    .module('app')

    .controller('TeamsCtrl', ['teamsService', function(teamsService) {
        var self = this;

        self.teams = [];
        self.teamNew = {};
        self.playerNew = {};
        self.teamNew.sport = 'football';

        self.showNewTeamForm = false;
        self.showSearchTeamForm = false;

        self.hasTeams = function () {
            return self.teams.length > 0;
        }

        self.getTeams = function () {
            return self.teams;
        }

        self.showForm = function (name) {
            hideForms();
            if (name == 'new') {
                self.showNewTeamForm = true;
            } else if (name == 'search') {
                self.showSearchTeamForm = true;
            }
        }

        self.create = function () {
            teamsService.createTeam(self.teamNew.name, self.teamNew.sport)
                .success(function(data){
                    data.is_capitan = 1;
                    self.teams.push(data);
                    hideForms();
                })
                .error(function(data){
                    console.log(data);
                });
        }

        self.joinPlayer = function (team_id) {
            var mail = self.playerNew.mail;
            if(!mail) {
                console.log('do nothing - empty mail');
                return;
            }

            teamsService.joinPlayer(team_id, mail)
                .success(function(data){
                    console.log('player was added');
                })
                .error(function(data){
                    console.log(data);
                });
        }

        self.removePlayer = function (team_id, mail) {
          teamsService.removePlayer(team_id, mail)
                .success(function(data){
                    console.log('player was removed');
                })
                .error(function(data){
                    console.log(data);
                });

        }

        teamsService.getTeams()
            .success(function(data){
                self.teams = data.teams;
            });

        function hideForms(){
            self.showNewTeamForm = self.showSearchTeamForm = false;
        }
    }]);