angular

    .module('app')

    .directive('plannedGamesList', ['dashboardService', function(dashboardService){
        return {
            restrict: "E",
            templateUrl: "app/components/dashboard/planned-games-list.html",
            scope: {},
            controller:['$scope', function ($scope){
                var self = this;
                self.filterDaysAmount = 0;

                $scope.games = [];

                $scope.getDashboardData = function (){
                    dashboardService.get()
                        .success(function(data){
                            $scope.games = data;
                        });
                };

                $scope.getDashboardData();

                self.filterGamesByDate = function (value) {
                    if(self.filterDaysAmount == 0){
                        return true;
                    }

                    var now = new Date();
                    var gameDate = new Date(value.date);
                    var tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate()+self.filterDaysAmount);
                    return gameDate < tomorrow;
                }

                self.changeFilterDays = function (days) {
                    self.filterDaysAmount = days;
                }

                self.isFilterActive = function (days){
                    return self.filterDaysAmount == days;
                }

                self.getFilterIntervalText = function (){
                    if(self.filterDaysAmount == 0){
                        return '';
                    }
                    return self.filterDaysAmount == 1 ? ' today' : ' in nearest ' + (self.filterDaysAmount-1)+ ' days';
                }
            }],
            controllerAs: "dashboardCtrl"
        }
    }])

    .directive('gamePresence', ['gamesService', function(gamesService){
        return {
            restrict: "E",
            templateUrl: "app/components/dashboard/game-presence.html",
            controller:function (){
                var self = this;

                self.joinGame = function (game) {
                    gamesService.joinGame(game.game.id)
                        .success(function(){
                            game.current_player_status = 'joined';
                        });
                }

                self.rejectGame = function (game) {
                    gamesService.rejectGame(game.game.id)
                        .success(function(){
                            game.current_player_status = 'rejected';
                        });
                }

            },
            controllerAs: "presenceCtrl"
        }
    }])

    .directive('playersSummary', function(){
        return {
            restrict: "E",
            templateUrl: "app/components/dashboard/players-summary.html",
            controller: function (){
                var self = this;
                self.buildPlayersList = function (players) {
                    return players.join(', ');
                }
            },
            controllerAs: 'summaryCtrl'
        }
    })

    .directive('gameInfo', function(){
        return {
            restrict: "E",
            templateUrl: "app/components/dashboard/game-info.html"
        }
    });