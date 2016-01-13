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
            authService.isAuthed();

            $httpBackend
                .expectGET(API_URL + '/dashboard/33')
                .respond({});

            dashboardService.get();

            $httpBackend.flush();
        });

    });

});