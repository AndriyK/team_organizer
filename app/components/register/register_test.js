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

        it('should return token for newly created user', function() {

            var userData = {"email":"some@mail.com", "password":"pass", "password_repeat":"pass", "name":"Player"};

            $scope.player = userData;

            $httpBackend
                .expectPOST(API_URL + '/players', userData)
                .respond({"token": "security_token_for_newly_created_user"});

            $scope.register();

            $httpBackend.flush();

            expect(authService.getToken()).toEqual("security_token_for_newly_created_user");
            expect($location.path()).toEqual("/dashboard");
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
});