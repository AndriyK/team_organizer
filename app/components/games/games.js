(function(){

    var app = angular.module('games', []);

    app.service('gamesService', ['$http', 'API_URL', 'authService', function($http, API_URL, authService){

        var self = this;

        self.addGame = function(teamId, date, location, description) {
            return $http.post(API_URL + '/games', {team_id:teamId, datetime:date, location:location, title:description});
        }

        self.getTeamGames = function (teamId){
            return $http.get(API_URL + '/teams/' + teamId + "?expand=games");
        }

        self.getPlayerGames = function (){
            return $http.get(API_URL + '/players/' + authService.getPlayerId() + "?expand=games");
        }

        self.removeGame = function (gameId){
            return $http.delete(API_URL + '/games/' + gameId);
        }

        self.updateGame = function (gameId, data){
            return $http.put(API_URL + '/games/' + gameId, data);
        }

        self.joinGame = function (gameId){
            return self.updateGame(gameId, {'join_player': authService.getPlayerId()});
        }

        self.rejectGame = function (gameId){
            return self.updateGame(gameId, {'reject_player': authService.getPlayerId()});
        }
    }]);

    app.controller('GamesController', ['$scope', 'gamesService', 'teamsService', function ($scope, gamesService, teamsService) {
        var self = this;

        $scope.teams = {};
        $scope.newGame = {};
        $scope.playerGames = {};

        teamsService.getTeams()
            .success(function (data){
                $scope.teams = data.teams.reduce(function(obj, curItem){
                    obj[curItem.id] = curItem;
                    return obj;
                }, {});
                loadGames();
                loadPlayerGames();
            });

        function loadGames() {
            for(var teamId in $scope.teams){
                (function (teamId){
                    gamesService.getTeamGames(teamId)
                        .success(function(data){
                            $scope.teams[teamId].games = data.games;
                        });
                })(teamId);
            }
        }

        function loadPlayerGames(){
            gamesService.getPlayerGames()
                .success(function(data){
                    $scope.playerGames = data.games.reduce(function(obj, curItem){
                        var gameDate = new Date( curItem.datetime.replace(' ', 'T'));
                        var curDate = new Date();
                        if(gameDate > curDate){
                            obj[curItem.id] = curItem;
                        }
                        return obj;
                    }, {});
                });
        }

        self.removeGame = function (gameId, teamId){
            gamesService.removeGame(gameId)
                .success(function (data){
                    $scope.alert = {message: 'Game has been removed.'};
                    $scope.teams[teamId].games = $scope.teams[teamId].games.filter(function(item){
                        return item.id != gameId;
                    });
                });
        }

        self.getUserPresenceOnGame = function (gameId) {
            if(!$scope.playerGames[gameId]) {
                return '';
            }

            return ($scope.playerGames[gameId].presence) == 1 ? 'joined' : 'rejected';
        }

        self.setGamePresence = function (gameId, presence) {
            var methodName = presence == 1 ? gamesService.joinGame : gamesService.rejectGame;
            methodName(gameId)
                .success(function(data){
                    data.presence = presence;
                    $scope.playerGames[data.id] = data;
                });
        }

        self.showNewGameForm = function (teamId){
            $scope.clearTempData();

            $scope.newGame.showForm = true;
            $scope.newGame.teamId = teamId;
        }

        $scope.clearTempData = function () {
            $scope.alert = {};

            $scope.newGame.showForm = false;
            $scope.newGame.teamId = 0;
            $scope.newGame.location = '';
            $scope.newGame.description = '';

            var dt = new Date();
            dt.setMinutes(0);
            dt.setHours(dt.getHours() + 2);
            $scope.newGame.date = dt;
        }
    }]);

    app.directive('teamsGames', function(){
        return {
            restrict: "E",
            templateUrl: "app/components/games/teams-games.html",
            scope: {},
            controller: 'GamesController',
            controllerAs: 'gamesCtrl'
        }
    });

    app.controller('NewGameFormController', ['$scope', '$filter', 'gamesService', function ($scope, $filter, gamesService) {
        var self = this;

        self.add = function () {
            if($scope.newGame.date <= new Date()){
                $scope.alert = {message: 'Please enter future date time for game.', level:'danger'};
                return;
            }

            gamesService.addGame($scope.newGame.teamId, $filter('date')($scope.newGame.date, 'yyyy-MM-dd hh-mm-00'), $scope.newGame.location, $scope.newGame.description || 'Training')
                .success(function (data){
                    $scope.teams[$scope.newGame.teamId].games.push(data);
                    $scope.clearTempData();
                    $scope.alert = {message: 'Game has been added.'};
                });
        }
    }]);

    app.directive('newGameForm', function(){
        return {
            restrict: "E",
            templateUrl: "app/components/games/new-game-form.html",
            controller: 'NewGameFormController',
            controllerAs: 'formCtrl'
        }
    });

    app.directive('dateTimePicker', function(){
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
    });

})();