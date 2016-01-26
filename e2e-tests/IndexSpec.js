'use strict';

var IndexPage = function() {

    var mainPageTitle = element(by.css('h1'));
    var mainRegisterButton = element(by.css('div.jumbotron a'));
    var descriptionBlock = element(by.css('div.marketing'));

    this.get = function (){
        browser.get('index.html');
    }

    this.getMainPageTitle = function (){
        return mainPageTitle.getText();
    }

    this.getMainRegisterButtonText = function (){
        return mainRegisterButton.getText();
    }

    this.getDescriptionBlockText = function (){
        return descriptionBlock.getText();
    }

    this.clickMainRegisterButton = function (){
        mainRegisterButton.click();
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

    this.clickLoginLink = function (){
        element(by.css('nav ul li:nth-child(3) a')).click();
    }

    this.clickRegisterationLink = function (){
        element(by.css('nav ul li:nth-child(2) a')).click();
    }
}

describe('my app', function() {
    var indexPage;

    beforeAll(function (){
        indexPage = new IndexPage();
    });

    it('should automatically redirect to / when location hash/fragment is empty', function () {
        indexPage.get();
        expect(browser.getLocationAbsUrl()).toMatch("/");
    });

    it('should contain correct ads heading test, sign up button and marketing text', function (){
        expect(indexPage.getMainPageTitle()).toContain('Team organizer');
        expect(indexPage.getMainRegisterButtonText()).toEqual('Sign up today');
        var desc = indexPage.getDescriptionBlockText();
        expect(desc).toContain('Team');
        expect(desc).toContain('Player');
        expect(desc).toContain('Game');
        expect(desc).toContain('Report');
    });

    it('should have correct header links', function (){
        var headerLinks = indexPage.getHeaderLinks();
        expect(headerLinks[0].getText()).toEqual('Home');
        expect(headerLinks[1].getText()).toEqual('Register');
        expect(headerLinks[2].getText()).toEqual('Sign in');

        expect(indexPage.getActiveHeaderLinkText()).toEqual('Home');
    });

    it('should open registration page when sign up button was clicked', function (){
        indexPage.clickMainRegisterButton();
        expect(browser.getLocationAbsUrl()).toMatch("/register");
    });

    it('should open log in page when log in link in header was clicked', function (){
        indexPage.clickLoginLink();
        expect(browser.getLocationAbsUrl()).toMatch("/login");
    });

    it('should open registration page when register link in header was clicked', function (){
        indexPage.clickRegisterationLink();
        expect(browser.getLocationAbsUrl()).toMatch("/register");
    });
});