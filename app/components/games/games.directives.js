angular

    .module('app')

    .directive('newGameForm', function(){
        return {
            restrict: "E",
            templateUrl: "app/components/games/new-game-form.html",
            controller: ['$scope', 'gamesService', function ($scope, gamesService) {
                var self = this;

                self.add = function () {
                    gamesService.addGame($scope.newGame.teamId, formatDateTime($scope.newGame.date), $scope.newGame.location, $scope.newGame.description || 'Training')
                        .success(function (data){
                            $scope.teams[$scope.newGame.teamId].games.push(data);
                            $scope.clearTempData();
                            $scope.infoMessage = 'Game has been added.';
                        });
                }

                function formatDateTime(date){
                    return date.getFullYear() + "-" + twoDigits(1 + date.getMonth()) + "-" + twoDigits(date.getDate())
                    + " " + twoDigits(date.getHours()) + ":" + twoDigits(date.getMinutes()) + ":00";
                }
                function twoDigits(d) {
                    if(0 <= d && d < 10) return "0" + d;
                    return d;
                }

            }],
            controllerAs: 'formCtrl'
        }
    })

    .directive('dateTimePicker', function(){
        return {
            restrict: "E",
            templateUrl: "app/components/games/date-time-picker.html",
            controller: ['$scope', function ($scope) {
                var self = this;

                var curDate = new Date();

                self.datepicker = {
                    status: {opened: false},
                    options: {
                        startingDay: 1
                    },
                    minDate: new Date().setHours(curDate.getHours() + 2),
                    maxDate: new Date().setDate(curDate.getDate() + 30), // 2 moth more
                }

                self.openDatepicker = function (){
                    self.datepicker.status.opened = true;
                }
            }],
            controllerAs: 'pickerCtrl'
        }
    })

    .directive('teamsGames', function(){
        return {
            restrict: "E",
            templateUrl: "app/components/games/teams-games.html",
            scope: {},
            controller: ['$scope', 'gamesService', 'teamsService', function ($scope, gamesService, teamsService) {
                var self = this;

                $scope.teams = {};
                $scope.newGame = {};

                teamsService.getTeams()
                    .success(function (data){
                        $scope.teams = data.teams.reduce(function(obj, curItem){
                            obj[curItem.id] = curItem;
                            return obj;
                        }, {});
                        self.loadGames();
                    });

                self.loadGames = function () {
                    for(var teamId in $scope.teams){
                        (function (teamId){
                            gamesService.getTeamGames(teamId)
                                .success(function(data){
                                    $scope.teams[teamId].games = data.games;
                                });
                        })(teamId);
                    }
                }

                self.removeGame = function (gameId, teamId){
                    gamesService.removeGame(gameId)
                        .success(function (data){
                            $scope.infoMessage = 'Game has been removed.';
                            $scope.teams[teamId].games = $scope.teams[teamId].games.filter(function(item){
                                return item.id != gameId;
                            });
                        });
                }

                self.showNewGameForm = function (teamId){
                    $scope.clearTempData();

                    $scope.newGame.showForm = true;
                    $scope.newGame.teamId = teamId;
                }

                $scope.clearTempData = function () {
                    $scope.infoMessage = '';

                    $scope.newGame.showForm = false;
                    $scope.newGame.teamId = 0;
                    $scope.newGame.location = '';
                    $scope.newGame.description = '';

                    var dt = new Date();
                    dt.setMinutes(0);
                    dt.setHours(dt.getHours() + 2);
                    $scope.newGame.date = dt;

                }
         }],
            controllerAs: 'gamesCtrl'
        }
    });