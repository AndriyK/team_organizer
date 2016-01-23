'use strict';

describe('my app games page', function() {

    beforeAll(function () {
        browser.get('#/login');
        element(by.model('user.email')).sendKeys('test@test.test');
        element(by.model('user.password')).sendKeys('test');
        element(by.css('button')).click();

        browser.sleep(2000);

        browser.get('#/teams');
        element(by.id('addTeamButton')).click();
        element(by.model('createTeam.teamNew.name')).sendKeys('GamesTestTeam');
        element(by.id('newTeamForm')).submit();

        browser.sleep(1000);
    });

    it('should open teams page', function () {
        browser.get('#/games');
        expect(browser.getLocationAbsUrl()).toMatch("/games");
    });

    it('should have correct header links', function () {
        expect(element(by.css('nav ul li:nth-child(4) a')).getText()).toEqual('Dashboard');
        expect(element(by.css('nav ul li:nth-child(5) a')).getText()).toEqual('Teams');
        expect(element(by.css('nav ul li:nth-child(6) a')).getText()).toEqual('Games');
        expect(element(by.css('nav ul li:last-child a')).getText()).toEqual('Log out');

        expect(element(by.css('nav ul li.active')).getText()).toEqual('Games');
    });

    it('should not contain games', function () {
        expect(element(by.css('h3.panel-title')).getText()).toContain('GamesTestTeam');
        expect(element(by.css('div.panel-body')).getText()).toContain('No planned games.');
    });

    it('should add new game', function (){
        element(by.css('h3 span button')).click();

        element(by.model('newGame.location')).sendKeys('Field 1');
        element(by.model('newGame.description')).sendKeys('Important game');
        element(by.css('form')).submit();

        browser.sleep(1000);

        expect(element(by.css('div.alert-info')).getText()).toContain('Game has been added.');
        expect(element(by.css('div.panel-body')).getText()).toContain('Field 1');
        expect(element(by.css('div.panel-body')).getText()).toContain('Important game');
        expect(element(by.css('div.panel-body button.btn-success')).getText()).toContain('Join');
        expect(element(by.css('div.panel-body button.btn-danger')).getText()).toContain('Deny');
    });

    it('should join player to the game', function () {
        element(by.css('div.panel-body button.btn-success')).click();

        browser.sleep(1000);

        expect(element(by.css('div.panel-body button[disabled=disabled]')).getText()).toContain('Join');
        expect(element(by.css('div.panel-body button.btn-danger')).getText()).toContain('Deny');
    });

    it('should reject player from the game', function () {
        element(by.css('div.panel-body button.btn-danger')).click();

        browser.sleep(1000);

        expect(element(by.css('div.panel-body button.btn-success')).getText()).toContain('Join');
        expect(element(by.css('div.panel-body button[disabled=disabled]')).getText()).toContain('Deny');
    });

    it('should remove the game', function (){
        element(by.css('div.panel-body a')).click();

        expect(element(by.css('div.alert-info')).getText()).toContain('Game has been removed.');
        expect(element(by.css('div.panel-body')).getText()).toContain('No planned games.');
    });

    afterAll(function (){
        browser.get('#/teams');
        element(by.css('div.panel-heading a')).click();
        var delButton = element(by.css('div.panel-body div.pull-right button:first-child'));
        delButton.click();
        browser.switchTo().alert().accept();

        browser.sleep(1000);

        browser.get('#/logout');
    });
});