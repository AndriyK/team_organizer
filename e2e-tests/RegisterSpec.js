'use strict';

describe('my app register page', function() {

    it('should open registration page', function () {
        browser.get('#/register');
        expect(browser.getLocationAbsUrl()).toMatch("/register");
    });

    it('should contain registration form and register button', function (){
        expect(element(by.css('h2')).getText()).toContain('Please register');
        expect(element(by.css('form'))).toBeDefined();
        expect(element(by.css('button')).getText()).toEqual('Register');
    });

    it('should register new user and redirect to teams page', function (){
        var email = 'test' + new Date().getTime() + '@test.test';
        var pass = 'test';
        var name = 'Test';

        element(by.model('player.email')).sendKeys(email);
        element(by.model('player.password')).sendKeys(pass);
        element(by.model('player.password_repeat')).sendKeys(pass);
        element(by.model('player.name')).sendKeys(name);

        element(by.css('button')).click();

        //expect(browser.getLocationAbsUrl()).toMatch("/teams");
        //browser.driver.sleep(5000);
    });
});