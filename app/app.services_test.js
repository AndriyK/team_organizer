'use strict';

describe('app.services', function() {

    beforeEach(module('app'));

    describe('authService', function(){
        var authService, $window;

        beforeEach(inject(function(_$window_, _authService_){
            $window = _$window_;
            authService = _authService_;
        }));

        it('should save/get token from/to local storage', function() {
            var token = "test_token"
            authService.saveToken(token);
            expect(authService.getToken()).toEqual(token);
        });

        it('should detect user as logged when token present', function() {
            expect(authService.isAuthed()).toBeTruthy();
        });

        it('should remove token when user logged out', function() {
            authService.logout();
            expect(authService.isAuthed()).toBeFalsy();
        });
    });

    describe('userService', function (){
       var userService, $httpBackend, API_URL;

        beforeEach(inject(function(_$httpBackend_, _userService_, _API_URL_){
            $httpBackend = _$httpBackend_;
            userService = _userService_;
            API_URL = _API_URL_;
        }));

        it('should send register request via POST', function() {
            var registerObj = {"email":"some@mail.com", "password":"pass", "name":"Jonh"};

            $httpBackend
                .expectPOST(API_URL + '/players', registerObj)
                .respond({});

            userService.register(registerObj);

            $httpBackend.flush();
        });

        it('should send login request via POST', function() {
            $httpBackend
                .expectPOST(API_URL + '/auth/login', {"email":"some@mail.com", "password":"pass"})
                .respond({});

            userService.login("some@mail.com", "pass");

            $httpBackend.flush();
        });

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });
});