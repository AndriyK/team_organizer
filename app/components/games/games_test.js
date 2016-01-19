"use strict"

describe('games', function() {

    var authService, $window, API_URL, $httpBackend, gamesService;

    beforeEach(module('app'));
    beforeEach(module('games'));

    beforeEach(inject(function(_authService_, _$window_, _API_URL_, _$httpBackend_, _gamesService_){
        authService = _authService_;
        var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJpYXQiOjE0NTI1MDM4ODksImV4cCI6MTQ1MzEwODY4OSwidWlkIjozMywibWFpbCI6InFAcS5xIn0.chn6C_ItxSWY0Y3n82M7RrxpppQiONJKYygeEybt7_g"
        authService.saveToken(token);

        $window = _$window_;
        API_URL = _API_URL_;
        $httpBackend = _$httpBackend_;
        gamesService = _gamesService_;
    }));

    describe('service.gamesService', function () {

        it('should be defined', function () {
            expect(gamesService).toBeDefined();
        });

        it('should have a dedicated methods', function () {
            expect(angular.isFunction(gamesService.addGame)).toBe(true);
            expect(angular.isFunction(gamesService.getTeamGames)).toBe(true);
            expect(angular.isFunction(gamesService.getPlayerGames)).toBe(true);
            expect(angular.isFunction(gamesService.removeGame)).toBe(true);
            expect(angular.isFunction(gamesService.updateGame)).toBe(true);
            expect(angular.isFunction(gamesService.joinGame)).toBe(true);
            expect(angular.isFunction(gamesService.rejectGame)).toBe(true);
        });

        it('should create new game', function () {
            $httpBackend
                .expectPOST(API_URL + '/games', {team_id:12, datetime:'2016-01-19 10:00:00', location:'stadium', title:'training'})
                .respond({});

            gamesService.addGame(12, '2016-01-19 10:00:00', 'stadium', 'training');

            $httpBackend.flush();
        });

        it('should request team games', function () {
            $httpBackend
                .expectGET(API_URL + '/teams/12?expand=games')
                .respond({});

            gamesService.getTeamGames(12);

            $httpBackend.flush();
        });

        it('should request player games', function () {
            $httpBackend
                .expectGET(API_URL + '/players/33?expand=games')
                .respond({});

            gamesService.getPlayerGames();

            $httpBackend.flush();
        });

        it('should remove the game', function () {
            $httpBackend
                .expectDELETE(API_URL + '/games/14')
                .respond({});

            gamesService.removeGame(14);

            $httpBackend.flush();
        });

        it('should update the game', function () {
            $httpBackend
                .expectPUT(API_URL + '/games/1', {location:'field 25'})
                .respond({});

            gamesService.updateGame(1, {location:'field 25'});

            $httpBackend.flush();
        });

        it('should join player to the game (update game)', function () {
            $httpBackend
                .expectPUT(API_URL + '/games/2', {join_player:33})
                .respond({});

            gamesService.joinGame(2);

            $httpBackend.flush();
        });

        it('should reject player game (update game)', function () {
            $httpBackend
                .expectPUT(API_URL + '/games/2', {reject_player:33})
                .respond({});

            gamesService.rejectGame(2);

            $httpBackend.flush();
        });
    });

    describe('controller', function() {
        var $controller;

        beforeEach(inject(function (_$controller_) {
            $controller = _$controller_;
        }));

        describe('GamesController', function () {
            var controller, $scope, teamsService;

            beforeEach(inject(function(_teamsService_){
               teamsService = _teamsService_;
            }));

            beforeEach(function () {
                $scope = {};

                $httpBackend
                    .expectGET(API_URL + '/players/33?expand=teams')
                    .respond({
                        teams: [
                            {id: 25, sport: 'football', name: 'Real', is_capitan: "0", players: [{id: 33}, {id: 34}]}
                        ]
                    });

                $httpBackend
                    .expectGET(API_URL + '/teams/25?expand=games')
                    .respond({
                        games: [
                            {id: 49, team_id: 25, title: "Training", datetime: "2016-05-20 12:00:00", location: "field 34"},
                            {id: 50, team_id: 25, title: "Training 2", datetime: "2016-05-20 13:00:00", location: "field 35"},
                            {id: 51, team_id: 25, title: "Training 3", datetime: "2016-05-20 14:00:00", location: "field 36"}
                        ]
                    });

                $httpBackend
                    .expectGET(API_URL + '/players/33?expand=games')
                    .respond({
                        games: [
                            {id: 49, team_id: 25, title: "Training", datetime: "2016-01-20 12:00:00", location: "field 34", presence:1},
                            {id: 50, team_id: 25, title: "Training 2", datetime: "2016-05-20 13:00:00", location: "field 35", presence:0},
                        ]
                    });

                controller = $controller('GamesController', {$scope: $scope}, gamesService, teamsService);

                $httpBackend.flush();
            });

            it('should be defined teams controller', function () {
                expect(controller).toBeDefined();
            });

            it('scope should have a teams defined with expected structure', function () {
                expect($scope.teams).toBeDefined();
                expect($scope.teams[25]).toBeDefined();
                expect($scope.teams[25].id).toBeDefined();
                expect($scope.teams[25].id).toEqual(25);
                expect($scope.teams[25].name).toEqual('Real');

                expect($scope.teams[25].games).toBeDefined();
                expect($scope.teams[25].games[0].title).toEqual('Training');
                expect($scope.teams[25].games.length).toEqual(3);
            });

            it('scope should have a player games defined with expected structure', function () {
                expect($scope.playerGames).toBeDefined();
                expect($scope.playerGames[49]).toBeDefined();
                expect($scope.playerGames[49].id).toBeDefined();
                expect($scope.playerGames[49].id).toEqual(49);
            });

            it('should remove game', function (){
                $httpBackend
                    .expectDELETE(API_URL + '/games/49')
                    .respond({});

                controller.removeGame(49, 25);

                $httpBackend.flush();

                expect($scope.teams[25].games.length).toEqual(2);
                expect($scope.alert.message).toEqual('Game has been removed.');
            });

            it('should return player presence on the game', function () {
                expect(controller.getUserPresenceOnGame(49)).toEqual('joined');
                expect(controller.getUserPresenceOnGame(50)).toEqual('rejected');
                expect(controller.getUserPresenceOnGame(51)).toEqual('');
            });

            it('should join player to the game', function () {
                $httpBackend
                    .expectPUT(API_URL + '/games/51', {join_player:33})
                    .respond({id:51});

                controller.setGamePresence(51, 1);

                $httpBackend.flush();

                expect(controller.getUserPresenceOnGame(51)).toEqual('joined');
            });

            it('should reject players game', function () {
                $httpBackend
                    .expectPUT(API_URL + '/games/51', {reject_player:33})
                    .respond({id:51});

                controller.setGamePresence(51, 0);

                $httpBackend.flush();

                expect(controller.getUserPresenceOnGame(51)).toEqual('rejected');
            });

            it('should set parameters for showing form for new game', function () {
                controller.showNewGameForm(25);
                expect($scope.newGame.showForm).toBeTruthy();
                expect($scope.newGame.teamId).toEqual(25);
            });

            it('should clear all temporarry data', function () {
                $scope.clearTempData();
                expect($scope.alert).toEqual({});
                expect($scope.newGame.showForm).toBeFalsy();
                expect($scope.newGame.teamId).toEqual(0);
                expect($scope.newGame.location).toEqual('');
                expect($scope.newGame.description).toEqual('');
                expect($scope.newGame.date).toBeDefined();
            });
        });
    });

});