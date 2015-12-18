'use strict';

describe('app.login', function() {

    beforeEach(module('app'));

    var $controller;

    beforeEach(inject(function(_$controller_){
        $controller = _$controller_;
    }));

    describe('login controller', function(){
        var $location, controller, auth, user, $scope, $httpBackend, API;

        beforeEach(inject(function(_$location_, _user_, _auth_, _$httpBackend_, _API_){
            $location = _$location_;
            auth = _auth_;
            $scope = {};
            $httpBackend = _$httpBackend_;
            API = _API_;
        }));

        beforeEach(function() {
            controller = $controller('LoginCtrl', {$scope: $scope}, user, auth, $location);
        });

        it('should be defined login controller', function() {
            expect(controller).toBeDefined();
        });

        it('should return token for correct credentials', function() {

            var userData = {"email":"correct@mail.com", "password":"pass"};

            $scope.user = userData;

            $httpBackend
                .expectPOST(API + '/auth/login', userData)
                .respond({"token": "security_token"});

            $scope.login();

            $httpBackend.flush();

            expect(auth.getToken()).toEqual("security_token");
            expect($location.path()).toEqual("/player");
        });

        it('should return error message for wrong credentials', function() {

            var userData = {"email":"wrong@mail.com", "password":"pass"};
            var error_message = "Email or password not correct";

            $scope.user = userData;

            $httpBackend
                .expectPOST(API + '/auth/login', userData)
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