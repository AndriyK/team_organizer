'use strict';

describe('app..components.login', function() {

    beforeEach(module('app'));

    var $controller;

    beforeEach(inject(function(_$controller_){
        $controller = _$controller_;
    }));

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

            var userData = {"email":"correct@mail.com", "password":"pass"};

            $scope.user = userData;

            $httpBackend
                .expectPOST(API_URL + '/auth/login', userData)
                .respond({"token": "security_token"});

            $scope.login();

            $httpBackend.flush();

            expect(authService.getToken()).toEqual("security_token");
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
});