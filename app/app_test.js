'use strict';

describe('app.main file', function() {

    beforeEach(module('app'));

    describe('authService', function(){
        var auth, $window;

        beforeEach(inject(function(_$window_, _auth_){
            $window = _$window_;
            auth = _auth_;
        }));

        it('should save/get token from/to local storage', function() {
            var token = "test_token"
            auth.saveToken(token);
            expect(auth.getToken()).toEqual(token);
        });

        it('should detect user as logged when token present', function() {
            expect(auth.isAuthed()).toBeTruthy();
        });

        it('should remove token when user logged out', function() {
            auth.logout();
            expect(auth.isAuthed()).toBeFalsy();
        });
    });

    describe('userService', function (){
       var user, $httpBackend, API;

        beforeEach(inject(function(_$httpBackend_, _user_, _API_){
            $httpBackend = _$httpBackend_;
            user = _user_;
            API = _API_;
        }));

        it('should send register request via POST', function() {
            var registerObj = {"email":"some@mail.com", "password":"pass", "name":"Jonh"};

            $httpBackend
                .expectPOST(API + '/players', registerObj)
                .respond({});

            user.register(registerObj);

            $httpBackend.flush();
        });

        it('should send login request via POST', function() {
            $httpBackend
                .expectPOST(API + '/auth/login', {"email":"some@mail.com", "password":"pass"})
                .respond({});

            user.login("some@mail.com", "pass");

            $httpBackend.flush();
        });

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });
});