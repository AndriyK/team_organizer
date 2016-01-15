(function(){

    var app = angular.module('dashboard', []);

    app.service('dashboardService', ['$http', 'API_URL', 'authService', function($http, API_URL, authService){
        this.get = function() {
            return $http.get(API_URL + '/dashboard/' + authService.getPlayerId());
        }
    }]);

    app.controller('DashboardController', ['$scope', 'dashboardService', function ($scope, dashboardService){
        var self = this;
        var filterDaysAmount = 0;

        $scope.games = [];

        dashboardService.get()
            .success(function(data){
                $scope.games = data;
            });

        self.filterGamesByDate = function (value) {
            if(filterDaysAmount == 0){
                return true;
            }

            var now = new Date();
            var gameDate = new Date(value.date.replace(' ', 'T'));
            var tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + filterDaysAmount);
            return gameDate < tomorrow;
        }

        self.changeFilterDays = function (days) {
            filterDaysAmount = days;
        }

        self.isFilterActive = function (days){
            return filterDaysAmount == days;
        }

        self.getFilterIntervalText = function (){
            if(filterDaysAmount == 0){
                return '';
            }
            return filterDaysAmount == 1 ? ' today' : ' in nearest ' + (filterDaysAmount-1) + ' days';
        }
    }]);

    app.directive('plannedGamesList', function(dashboardService){
        return {
            restrict: "E",
            templateUrl: "app/components/dashboard/planned-games-list.html",
            scope: {},
            controller: 'DashboardController',
            controllerAs: "dashboardCtrl"
        }
    });

    app.controller('PresenceController', ['gamesService', function(gamesService){
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
    }]);

    app.directive('gamePresence', ['gamesService', function(gamesService){
        return {
            restrict: "E",
            templateUrl: "app/components/dashboard/game-presence.html",
            controller: 'PresenceController',
            controllerAs: "presenceCtrl"
        }
    }]);

    app.controller('PlayersSummaryController', function (){
        var self = this;
        self.buildPlayersList = function (players) {
            return players.join(', ');
        }
    });

    app.directive('playersSummary', function(){
        return {
            restrict: "E",
            templateUrl: "app/components/dashboard/players-summary.html",
            controller: 'PlayersSummaryController',
            controllerAs: 'summaryCtrl'
        }
    });

    app.directive('gameInfo', function(){
        return {
            restrict: "E",
            templateUrl: "app/components/dashboard/game-info.html"
        }
    });

})();