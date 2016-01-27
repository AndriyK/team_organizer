'use strict';

var GamesPage = function (){

    var joinButton = element(by.css('div.panel-body button.btn-success'));
    var denyButton = element(by.css('div.panel-body button.btn-danger'));

    this.login = function (){
        browser.get('#/login');
        element(by.model('user.email')).sendKeys('test@test.test');
        element(by.model('user.password')).sendKeys('test');
        element(by.css('button')).click();
        browser.sleep(2000);
    }

    this.createTeam = function (){
        browser.get('#/teams');
        element(by.id('addTeamButton')).click();
        element(by.model('createTeam.teamNew.name')).sendKeys('GamesTestTeam');
        element(by.id('newTeamForm')).submit();
        browser.sleep(1000);
    }

    this.removeTeam = function (){
        browser.get('#/teams');
        element(by.css('div.panel-heading a')).click();
        var delButton = element(by.css('div.panel-body div.pull-right button:first-child'));
        delButton.click();
        browser.switchTo().alert().accept();
        browser.sleep(1000);
    }

    this.logout = function (){
        browser.get('#/logout');
    }

    this.get = function (){
        browser.get('#/games');
    }

    this.getHeaderLinks = function (){
        return [
            element(by.css('nav ul li:nth-child(4) a')),
            element(by.css('nav ul li:nth-child(5) a')),
            element(by.css('nav ul li:nth-child(6) a')),
            element(by.css('nav ul li:last-child a'))
        ];
    }

    this.getActiveHeaderLinkText = function (){
        return element(by.css('nav ul li.active')).getText();
    }

    this.getTeamsTitleText = function (){
        return element(by.css('h3.panel-title')).getText();
    }

    this.getGameInfoText = function (){
        return element(by.css('div.panel-body')).getText();
    }

    this.addGame = function (location, description) {
        element(by.css('h3 span button')).click();
        element(by.model('newGame.location')).sendKeys(location);
        element(by.model('newGame.description')).sendKeys(description);
        element(by.css('form')).submit();
        browser.sleep(1000);
    }

    this.getAlertText = function (){
        return element(by.css('div.alert-info')).getText();
    }

    this.getJoinButtonText = function (){
        return joinButton.getText();
    }

    this.getDenyButtonText = function (){
        return denyButton.getText();
    }

    this.joinToGame = function (){
        joinButton.click();
        browser.sleep(1000);
    }

    this.denyGame = function (){
        denyButton.click();
        browser.sleep(1000);
    }

    this.getDisabledButtonText = function () {
        return element(by.css('div.panel-body button[disabled=disabled]')).getText();
    }

    this.removeGame = function (){
        element(by.css('div.panel-body a')).click();
    }

}


describe('my app games page', function() {
    var gamesPage;

    beforeAll(function () {
        gamesPage = new GamesPage();
        gamesPage.login();
        gamesPage.createTeam();
    });

    it('should open teams page', function () {
        gamesPage.get();
        expect(browser.getLocationAbsUrl()).toMatch("/games");
    });

    it('should have correct header links', function () {
        var headerLinks = gamesPage.getHeaderLinks();
        expect(headerLinks[0].getText()).toEqual('Dashboard');
        expect(headerLinks[1].getText()).toEqual('Teams');
        expect(headerLinks[2].getText()).toEqual('Games');
        expect(headerLinks[3].getText()).toEqual('Log out');
        expect(gamesPage.getActiveHeaderLinkText()).toEqual('Games');
    });

    it('should not contain games', function () {
        expect(gamesPage.getTeamsTitleText()).toContain('GamesTestTeam');
        expect(gamesPage.getGameInfoText()).toContain('No planned games.');
    });

    it('should add new game', function (){
        gamesPage.addGame('Field 1', 'Important game');
        expect(gamesPage.getAlertText()).toContain('Game has been added.');

        var gameInfo = gamesPage.getGameInfoText();
        expect(gameInfo).toContain('Field 1');
        expect(gameInfo).toContain('Important game');

        expect(gamesPage.getJoinButtonText()).toEqual('Join');
        expect(gamesPage.getDenyButtonText()).toEqual('Deny');
    });

    it('should join player to the game', function () {
        gamesPage.joinToGame();
        expect(gamesPage.getDisabledButtonText()).toEqual('Join');
        expect(gamesPage.getDenyButtonText()).toEqual('Deny');
    });

    it('should reject player from the game', function () {
        gamesPage.denyGame();
        expect(gamesPage.getJoinButtonText()).toEqual('Join');
        expect(gamesPage.getDisabledButtonText()).toEqual('Deny');
    });

    it('should remove the game', function (){
        gamesPage.removeGame();
        expect(gamesPage.getAlertText()).toContain('Game has been removed.');
        expect(gamesPage.getGameInfoText()).toContain('No planned games.');
    });

    afterAll(function (){
        gamesPage.removeTeam();
        gamesPage.logout();
    });
});