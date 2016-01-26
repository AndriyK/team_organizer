'use strict';

describe('app', function() {
    var httpProvider;

    beforeEach(module('app', function ($httpProvider) {
        httpProvider = $httpProvider;
    }));

    describe('factory.authInterceptor', function(){
        var authInterceptor, API_URL, authService, $location, $window;
        var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJpYXQiOjE0NTI1MDM4ODksImV4cCI6MTQ1MzEwODY4OSwidWlkIjozMywibWFpbCI6InFAcS5xIn0.chn6C_ItxSWY0Y3n82M7RrxpppQiONJKYygeEybt7_g"

        beforeEach(inject(function(_authInterceptor_, _API_URL_, _authService_, _$location_, _$window_){
            authInterceptor = _authInterceptor_;
            API_URL = _API_URL_;
            authService = _authService_;
            $location = _$location_;
            $window = _$window_;
        }));

        it('should be defined', function() {
            expect(authInterceptor).toBeDefined();
        });

        it('should have the authInterceptor as an interceptor', function () {
            expect(httpProvider.interceptors).toContain('authInterceptor');
        });

        describe('request interceptor', function (){

            beforeEach(function(){
                authService.logout();
            });

            it('should have a handler for request', function () {
                expect(angular.isFunction(authInterceptor.request)).toBe(true);
            });

            it('should not add auth header when it is not set', function () {
                var init_config = {
                    'url': API_URL,
                    'headers': {}
                }
                var config = authInterceptor.request(init_config);
                expect(config.headers['Authorization']).toBe(undefined);
            });

            it('should add auth header when it is set', function () {
                authService.saveToken(token);

                var init_config = {
                    'url': API_URL,
                    'headers': {}
                }
                var config = authInterceptor.request(init_config);
                expect(config.headers['Authorization']).toBe('Bearer ' + token);
            });

            it('should not add auth header when request is sent to not api url', function () {
                authService.saveToken(token);
                var init_config = {
                    'url': 'wrong_url',
                    'headers': {}
                }
                var config = authInterceptor.request(init_config);
                expect(config.headers['Authorization']).toBe(undefined);
            });
        });

        describe('response interceptor', function (){

            it('should have a handler for response', function () {
                expect(angular.isFunction(authInterceptor.response)).toBe(true);
            });

            it('should save security token from response data', function () {
                var response = {
                    'config': {'url': API_URL},
                    'data': {'token': token},
                    'headers': function (key){}
                }
                authInterceptor.response(response);
                expect(authService.getToken()).toBe(token);
            });

            it('should save security token from response headers', function () {
                var response = {
                    'config': {'url': API_URL},
                    'data': {},
                    'headers': function (key){
                        if(key == 'X-Token'){
                            return token;
                        }
                    }
                }
                authInterceptor.response(response);
                expect(authService.getToken()).toBe(token);
            });

            it('should save security token from response only for API URL', function () {
                authService.logout();
                var response = {
                    'config': {'url': 'wrong_url'},
                    'data': {'token': 'security_token_body2'},
                    'headers': function (key){}
                }
                authInterceptor.response(response);
                expect(authService.getToken()).toBe(undefined);
            });

        });

        describe('responseError interceptor', function() {
            it('should have a handler for responseError', function () {
                expect(angular.isFunction(authInterceptor.responseError)).toBe(true);
            });

            it('should redirect to login page for 401 unauthorized error', function () {
                $location.path('/teams');
                authInterceptor.responseError({status: 401});
                expect($location.path()).toBe('/login');
            });

            it('should not redirect for other errors', function () {
                $location.path('/teams');
                authInterceptor.responseError({status: 404});
                expect($location.path()).toBe('/teams');
            });
        });
    });

    describe('service.authService', function(){
        var authService, $window;

        beforeEach(inject(function(_$window_, _authService_){
            $window = _$window_;
            authService = _authService_;
        }));

        it('should save/get token from/to local storage', function() {
            var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJpYXQiOjE0NTM4MDg1NTQsImV4cCI6MTQ1NDQxMzM1NCwidWlkIjozMywibWFpbCI6InFAcS5xIn0._YPVN1YlQIRpqiMBr94SoVgDp0-u8MxQv6dO1unPSYk"
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

    describe('service.userService', function (){
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

    describe('directive.sportIcon', function (){
        var $compile, $rootScope;

        beforeEach(inject(function(_$compile_, _$rootScope_){
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        }));

        it('Replaces sport and icon size', function() {
            var element = $compile("<sport-icon sport='football' size='20'></sport-icon>")($rootScope);
            $rootScope.$digest();
            expect(element.html()).toContain('img ng-src="assets/img/football.gif" width="20px" height="20px" align="top"');
        });

        it('Replaces sport use default size', function() {
            var element = $compile("<sport-icon sport='basketball'></sport-icon>")($rootScope);
            $rootScope.$digest();
            expect(element.html()).toContain('img ng-src="assets/img/basketball.gif" width="17px" height="17px" align="top"');
        });
    })

});