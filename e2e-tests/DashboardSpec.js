'use strict';

describe('my app dashboard page', function() {

    beforeAll(function () {
        browser.get('#/login');
        element(by.model('user.email')).sendKeys('test@test.test');
        element(by.model('user.password')).sendKeys('test');
        element(by.css('button')).click();

        browser.sleep(2000);

        expect(element(by.css('ul.nav-justified li.active')).getText()).toEqual('All');
        expect(element(by.css('div.alert-info')).getText()).toContain('You have no planned games.');

        browser.get('#/teams');
        element(by.id('addTeamButton')).click();
        element(by.model('createTeam.teamNew.name')).sendKeys('DashboardTeam');
        element(by.id('newTeamForm')).submit();

        browser.sleep(1000);

        browser.get('#/games');
        element(by.css('h3 span button')).click();
        element(by.model('newGame.location')).sendKeys('Field 1');
        element(by.model('newGame.description')).sendKeys('Important game');
        element(by.css('form')).submit();

        element(by.css('h3 span button')).click();
        element(by.id('inputDate')).clear().sendKeys(new Date().getFullYear() + '-12-31');
        element(by.model('newGame.location')).sendKeys('Field 11');
        element(by.css('form')).submit();
    });

    it('should open teams page', function () {
        browser.get('#/dashboard');
        expect(browser.getLocationAbsUrl()).toMatch("/dashboard");
    });

    it('should have correct header links', function () {
        expect(element(by.css('nav ul li:nth-child(4) a')).getText()).toEqual('Dashboard');
        expect(element(by.css('nav ul li:nth-child(5) a')).getText()).toEqual('Teams');
        expect(element(by.css('nav ul li:nth-child(6) a')).getText()).toEqual('Games');
        expect(element(by.css('nav ul li:last-child a')).getText()).toEqual('Log out');

        expect(element(by.css('nav ul li.active')).getText()).toEqual('Dashboard');
    });

    it('should be opened all tab and contain two games', function () {
        expect(element(by.css('ul.nav-justified li.active')).getText()).toEqual('All');

        var games = element(by.css('div.panel')).getText();
        expect(games).toContain('Important game');
        expect(games).toContain('Field 1');

        expect(games).toContain('Training');
        expect(games).toContain('Field 11');
    });

    it('should todays tab contain only one game', function () {
        element(by.css('ul.nav-justified li:first-child')).click();
        expect(element(by.css('ul.nav-justified li.active')).getText()).toEqual('Today');

        var game = element(by.css('div.panel div.well'));
        expect(game.getText()).toContain('Important game');
        expect(game.getText()).not.toContain('Training');
    });

    it('should show correct summary and set presence', function () {
        expect(element(by.css('span.label-default')).getText()).toEqual('1'); // total amount of players

        expect(element(by.css('span.label-success')).getText()).toEqual('0'); // joined to game players
        expect(element(by.css('span.label-danger')).getText()).toEqual('0'); // rejected game players
        expect(element(by.css('span.label-warning')).getText()).toEqual('1'); // rejected game players

        expect(element(by.id('joinUnknownButton')).getText()).toEqual('Join');
        expect(element(by.id('rejectUnknownButton')).getText()).toEqual('Deny');

        element(by.id('joinUnknownButton')).click(); // report presence

        expect(element(by.css('span.label-success')).getText()).toEqual('1'); // joined to game players
        expect(element(by.css('span.label-danger')).getText()).toEqual('0'); // rejected game players
        expect(element(by.css('span.label-warning')).getText()).toEqual('0'); // unknown game players
        expect(element(by.css('button.btn-success[disabled=disabled]')).getText()).toEqual('Joined'); // button changed text to joined
        expect(element(by.id('rejectJoinedButton')).getText()).toEqual('Reject');

        // change presence - reject the game
        element(by.id('rejectJoinedButton')).click();
        expect(element(by.css('span.label-success')).getText()).toEqual('0'); // joined to game players
        expect(element(by.css('span.label-danger')).getText()).toEqual('1'); // rejected game players
        expect(element(by.css('span.label-warning')).getText()).toEqual('0'); // unknown game players
        expect(element(by.id('joinRejectedButton')).getText()).toEqual('Join');
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