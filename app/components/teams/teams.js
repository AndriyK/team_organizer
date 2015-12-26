angular

    .module('app')

    .controller('TeamsCtrl', ['teamsService', function(teamsService) {
        var self = this;

        self.teams = null;
        self.teamNew = {};
        self.playerNew = {};
        self.teamNew.sport = 'football';

        self.showNewTeamForm = false;
        self.showSearchTeamForm = false;

        self.hasTeams = function () {
            return self.teams === null ? false : self.teams.length > 0;
        }

        self.getTeams = function (forceSelection) {
            if(self.teams === null || forceSelection) {
                self.teams = [];
                teamsService.getTeams()
                    .success(function(data){
                        self.teams = data.teams;
                    });
            }

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

        self.joinPlayer = function (teamId) {
            var mail = self.playerNew.mail;
            if(!mail) {
                console.log('do nothing - empty mail');
                return;
            }

            teamsService.joinPlayer(teamId, mail)
                .success(function(data){
                    updateTeamsPlayersList(teamId, data.players)
                    self.playerNew.mail = '';
                });
        }

        self.removePlayer = function (teamId, mail) {
            teamsService.removePlayer(teamId, mail)
                .success(function(data){
                    updateTeamsPlayersList(teamId, data.players)
                });

        }

        self.leaveTeam = function (teamId) {
            teamsService.leaveTeam(teamId)
                .success(function(data){
                    var teams = self.teams;
                    for(var i= 0, n = teams.length; i < n; i++){
                        if(teams[i].id == teamId) {
                            teams.splice(i, 1);
                        }
                    }
                    self.teams = teams;
                });
        }

        self.findTeam = function () {
            var name = self.teamSearch.name || "";
            var mail = self.teamSearch.mail || "";

            teamsService.find(name, mail)
                .success(function(data){
                    self.foundTeams = data;
                });
        }

        function hideForms(){
            self.showNewTeamForm = self.showSearchTeamForm = false;
        }

        function updateTeamsPlayersList(teamId, players){
            for(var i= 0, n = self.teams.length; i < n; i++){
                if(self.teams[i].id == teamId) {
                    self.teams[i].players = players;
                }
            }
        }
    }]);