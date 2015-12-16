'use strict';

describe('app.logout', function() {

    beforeEach(module('app'));

    var $controller;

    beforeEach(inject(function(_$controller_){
        $controller = _$controller_;
    }));

    describe('logout controller', function(){
        var $location, controller, $window, auth;

        beforeEach(inject(function(_$location_, _$window_, _auth_){
            $location = _$location_;
            $location.path("/logout");

            $window = _$window_;
            $window.localStorage.token = "security_tocken";

            auth = _auth_;
        }));

        beforeEach(function() {
            controller = $controller('LogoutCtrl', $location, auth);
        });

        it('should be defined logout controller', function() {
            expect(controller).toBeDefined();
        });

        it('should change location path to login page', function(){
            expect($location.path()).toEqual("/login");
        });

        it('user should be not authed', function(){
            expect(auth.isAuthed()).toBeFalsy();
        });
    });
});