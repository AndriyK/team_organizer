'use strict';

var LoginPage = function() {

    this.get = function (){
        browser.get('#/login');
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
        element(by.model('user.email')).clear().sendKeys(mail);
    }

    this.enterPassword = function (pass){
        element(by.model('user.password')).clear().sendKeys(pass);
    }

    this.getErrorText = function (){
        return element(by.binding('error')).getText();
    }

    this.logout = function (){
        browser.get('#/logout');
    }
}

describe('my app login page', function() {

    var loginPage;

    beforeAll(function (){
        loginPage = new LoginPage();
    });

    it('should open login page', function () {
        loginPage.get();
        expect(browser.getLocationAbsUrl()).toMatch("/login");
    });

    it('should have correct header links', function (){
        var headerLinks = loginPage.getHeaderLinks();

        expect(headerLinks[0].getText()).toEqual('Home');
        expect(headerLinks[1].getText()).toEqual('Register');
        expect(headerLinks[2].getText()).toEqual('Sign in');

        expect(loginPage.getActiveHeaderLinkText()).toEqual('Sign in');
    });

    it('should contain log in form and log in button', function (){
        expect(loginPage.getFormHeaderText()).toContain('Please sign in');
        expect(loginPage.getForm()).toBeDefined();
        expect(loginPage.getFormButton().getText()).toEqual('Sign in');
    });

    it('should not sign in user with wrong credentials and show error message', function (){
        loginPage.enterMail('wrong@mail.com');
        loginPage.enterPassword('wrong');

        loginPage.getFormButton().click();

        expect(loginPage.getErrorText()).toContain('Incorrect username or password');
    });

    it('should sign in user and show dashboard page', function (){
        loginPage.enterMail('test@test.test');
        loginPage.enterPassword('test');

        loginPage.getFormButton().click();

        expect(browser.getLocationAbsUrl()).toMatch("/dashboard");
    });

    afterAll(function(){
        loginPage.logout();
    });
});