'use strict';

describe('my app', function() {

    it('should automatically redirect to / when location hash/fragment is empty', function () {
        browser.get('index.html');
        expect(browser.getLocationAbsUrl()).toMatch("/");
    });

    it('should contain correct ads heading test, sign up button and marketing text', function (){
        expect(element(by.css('h1')).getText()).toContain('Team organizer');
        expect(element(by.css('div.jumbotron a')).getText()).toEqual('Sign up today');

        var desc = element(by.css('div.marketing')).getText();
        expect(desc).toContain('Team');
        expect(desc).toContain('Player');
        expect(desc).toContain('Game');
        expect(desc).toContain('Report');
    });

    it('should have correct header links', function (){
        expect(element(by.css('nav ul li:first-child a')).getText()).toEqual('Home');
        expect(element(by.css('nav ul li:nth-child(2) a')).getText()).toEqual('Register');
        expect(element(by.css('nav ul li:nth-child(3) a')).getText()).toEqual('Sign in');

        expect(element(by.css('nav ul li.active')).getText()).toEqual('Home');
    });

    it('should open registration page when sign up button was clicked', function (){
        element(by.css('div.jumbotron a')).click();
        expect(browser.getLocationAbsUrl()).toMatch("/register");
    });

    it('should open log in page when log in link in header was clicked', function (){
        element(by.css('nav ul li:nth-child(3) a')).click();
        expect(browser.getLocationAbsUrl()).toMatch("/login");
    });

    it('should open registration page when register link in header was clicked', function (){
        element(by.css('nav ul li:nth-child(2) a')).click();
        expect(browser.getLocationAbsUrl()).toMatch("/register");
    });
});