'use strict';

describe('my app register page', function() {
    var email = 'test' + new Date().getTime() + '@test.test';
    var pass = 'test';
    var name = 'Test';

    it('should open registration page', function () {
        browser.get('#/register');
        expect(browser.getLocationAbsUrl()).toMatch("/register");
    });

    it('should have correct header links', function (){
        expect(element(by.css('nav ul li:first-child a')).getText()).toEqual('Home');
        expect(element(by.css('nav ul li:nth-child(2) a')).getText()).toEqual('Register');
        expect(element(by.css('nav ul li:nth-child(3) a')).getText()).toEqual('Sign in');

        expect(element(by.css('nav ul li.active')).getText()).toEqual('Register');
    });

    it('should contain registration form and register button', function (){
        expect(element(by.css('h2')).getText()).toContain('Please register');
        expect(element(by.css('form'))).toBeDefined();
        expect(element(by.css('button')).getText()).toEqual('Register');
    });

    it('should see error message when entering not equals passwords', function (){

        element(by.model('player.email')).sendKeys(email);
        element(by.model('player.password')).sendKeys(pass);
        element(by.model('player.password_repeat')).sendKeys(pass+'wrong');
        element(by.model('player.name')).sendKeys(name);

        element(by.css('button')).click();

        expect(element(by.binding('error')).getText()).toContain('Password must be equal');
    });

    it('should register new user and redirect to teams page', function (){
        element(by.model('player.password_repeat')).clear().sendKeys(pass);
        element(by.css('button')).click();

        expect(browser.getLocationAbsUrl()).toMatch("/teams");

        // logout
        var logout = element(by.css('nav ul li:last-child a'))
        expect(logout.getText()).toEqual('Log out');
        logout.click();

        expect(browser.getLocationAbsUrl()).toMatch("/login");
    });
});