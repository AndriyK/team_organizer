angular

    .module('app')

    .directive('newGameForm', function(){
        return {
            restrict: "E",
            templateUrl: "app/components/games/new-game-form.html",
            controller: ['$scope', 'gamesService', '$route', function ($scope, gamesService, $route) {
                var self = this;
                self.game = {};

                self.datepicker = {
                    date: new Date().setMinutes(0),
                    status: {opened: false},
                    options: {
                        startingDay: 1
                    },
                    minDate: new Date(),
                    maxDate: new Date().setDate(new Date().getDate() + 30), // 2 moth more
                }

                self.add = function () {

                    gamesService.addGame($scope.selectedTeamId, self.getDatepickerDate(), self.game.location, self.game.description)
                        .success(function (data){
                            $route.reload();
                        });
                }

                self.openDatepicker = function (){
                    self.datepicker.status.opened = true;
                }

                self.getDatepickerDate = function (){
                    var date = self.datepicker.date;
                    //return date.toISOString().slice(0, 19).replace('T', ' '); // with timezone
                    var str = date.getFullYear();
                    var month = date.getMonth() + 1;
                    str += '-';
                    str += month < 10 ? '0'+month : month;
                    var day = date.getDate();
                    str += '-';
                    str += day < 10 ? '0'+day : day;
                    str += ' ';
                    var hour = date.getHours();
                    str += hour < 10 ? '0' + hour : hour;
                    str += ':';
                    var min = date.getMinutes();
                    str += min < 10 ? '0' + min : min;
                    str += ':00';
                    return  str;
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