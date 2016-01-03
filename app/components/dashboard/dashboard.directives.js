angular

    .module('app')

    .directive('plannedGamesList', ['dashboardService', function(dashboardService){
        return {
            restrict: "E",
            templateUrl: "app/components/dashboard/planned-games-list.html",
            scope: {},
            controller:['$scope', function ($scope){
                var self = this;
                self.filterDaysAmount = 1;

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
            controller:['$route', function ($route){
                var self = this;

                self.joinGame = function (gameId) {
                    gamesService.joinGame(gameId)
                        .success(function(){
                            $route.reload();
                        });
                }

                self.rejectGame = function (gameId) {
                    gamesService.rejectGame(gameId)
                        .success(function(){
                            $route.reload();
                        });
                }

            }],
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