angular

    .module('app')

    .controller('TeamsCtrl', ['teamsService', function(teamsService) {
        var self = this;

        self.teams = [];
        self.teamNew = {};
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
            console.log('Model' + self.teamNew.name + self.teamNew.sport);
            teamsService.createTeam(self.teamNew.name, self.teamNew.sport)
                .success(function(data){
                    self.teams.push(data);
                    hideForms();
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