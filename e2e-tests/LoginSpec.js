'use strict';

describe('my app login page', function() {

    it('should open login page', function () {
        browser.get('#/login');
        expect(browser.getLocationAbsUrl()).toMatch("/login");
    });

    it('should have correct header links', function (){
        expect(element(by.css('nav ul li:first-child a')).getText()).toEqual('Home');
        expect(element(by.css('nav ul li:nth-child(2) a')).getText()).toEqual('Register');
        expect(element(by.css('nav ul li:nth-child(3) a')).getText()).toEqual('Sign in');

        expect(element(by.css('nav ul li.active')).getText()).toEqual('Sign in');
    });

    it('should contain log in form and log in button', function (){
        expect(element(by.css('h2')).getText()).toContain('Please sign in');
        expect(element(by.css('form'))).toBeDefined();
        expect(element(by.css('button')).getText()).toEqual('Sign in');
    });

    it('should not sign in user with wrong credentials and show error message', function (){

        element(by.model('user.email')).sendKeys('wrong@mail.com');
        element(by.model('user.password')).sendKeys('wrong');

        element(by.css('button')).click()

        expect(element(by.binding('error')).getText()).toContain('Incorrect username or password');
    });

    it('should sign in user and show dashboard page', function (){

        element(by.model('user.email')).clear().sendKeys('test@test.test');
        element(by.model('user.password')).clear().sendKeys('test');

        element(by.css('button')).click()

        expect(browser.getLocationAbsUrl()).toMatch("/dashboard");
    });

    afterAll(function(){
        element(by.css('nav ul li:last-child a')).click();
    });
});