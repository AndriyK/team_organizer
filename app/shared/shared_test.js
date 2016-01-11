'use strict';

describe('app.shared', function() {

    beforeEach(module('app'));

    var $controller;

    beforeEach(inject(function(_$controller_){
        $controller = _$controller_;
    }));

    describe('header controller', function(){
        var $location, controller;

        beforeEach(inject(function(_$location_){
            $location = _$location_;
        }));

        beforeEach(function() {
            controller = $controller('HeaderCtrl', $location);
        });

        it('should be defined header controller', function() {
            expect(controller).toBeDefined();
        });

        it('should be functional isPageActive method', function(){
            var path = "/login";

            expect(controller.isPageActive(path)).toBeFalsy();

            $location.path(path);

            expect(controller.isPageActive(path)).toBeTruthy();
        });

        it('should have isUserLogged method', function(){
            expect(controller.isUserLogged).toBeDefined();
        });

    });
});