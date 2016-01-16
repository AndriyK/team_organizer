(function (){

    var app = angular.module('teams', []);

    app.service('teamsService', ['$http', 'API_URL', 'authService',function($http, API_URL, authService){

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

    app.controller('TeamsController', ['$scope', 'teamsService', function($scope, teamsService){
        $scope.teams = [];

        teamsService.getTeams()
            .success(function(data){
                $scope.teams = data.teams;
            });

        $scope.updateTeamPlayers = function (teamId, players) {
            for(var i= 0, n = $scope.teams.length; i < n; i++){
                if($scope.teams[i].id == teamId) {
                    $scope.teams[i].players = players;
                    break;
                }
            }
        };
    }]);

    app.directive('playerTeams', ['teamsService', function(teamsService){
        return {
            restrict: "E",
            templateUrl: "app/components/teams/player-teams.html",
            scope: {},
            controller:'TeamsController',
            controllerAs: "teamsCtrl"
        }
    }]);

    app.directive('teamHeading', function(){
        return {
            restrict: "E",
            templateUrl: "app/components/teams/team-heading.html"
        }
    });

    app.controller('PlayersController', ['$scope', 'teamsService', function ($scope, teamsService) {
        var self = this;

        self.removePlayer = function (teamId, mail) {
            teamsService.removePlayer(teamId, mail)
                .success(function(data){
                    $scope.updateTeamPlayers(teamId, data.players)
                });
        }

        self.showRemovePlayerLink = function(team, player) {
            if(player.is_capitan == "1"){
                return false;
            }

            if(team.is_capitan == "1"){
                return true;
            }

            return false;
        }
    }]);

    app.directive('teamPlayers', function(){
        return {
            restrict: "E",
            templateUrl: "app/components/teams/team-players.html",
            controller: 'PlayersController',
            controllerAs: "playersCtrl"
        }
    });

    app.controller('TeamManagementController', ['$scope', '$window', 'teamsService',function ($scope, $window, teamsService) {
        var self = this;

        self.newPlayerMail = '';

        self.removeTeam = function (team) {
            if(!$window.confirm('Please confirm team removal?')){
                return;
            }

            teamsService.removeTeam(team.id)
                .success(function(){
                    var index = $scope.teams.indexOf(team);
                    $scope.teams.splice(index, 1);
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
                            break;
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

    }]);

    app.directive('teamManagement', function(){
        return {
            restrict: "E",
            templateUrl: "app/components/teams/team-management.html",
            controller: 'TeamManagementController',
            controllerAs: "teamManage"
        }
    });

    app.directive('newTeamManagement', function(){
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
    });

    app.directive('newTeamCreate', ['teamsService', function(teamsService){
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
    }]);

    app.directive('newTeamFind', ['teamsService', function(teamsService){
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

})();
