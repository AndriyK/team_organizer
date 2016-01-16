'use strict';

describe('teams', function() {
    var authService, $window, API_URL, $httpBackend, teamsService;

    beforeEach(module('app'));
    beforeEach(module('teams'));

    beforeEach(inject(function(_authService_, _$window_, _API_URL_, _$httpBackend_, _teamsService_){
        authService = _authService_;
        var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJpYXQiOjE0NTI1MDM4ODksImV4cCI6MTQ1MzEwODY4OSwidWlkIjozMywibWFpbCI6InFAcS5xIn0.chn6C_ItxSWY0Y3n82M7RrxpppQiONJKYygeEybt7_g"
        authService.saveToken(token);

        $window = _$window_;
        API_URL = _API_URL_;
        $httpBackend = _$httpBackend_;
        teamsService = _teamsService_;
    }));

    describe('service.teamsService', function () {

        it('should be defined', function () {
            expect(teamsService).toBeDefined();
        });

        it('should have a dedicated methods', function () {
            expect(angular.isFunction(teamsService.getTeams)).toBe(true);
            expect(angular.isFunction(teamsService.find)).toBe(true);
            expect(angular.isFunction(teamsService.createTeam)).toBe(true);
            expect(angular.isFunction(teamsService.updateTeam)).toBe(true);
            expect(angular.isFunction(teamsService.joinPlayer)).toBe(true);
            expect(angular.isFunction(teamsService.removePlayer)).toBe(true);
            expect(angular.isFunction(teamsService.joinToTeam)).toBe(true);
            expect(angular.isFunction(teamsService.removeTeam)).toBe(true);
        });

        it('should request player teams', function () {
            $httpBackend
                .expectGET(API_URL + '/players/33?expand=teams')
                .respond({});

            teamsService.getTeams();

            $httpBackend.flush();
        });

        it('should create new team', function () {
            $httpBackend
                .expectPOST(API_URL + '/teams', {name:'team name', sport: 'football'})
                .respond({});

            teamsService.createTeam('team name', 'football');

            $httpBackend.flush();
        });

        it('should request teams search for passed criterias', function () {
            $httpBackend
                .expectGET(API_URL + '/teams/search?name=test&email=q@q.q')
                .respond({});

            teamsService.find('test', 'q@q.q');

            $httpBackend.flush();
        });

        it('should update the team', function () {
            $httpBackend
                .expectPUT(API_URL + '/teams/1', {name:'new name'})
                .respond({});

            teamsService.updateTeam(1, {name: 'new name'});

            $httpBackend.flush();
        });

        it('should join player to the team (update team)', function () {
            $httpBackend
                .expectPUT(API_URL + '/teams/2', {join_player:'w@w.w'})
                .respond({});

            teamsService.joinPlayer(2, 'w@w.w');

            $httpBackend.flush();
        });

        it('should remove player from the team (update team)', function () {
            $httpBackend
                .expectPUT(API_URL + '/teams/2', {remove_player:'w@w.w'})
                .respond({});

            teamsService.removePlayer(2, 'w@w.w');

            $httpBackend.flush();
        });

        it('should rename team (update team)', function () {
            $httpBackend
                .expectPUT(API_URL + '/teams/3', {name:'new_name'})
                .respond({});

            teamsService.renameTeam(3, 'new_name');

            $httpBackend.flush();
        });

        it('should remove current player from the team (update team)', function () {
            $httpBackend
                .expectPUT(API_URL + '/teams/4', {remove_player:'q@q.q'})
                .respond({});

            teamsService.leaveTeam(4);

            $httpBackend.flush();
        });

        it('should join current player to the team (update team)', function () {
            $httpBackend
                .expectPUT(API_URL + '/teams/5', {join_player:'q@q.q'})
                .respond({});

            teamsService.joinToTeam(5);

            $httpBackend.flush();
        });

        it('should remove the team', function () {
            $httpBackend
                .expectDELETE(API_URL + '/teams/6')
                .respond({});

            teamsService.removeTeam(6);

            $httpBackend.flush();
        });

    });

    describe('controller', function() {
        var $controller;

        beforeEach(inject(function (_$controller_) {
            $controller = _$controller_;
        }));

        describe('TeamsController', function () {
            var controller, $scope;

            beforeEach(function () {
                $scope = {};

                $httpBackend
                    .expectGET(API_URL + '/players/33?expand=teams')
                    .respond({
                        teams: [
                            {id: '25', sport:'football', name:'Real', is_capitan: "0", players: [{id:33}, {id:34}]},
                            {id: '30', sport:'football', name:'Barcelona', is_capitan: "1", players: [{id:33}, {id:35}]},
                        ]
                    });

                controller = $controller('TeamsController', {$scope: $scope}, teamsService);

                $httpBackend.flush();
            });

            it('should be defined teams controller', function () {
                expect(controller).toBeDefined();
            });

            it('scope should have a teams defined', function () {
                expect($scope.teams).toBeDefined();
            });

            it('should receive teams from teams service', function () {
                expect($scope.teams.length).toBe(2);
            });

            it('should receive teams from teams service with expected structure', function () {
                var team = $scope.teams[0];
                expect(team.id).toBeDefined();
                expect(team.sport).toBeDefined();
                expect(team.name).toBeDefined();
                expect(team.is_capitan).toBeDefined();
                expect(team.players).toBeDefined();
            });

            it('scope should have a updateTeamPlayers method', function () {
                expect($scope.updateTeamPlayers).toBeDefined();
                expect(angular.isFunction($scope.updateTeamPlayers)).toBe(true);
            });

            it('should update players list for team', function () {
                expect($scope.teams[0].players.length).toEqual(2);

                $scope.updateTeamPlayers(25, [{id:33}]);

                expect($scope.teams[0].players.length).toEqual(1);

            });

            describe('PlayersController', function () {
                beforeEach(function () {
                    controller = $controller('PlayersController', {$scope: $scope}, teamsService);
                });

                it('should be defined players controller', function () {
                    expect(controller).toBeDefined();
                });

                it('should remove player from the team', function () {
                    $httpBackend
                        .expectPUT(API_URL + '/teams/25', {remove_player:'w@w.w'})
                        .respond({players:[{id:33}]});

                    controller.removePlayer(25, 'w@w.w');

                    $httpBackend.flush();

                    expect($scope.teams[0].players.length).toEqual(1);
                });

                it('should correctly define when to show remove player link (for capitan only)', function () {
                    expect(controller.showRemovePlayerLink({is_capitan:"1"}, {})).toBeTruthy(); // capitan of the team
                    expect(controller.showRemovePlayerLink({is_capitan:"1"}, {is_capitan:"1"})).toBeFalsy(); // capitan can remove itself
                    expect(controller.showRemovePlayerLink({is_capitan:"0"}, {})).toBeFalsy();
                    expect(controller.showRemovePlayerLink({}, {})).toBeFalsy();
                });
            });

            describe('TeamManagementController', function () {
                beforeEach(function () {
                    controller = $controller('TeamManagementController', {$scope: $scope}, teamsService);
                });

                it('should be defined players controller', function () {
                    expect(controller).toBeDefined();
                });

                it('should remove the team', function () {
                    spyOn(window, 'confirm').and.callFake(function () {
                        return true;
                    });

                    $httpBackend
                        .expectDELETE(API_URL + '/teams/25')
                        .respond({});

                    controller.removeTeam({id:25});

                    $httpBackend.flush();
                    expect($scope.teams.length).toEqual(1);
                });

                it('should not remove the team when it was not confirmed', function () {
                    spyOn(window, 'confirm').and.callFake(function () {
                        return false;
                    });

                    controller.removeTeam({id:25});
                    expect($scope.teams.length).toEqual(2);
                });

            });
        });


    });

});