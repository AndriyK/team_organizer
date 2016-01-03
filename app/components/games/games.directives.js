angular

    .module('app')

    .directive('newGameForm', function(){
        return {
            restrict: "E",
            templateUrl: "app/components/games/new-game-form.html",
            controller: ['$scope', 'gamesService', '$route', function ($scope, gamesService, $route) {
                var self = this;
                self.game = {};

                self.add = function () {
                    gamesService.addGame($scope.selectedTeamId, self.game.date, self.game.location, self.game.description)
                        .success(function (data){
                            $route.reload();
                        });
                }
            }],
            controllerAs: 'formCtrl'
        }
    })

    .directive('teamsGames', function(){
        return {
            restrict: "E",
            templateUrl: "app/components/games/teams-games.html",
            scope: {},
            controller: ['$scope', 'gamesService', 'teamsService', '$route', function ($scope, gamesService, teamsService, $route) {
                var self = this;

                $scope.hideNewGameForm = true;
                //$scope.selectedTeamId = 0;
                $scope.teams = [];

                teamsService.getTeams()
                    .success(function (data){
                        $scope.teams = data.teams;
                        self.loadGames();
                    });

                self.loadGames = function () {
                    for(var i = 0, n = $scope.teams.length; i<n; i++) {
                        gamesService.getTeamGames($scope.teams[i].id)
                            .success(function(data){
                                for(var j = 0, n = $scope.teams.length; j<n; j++) {
                                    if($scope.teams[j].id == data.id && data.games.length>0){
                                        $scope.teams[j].games = data.games;
                                    }
                                }
                            });
                    }
                }

                self.removeGame = function (gameId){
                    gamesService.removeGame(gameId)
                        .success(function (data){
                            $route.reload();
                        });
                }

                self.showNewGameForm = function (teamId){
                    $scope.hideNewGameForm = false;
                    $scope.selectedTeamId = teamId;
                }
            }],
            controllerAs: 'gamesCtrl'
        }
    });