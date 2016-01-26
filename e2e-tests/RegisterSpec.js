'use strict';

var RegisterPage = function (){

    this.get = function (){
        browser.get('#/register');
    }

    this.getHeaderLinks = function (){
        return [
            element(by.css('nav ul li:first-child a')),
            element(by.css('nav ul li:nth-child(2) a')),
            element(by.css('nav ul li:nth-child(3) a'))
        ];
    }

    this.getActiveHeaderLinkText = function (){
        return element(by.css('nav ul li.active')).getText();
    }

    this.getFormHeaderText = function (){
        return element(by.css('h2')).getText();
    }

    this.getForm = function (){
        return element(by.css('form'));
    }

    this.getFormButton = function (){
        return element(by.css('button'));
    }

    this.enterMail = function (mail) {
        element(by.model('player.email')).sendKeys(mail);
    }

    this.enterPassword = function (pass){
        element(by.model('player.password')).sendKeys(pass);
    }

    this.enterPasswordRepeat = function (pass){
        element(by.model('player.password_repeat')).clear().sendKeys(pass);
    }

    this.enterName = function (name){
        element(by.model('player.name')).sendKeys(name);
    }

    this.getErrorText = function (){
        return element(by.binding('error')).getText();
    }

    this.logout = function (){
        browser.get('#/logout');
    }

}

describe('my app register page', function() {
    var registerPage;

    var email = 'test' + new Date().getTime() + '@test.test';
    var pass = 'test';
    var name = 'Test';

    beforeAll(function (){
        registerPage = new RegisterPage();
    });

    it('should open registration page', function () {
        registerPage.get();
        expect(browser.getLocationAbsUrl()).toMatch("/register");
    });

    it('should have correct header links', function (){
        var headerLinks = registerPage.getHeaderLinks();
        expect(headerLinks[0].getText()).toEqual('Home');
        expect(headerLinks[1].getText()).toEqual('Register');
        expect(headerLinks[2].getText()).toEqual('Sign in');

        expect(registerPage.getActiveHeaderLinkText()).toEqual('Register');
    });

    it('should contain registration form and register button', function (){
        expect(registerPage.getFormHeaderText()).toContain('Please register');
        expect(registerPage.getForm()).toBeDefined();
        expect(registerPage.getFormButton().getText()).toEqual('Register');
    });

    it('should see error message when entering not equals passwords', function (){
        registerPage.enterMail(email);
        registerPage.enterPassword(pass);
        registerPage.enterPasswordRepeat(pass+'wrong');
        registerPage.enterName(name);

        registerPage.getFormButton().click();

        expect(registerPage.getErrorText()).toContain('Password must be equal');
    });

    it('should register new user and redirect to teams page', function (){
        registerPage.enterPasswordRepeat(pass);
        registerPage.getFormButton().click();

        expect(browser.getLocationAbsUrl()).toMatch("/teams");

        registerPage.logout();

        expect(browser.getLocationAbsUrl()).toMatch("/login");
    });
});