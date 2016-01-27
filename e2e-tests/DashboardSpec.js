'use strict';

var DashboardPage = function () {

    this.login = function () {
        browser.get('#/login');
        element(by.model('user.email')).sendKeys('test@test.test');
        element(by.model('user.password')).sendKeys('test');
        element(by.css('button')).click();
        browser.sleep(2000);

        expect(element(by.css('ul.nav-justified li.active')).getText()).toEqual('All');
        expect(element(by.css('div.alert-info')).getText()).toContain('You have no planned games.');
    }

    this.createTeam = function () {
        browser.get('#/teams');
        element(by.id('addTeamButton')).click();
        element(by.model('createTeam.teamNew.name')).sendKeys('DashboardTeam');
        element(by.id('newTeamForm')).submit();
        browser.sleep(1000);
    }

    this.createGames = function () {
        browser.get('#/games');
        element(by.css('h3 span button')).click();
        element(by.model('newGame.location')).sendKeys('Field 1');
        element(by.model('newGame.description')).sendKeys('Important game');
        element(by.css('form')).submit();

        element(by.css('h3 span button')).click();
        element(by.id('inputDate')).clear().sendKeys(new Date().getFullYear() + '-12-31');
        element(by.model('newGame.location')).sendKeys('Field 11');
        element(by.css('form')).submit();
    }

    this.removeTeam = function () {
        browser.get('#/teams');
        element(by.css('div.panel-heading a')).click();
        var delButton = element(by.css('div.panel-body div.pull-right button:first-child'));
        delButton.click();
        browser.switchTo().alert().accept();
        browser.sleep(1000);
    }

    this.logout = function () {
        browser.get('#/logout');
    }

    this.get = function () {
        browser.get('#/dashboard');
    }

    this.getHeaderLinks = function () {
        return [
            element(by.css('nav ul li:nth-child(4) a')),
            element(by.css('nav ul li:nth-child(5) a')),
            element(by.css('nav ul li:nth-child(6) a')),
            element(by.css('nav ul li:last-child a'))
        ];
    }

    this.getActiveHeaderLinkText = function () {
        return element(by.css('nav ul li.active')).getText();
    }

    this.getActiveTabText = function () {
        return element(by.css('ul.nav-justified li.active')).getText();
    }

    this.getGamesListText = function (){
        return element(by.css('div.panel')).getText();
    }

    this.getGamesCount = function (){
        return element.all(by.css('div.panel div.well')).count();
    }

    this.openTadaysTab = function (){
        element(by.css('ul.nav-justified li:first-child')).click();
    }

    this.getTotalPlayersAmount = function (){
        return element(by.css('span.label-default')).getText();
    }

    this.getJoinedPlayersAmount = function (){
        return element(by.css('span.label-success')).getText();
    }

    this.getRejectedPlayersAmount = function (){
        return element(by.css('span.label-danger')).getText();
    }

    this.getUnknownPlayersAmount = function (){
        return element(by.css('span.label-warning')).getText();
    }

    this.getInitialJoinButtonText = function (){
        return element(by.id('joinUnknownButton')).getText();
    }

    this.getInitialRejectButtonText = function (){
        return element(by.id('rejectUnknownButton')).getText();
    }

    this.joinGameInitial = function (){
        element(by.id('joinUnknownButton')).click();
    }

    this.getDisabledButtonText = function (){
        return element(by.css('button.btn-success[disabled=disabled]')).getText()
    }

    this.getSmallRejectButtonText = function (){
        return element(by.id('rejectJoinedButton')).getText();
    }

    this.rejectGameChanged = function (){
        return element(by.id('rejectJoinedButton')).click();
    }

    this.getSmallJoinButtonText = function (){
        return element(by.id('joinRejectedButton')).getText();
    }
}


describe('my app dashboard page', function() {

    var dashboardPage;

    beforeAll(function () {
        dashboardPage = new DashboardPage();
        dashboardPage.login();
        dashboardPage.createTeam();
        dashboardPage.createGames();
    });

    it('should open teams page', function () {
        dashboardPage.get();
        expect(browser.getLocationAbsUrl()).toMatch("/dashboard");
    });

    it('should have correct header links', function () {
        var headerLinks = dashboardPage.getHeaderLinks();
        expect(headerLinks[0].getText()).toEqual('Dashboard');
        expect(headerLinks[1].getText()).toEqual('Teams');
        expect(headerLinks[2].getText()).toEqual('Games');
        expect(headerLinks[3].getText()).toEqual('Log out');
        expect(dashboardPage.getActiveHeaderLinkText()).toEqual('Dashboard');
    });

    it('should be opened all tab and contain two games', function () {
        expect(dashboardPage.getActiveTabText()).toEqual('All');

        expect(dashboardPage.getGamesCount()).toEqual(2);

        var games = dashboardPage.getGamesListText();
        expect(games).toContain('Important game');
        expect(games).toContain('Field 1');

        expect(games).toContain('Training');
        expect(games).toContain('Field 11');
    });

    it('should todays tab contain only one game', function () {
        dashboardPage.openTadaysTab();

        expect(dashboardPage.getActiveTabText()).toEqual('Today');
        expect(dashboardPage.getGamesCount()).toEqual(1);

        var games = dashboardPage.getGamesListText();
        expect(games).toContain('Important game');
        expect(games).not.toContain('Training');
    });

    it('should show correct summary and set presence', function () {
        expect(dashboardPage.getTotalPlayersAmount()).toEqual('1');
        expect(dashboardPage.getJoinedPlayersAmount()).toEqual('0');
        expect(dashboardPage.getRejectedPlayersAmount()).toEqual('0');
        expect(dashboardPage.getUnknownPlayersAmount()).toEqual('1');

        expect(dashboardPage.getInitialJoinButtonText()).toEqual('Join');
        expect(dashboardPage.getInitialRejectButtonText()).toEqual('Deny');

        dashboardPage.joinGameInitial();
        expect(dashboardPage.getDisabledButtonText()).toEqual('Joined');
        expect(dashboardPage.getSmallRejectButtonText()).toEqual('Reject');
        expect(dashboardPage.getJoinedPlayersAmount()).toEqual('1');
        expect(dashboardPage.getRejectedPlayersAmount()).toEqual('0');
        expect(dashboardPage.getUnknownPlayersAmount()).toEqual('0');

        dashboardPage.rejectGameChanged();
        expect(dashboardPage.getJoinedPlayersAmount()).toEqual('0');
        expect(dashboardPage.getRejectedPlayersAmount()).toEqual('1');
        expect(dashboardPage.getUnknownPlayersAmount()).toEqual('0');
        expect(dashboardPage.getSmallJoinButtonText()).toEqual('Join');
    });

    afterAll(function (){
        dashboardPage.removeTeam();
        dashboardPage.logout();
    });
});