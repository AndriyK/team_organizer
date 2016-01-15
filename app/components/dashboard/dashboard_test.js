'use strict';

describe('dashboard', function() {

    beforeEach(module('app'));
    beforeEach(module('dashboard'));

    describe('service.dashboardService', function(){
        var $httpBackend, API_URL, authService, dashboardService, $window;

        beforeEach(inject(function(_$httpBackend_, _API_URL_, _authService_, _dashboardService_, _$window_){
            $httpBackend = _$httpBackend_;
            authService = _authService_;
            API_URL = _API_URL_;
            dashboardService = _dashboardService_;
            $window = _$window_;
        }));

        it('should be defined', function() {
            expect(dashboardService).toBeDefined();
        });

        it('should have a get method', function () {
            expect(angular.isFunction(dashboardService.get)).toBe(true);
        });

        it('should request dashboard data', function() {
            var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJpYXQiOjE0NTI1MDM4ODksImV4cCI6MTQ1MzEwODY4OSwidWlkIjozMywibWFpbCI6InFAcS5xIn0.chn6C_ItxSWY0Y3n82M7RrxpppQiONJKYygeEybt7_g"
            authService.saveToken(token);

            $httpBackend
                .expectGET(API_URL + '/dashboard/33')
                .respond({});

            dashboardService.get();

            $httpBackend.flush();
        });

    });

    describe('controller', function(){
        var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJpYXQiOjE0NTI1MDM4ODksImV4cCI6MTQ1MzEwODY4OSwidWlkIjozMywibWFpbCI6InFAcS5xIn0.chn6C_ItxSWY0Y3n82M7RrxpppQiONJKYygeEybt7_g"
        var $controller, authService, API_URL, $httpBackend, $window;

        beforeEach(inject(function(_$controller_, _authService_, _$window_, _API_URL_, _$httpBackend_){
            $controller = _$controller_;
            $window = _$window_;
            API_URL = _API_URL_;
            $httpBackend = _$httpBackend_;
            authService = _authService_;
            authService.saveToken(token);
        }));

        describe('DashboardController', function(){
            var controller, dashboardService, $scope;

            beforeEach(inject(function(_dashboardService_){
                dashboardService = _dashboardService_;
                $scope = {};
            }));

            beforeEach(function() {
                $httpBackend
                    .expectGET(API_URL + '/dashboard/33')
                    .respond([{
                        current_player_status:"joined",
                        date:"2016-01-17 12:00:00",
                        game:{},
                        players_summary:{},
                        team:{}
                    }]);

                controller = $controller('DashboardController', {$scope: $scope}, dashboardService);

                $httpBackend.flush();
            });

            it('should be defined dashboard controller', function() {
                expect(controller).toBeDefined();
            });

            it('scope should have a games defined', function(){
                expect($scope.games).toBeDefined();
            });

            it('should receive games from dashboard service', function(){
                expect($scope.games.length).toBe(1);
            });

            it('should receive games from dashboard service with expected structure', function(){
                var game = $scope.games[0];
                expect(game.current_player_status).toBeDefined();
                expect(game.date).toBeDefined();
                expect(game.game).toBeDefined();
                expect(game.team).toBeDefined();
                expect(game.players_summary).toBeDefined();
            });

            it('should correctly work with filter days amount', function(){
                expect(controller.isFilterActive(0)).toBeTruthy();
                expect(controller.getFilterIntervalText()).toEqual('');

                controller.changeFilterDays(4);
                expect(controller.isFilterActive(4)).toBeTruthy();
                expect(controller.getFilterIntervalText()).toEqual(' in nearest 3 days');

                controller.changeFilterDays(1);
                expect(controller.isFilterActive(1)).toBeTruthy();
                expect(controller.getFilterIntervalText()).toEqual(' today');
            });

            it('should correctly work filtering function', function(){
                var today = new Date();
                var week = new Date();
                week.setDate(week.getDate() + 7);

                // no filtering by default - all dates are suitable
                expect(controller.isFilterActive(0)).toBeTruthy();

                expect(controller.filterGamesByDate({date: formatDateTime_(today)})).toBeTruthy();
                expect(controller.filterGamesByDate({date: formatDateTime_(week)})).toBeTruthy();

                controller.changeFilterDays(4);
                expect(controller.filterGamesByDate({date: formatDateTime_(today)})).toBeTruthy();
                expect(controller.filterGamesByDate({date: formatDateTime_(week)})).toBeFalsy();
            });

            function formatDateTime_(date){
                return date.getFullYear() + "-" + twoDigits_(1 + date.getMonth()) + "-" + twoDigits_(date.getDate())
                    + " " + twoDigits_(date.getHours()) + ":" + twoDigits_(date.getMinutes()) + ":00";
            }
            function twoDigits_(d) {
                if(0 <= d && d < 10) return "0" + d;
                return d;
            }
        });

        describe('PresenceController', function(){
            var controller, gamesService;

            beforeEach(inject(function(_gamesService_){
                gamesService = _gamesService_;
            }));

            beforeEach(function() {
                controller = $controller('PresenceController', gamesService);
            });

            it('should be defined presence controller', function() {
                expect(controller).toBeDefined();
            });

            it('should join player to the game', function(){
                var game = {
                    game: {id: 1},
                    current_player_status:'unknown'
                };

                $httpBackend
                    .expectPUT(API_URL + '/games/1', {join_player: 33})
                    .respond({});

                controller.joinGame(game);

                $httpBackend.flush();

                expect(game.current_player_status).toEqual('joined');
            });

            it('should reject player from the game', function(){
                var game = {
                    game: {id: 2},
                    current_player_status:'unknown'
                };

                $httpBackend
                    .expectPUT(API_URL + '/games/2', {reject_player: 33})
                    .respond({});

                controller.rejectGame(game);

                $httpBackend.flush();

                expect(game.current_player_status).toEqual('rejected');
            });
        });

        describe('PresenceController', function(){
            var controller;

            beforeEach(function() {
                controller = $controller('PlayersSummaryController');
            });

            it('should be defined presence controller', function() {
                expect(controller).toBeDefined();
            });

            it('should be defined presence controller', function() {
                var p = ['a', 'b']
                expect(controller.buildPlayersList(p)).toEqual('a, b');
            });
        });

    });
});