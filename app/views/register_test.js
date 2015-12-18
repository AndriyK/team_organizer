'use strict';

describe('app.register', function() {

    beforeEach(module('app'));

    var $controller;

    beforeEach(inject(function(_$controller_){
        $controller = _$controller_;
    }));

    describe('register controller', function(){
        var $location, controller, auth, user, $scope, $httpBackend, API;

        beforeEach(inject(function(_$location_, _user_, _auth_, _$httpBackend_, _API_){
            $location = _$location_;
            auth = _auth_;
            $scope = {};
            $httpBackend = _$httpBackend_;
            API = _API_;
        }));

        beforeEach(function() {
            controller = $controller('RegisterCtrl', {$scope: $scope}, user, auth, $location);
        });

        it('should be defined login controller', function() {
            expect(controller).toBeDefined();
        });

        it('should return token for newly created user', function() {

            var userData = {"email":"some@mail.com", "password":"pass", "password_repeat":"pass", "name":"Player"};

            $scope.player = userData;

            $httpBackend
                .expectPOST(API + '/players', userData)
                .respond({"token": "security_token_for_newly_created_user"});

            $scope.register();

            $httpBackend.flush();

            expect(auth.getToken()).toEqual("security_token_for_newly_created_user");
            expect($location.path()).toEqual("/player");
        });

        it('should return error message for wrong register data', function() {

            var userData = {"email":"already_existing@mail.com", "password":"pass", "password_repeat":"pass2"};
            var errors = [{"message":"Entered emial already exists"}, {"message":"Password should match"}];

            $scope.player = userData;

            $httpBackend
                .expectPOST(API + '/players', userData)
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