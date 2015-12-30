angular

    .module('app')

    .directive('newGameForm', function(){
        return {
            restrict: "E",
            templateUrl: "app/components/games/new-game-form.html",
            controller: ['gamesService', 'teamsService', '$route', function (gamesService, teamsService, $route) {
                var self = this;
                self.game = {};
                self.teams = [];

                self.add = function () {
                    gamesService.addGame(self.game.teamId, self.game.date, self.game.location, self.game.description)
                        .success(function (data){
                            $route.reload();
                        });
                }

                teamsService.getTeams()
                    .success(function (data){
                        self.teams = data.teams;
                    });
            }],
            controllerAs: 'newGame'
        }
    })

    .directive('teamsGames', function(){
        return {
            restrict: "E",
            templateUrl: "app/components/games/teams-games.html",
            controller: ['gamesService', 'teamsService', '$route', function (gamesService, teamsService, $route) {
                var self = this;
                self.teams = [];

                teamsService.getTeams()
                    .success(function (data){
                        self.teams = data.teams;
                        self.loadGames();
                    });

                self.loadGames = function () {
                    for(var i = 0, n = self.teams.length; i<n; i++) {
                        gamesService.getTeamGames(self.teams[i].id)
                            .success(function(data){
                                for(var j = 0, n = self.teams.length; j<n; j++) {
                                    if(self.teams[j].id == data.id && data.games.length>0){
                                        self.teams[j].games = data.games;
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
            }],
            controllerAs: 'gamesCtrl'
        }
    });