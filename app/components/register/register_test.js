'use strict';

describe('app.components.register', function() {

    beforeEach(module('app'));

    var $controller;

    beforeEach(inject(function(_$controller_){
        $controller = _$controller_;
    }));

    describe('register controller', function(){
        var $location, controller, authService, userService, $scope, $httpBackend, API_URL;

        beforeEach(inject(function(_$location_, _userService_, _authService_, _$httpBackend_, _API_URL_){
            $location = _$location_;
            authService = _authService_;
            $scope = {};
            $httpBackend = _$httpBackend_;
            API_URL = _API_URL_;
        }));

        beforeEach(function() {
            controller = $controller('RegisterCtrl', {$scope: $scope}, userService, authService, $location);
        });

        it('should be defined login controller', function() {
            expect(controller).toBeDefined();
        });

        it('should return token for newly created user and redirect to teams page', function() {
            var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJpYXQiOjE0NTI1MDM4ODksImV4cCI6MTQ1MzEwODY4OSwidWlkIjozMywibWFpbCI6InFAcS5xIn0.chn6C_ItxSWY0Y3n82M7RrxpppQiONJKYygeEybt7_g"
            var userData = {"email":"some@mail.com", "password":"pass", "password_repeat":"pass", "name":"Player"};

            $scope.player = userData;

            $httpBackend
                .expectPOST(API_URL + '/players', userData)
                .respond({"token": token});

            $scope.register();

            $httpBackend.flush();

            expect(authService.getToken()).toEqual(token);
            expect($location.path()).toEqual("/teams");
        });

        it('should return error message for wrong register data', function() {

            var userData = {"email":"already_existing@mail.com", "password":"pass", "password_repeat":"pass2"};
            var errors = [{"message":"Entered emial already exists"}, {"message":"Password should match"}];

            $scope.player = userData;

            $httpBackend
                .expectPOST(API_URL + '/players', userData)
                .respond(401, errors);

            $scope.register();

            $httpBackend.flush();

            expect($scope.errors[0]).toEqual(errors[0].message);
            expect($scope.errors[1]).toEqual(errors[1].message);
        });

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });


    describe('login controller', function(){
        var $location, controller, authService, userService, $scope, $httpBackend, API_URL;

        beforeEach(inject(function(_$location_, _userService_, _authService_, _$httpBackend_, _API_URL_){
            $location = _$location_;
            authService = _authService_;
            $scope = {};
            $httpBackend = _$httpBackend_;
            API_URL = _API_URL_;
        }));

        beforeEach(function() {
            controller = $controller('LoginCtrl', {$scope: $scope}, userService, authService, $location);
        });

        it('should be defined login controller', function() {
            expect(controller).toBeDefined();
        });

        it('should return token for correct credentials', function() {
            var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJpYXQiOjE0NTI1MDM4ODksImV4cCI6MTQ1MzEwODY4OSwidWlkIjozMywibWFpbCI6InFAcS5xIn0.chn6C_ItxSWY0Y3n82M7RrxpppQiONJKYygeEybt7_g"
            var userData = {"email":"correct@mail.com", "password":"pass"};

            $scope.user = userData;

            $httpBackend
                .expectPOST(API_URL + '/auth/login', userData)
                .respond({"token": token});

            $scope.login();

            $httpBackend.flush();

            expect(authService.getToken()).toEqual(token);
            expect($location.path()).toEqual("/dashboard");
        });

        it('should return error message for wrong credentials', function() {

            var userData = {"email":"wrong@mail.com", "password":"pass"};
            var error_message = "Email or password not correct";

            $scope.user = userData;

            $httpBackend
                .expectPOST(API_URL + '/auth/login', userData)
                .respond(401, {"errors": [error_message]});

            $scope.login();

            $httpBackend.flush();

            expect($scope.errors[0]).toEqual(error_message);
        });

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

    });


    describe('logout controller', function(){
        var $location, controller, $window, authService;

        beforeEach(inject(function(_$location_, _$window_, _authService_){
            $location = _$location_;
            $location.path("/logout");

            $window = _$window_;
            $window.localStorage.token = "security_tocken";

            authService = _authService_;
        }));

        beforeEach(function() {
            controller = $controller('LogoutCtrl', $location, authService);
        });

        it('should be defined logout controller', function() {
            expect(controller).toBeDefined();
        });

        it('should change location path to login page', function(){
            expect($location.path()).toEqual("/login");
        });

        it('user should be not authed', function(){
            expect(authService.isAuthed()).toBeFalsy();
        });
    });
});