angular

    .module('app')

    .directive('playerTeams', ['teamsService', function(teamsService){
        return {
            restrict: "E",
            templateUrl: "app/components/teams/player-teams.html",
            scope: {},
            controller:['$scope', function ($scope){
                $scope.teams = [];

                $scope.selectTeams = function (){
                    teamsService.getTeams()
                        .success(function(data){
                            $scope.teams = data.teams;
                        });
                };

                $scope.selectTeams();

                $scope.updateTeamPlayers = function (teamId, players) {
                    for(var i= 0, n = $scope.teams.length; i < n; i++){
                        if($scope.teams[i].id == teamId) {
                            $scope.teams[i].players = players;
                        }
                    }
                };

                this.getTeams = function (){
                    return $scope.teams;
                }
            }],
            controllerAs: "teamsCtrl"
        }
    }])

    .directive('teamHeading', function(){
        return {
            restrict: "E",
            templateUrl: "app/components/teams/team-heading.html"
        }
    })

    .directive('teamPlayers', ['teamsService', function(teamsService){
        return {
            restrict: "E",
            templateUrl: "app/components/teams/team-players.html",
            controller: ['$scope', function ($scope) {
                var self = this;
                self.removePlayer = function (teamId, mail) {
                    teamsService.removePlayer(teamId, mail)
                        .success(function(data){
                            $scope.updateTeamPlayers(teamId, data.players)
                        });
                }
            }],
            controllerAs: "playersCtrl"
        }
    }])

    .directive('teamManagement', ['teamsService', function(teamsService){
        return {
            restrict: "E",
            templateUrl: "app/components/teams/team-management.html",
            controller: ['$scope', function ($scope) {
                var self = this;

                self.newPlayerMail = '';

                self.removeTeam = function (teamId) {
                    if(!confirm('Please confirm team removal?')){
                        return;
                    }

                    teamsService.removeTeam(teamId)
                        .success(function(){
                            $scope.selectTeams();
                        });
                }

                self.renameTeam = function (teamId) {
                    var newName = prompt('Please enter new name:', '');
                    if(!newName){
                        return;
                    }

                    teamsService.renameTeam(teamId, newName)
                        .success(function(){
                            for(var i= 0, n = $scope.teams.length; i < n; i++){
                                if($scope.teams[i].id == teamId) {
                                    $scope.teams[i].name = newName;
                                }
                            }
                        });
                }

                self.joinPlayer = function (teamId) {
                    if(!self.newPlayerMail) {
                        return;
                    }
                    teamsService.joinPlayer(teamId, self.newPlayerMail)
                        .success(function(data){
                            self.newPlayerMail = '';
                            $scope.updateTeamPlayers(teamId, data.players);
                        });
                }

                self.leaveTeam = function (teamId) {
                    teamsService.leaveTeam(teamId)
                        .success(function(data){
                            var teams = $scope.teams;
                            for(var i= 0, n = teams.length; i < n; i++){
                                if(teams[i].id == teamId) {
                                    teams.splice(i, 1);
                                }
                            }
                            $scope.teams = teams;
                        });
                }

            }],
            controllerAs: "teamManage"
        }
    }])

    .directive('newTeamManagement', function(){
        return {
            restrict: "E",
            templateUrl: "app/components/teams/new-team-management.html",
            controller: ['$scope', function ($scope) {
                $scope.showNewTeamForm = function (form){
                    $scope.hideNewTeamForms();
                    if(form == 'create') {
                        $scope.showCreateTeamForm = true;
                    } else if(form == 'find'){
                        $scope.showFindTeamForm = true;
                    }
                };

                $scope.hideNewTeamForms = function(){
                    $scope.showCreateTeamForm = $scope.showFindTeamForm = false;
                };
            }],
        }
    })

    .directive('newTeamCreate', ['teamsService', function(teamsService){
        return {
            restrict: "E",
            templateUrl: "app/components/teams/new-team-create.html",
            controller: ['$route', function ($route) {
                var self = this;
                self.teamNew = {sport: 'football'};
                self.create = function () {
                    teamsService.createTeam(self.teamNew.name, self.teamNew.sport)
                        .success(function(data){
                            $route.reload();
                        });
                }
            }],
            controllerAs: 'createTeam'
        }
    }])

    .directive('newTeamFind', ['teamsService', function(teamsService){
        return {
            restrict: "E",
            templateUrl: "app/components/teams/new-team-find.html",
            controller: ['$route', '$filter', 'authService', function ($route, $filter, authService) {
                var self = this;

                self.search = {};
                self.showNotFound = false;
                self.playerId = authService.getPlayerId();

                self.find = function () {
                    self.showNotFound = false;
                    self.foundTeams = [];

                    var name = self.search.name || "";
                    var mail = self.search.mail || "";

                    teamsService.find(name, mail)
                        .success(function(data){
                            self.foundTeams = $filter('filter')(data, function(team){
                                return !team.players.some(function(player){
                                    return player.id == self.playerId;
                                });
                            });
                            self.showNotFound = !!!self.foundTeams.length;
                        })
                        .error(function(data){
                            self.showNotFound = true;
                        });
                };

                self.joinToTeam = function (teamId) {
                    teamsService.joinToTeam(teamId)
                        .success(function(data){
                            $route.reload();
                        });
                }
            }],
            controllerAs: 'findTeam'
        }
    }]);