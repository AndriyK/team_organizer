'use strict';

describe('my app teams page', function() {

    beforeAll(function(){
        browser.get('#/login');
        element(by.model('user.email')).sendKeys('test@test.test');
        element(by.model('user.password')).sendKeys('test');
        element(by.css('button')).click();
        browser.sleep(2000);
    });

    it('should open teams page', function () {
        browser.get('#/teams');
        expect(browser.getLocationAbsUrl()).toMatch("/teams");
    });

    it('should have correct header links', function (){
        expect(element(by.css('nav ul li:nth-child(4) a')).getText()).toEqual('Dashboard');
        expect(element(by.css('nav ul li:nth-child(5) a')).getText()).toEqual('Teams');
        expect(element(by.css('nav ul li:nth-child(6) a')).getText()).toEqual('Games');
        expect(element(by.css('nav ul li:last-child a')).getText()).toEqual('Log out');

        expect(element(by.css('nav ul li.active')).getText()).toEqual('Teams');
    });

    it('should not contain teams', function (){
        expect(element(by.css('h5')).getText()).toContain('You have no related teams at the moment. Please create or find ones.');
        expect(element(by.css('div.panel-group')).getText()).toEqual('');
    });

    it('should create new team', function (){
        element(by.id('addTeamButton')).click();

        element(by.model('createTeam.teamNew.name')).sendKeys('TestTeam');
        element(by.id('newTeamForm')).submit();

        browser.sleep(1000);

        expect(element(by.css('div.panel-group')).getText()).toContain('TestTeam');
    });

    it('should newly created team only one player', function (){
        element(by.css('div.panel-heading a')).click();

        var players = element(by.css('div.panel-body div.row'));
        expect(players.getText()).toContain('Test');
        expect(players.getText()).not.toContain('Test2');
    });

    it('should join player to the team', function (){
        element(by.model('teamManage.newPlayerMail')).sendKeys('test2@test.test');
        element(by.css('div.panel-body div.pull-left form')).submit();
        var players = element(by.css('div.panel-body div.row'));
        expect(players.getText()).toContain('Test2');
        expect(players.getText()).toContain('Test');
    });

    it('should remove player to the team', function (){
        element(by.css('div.panel-body div.row span:last-child a')).click();

        var players = element(by.css('div.panel-body div.row'));
        expect(players.getText()).not.toContain('Test2');
        expect(players.getText()).toContain('Test');
    });

    it('should rename team ', function (){
        var renameButton = element(by.css('div.panel-body div.pull-right button:last-child'));
        renameButton.click();

        var prompt = browser.switchTo().alert();
        prompt.sendKeys('NewTeamName');
        prompt.accept();

        expect(element(by.css('div.panel-group')).getText()).toContain('NewTeamName');
    });

    it('should delete team ', function (){
        //element(by.css('div.panel-heading a')).click();

        var delButton = element(by.css('div.panel-body div.pull-right button:first-child'));
        delButton.click();

        browser.switchTo().alert().dismiss();
        expect(element(by.css('div.panel-group')).getText()).toContain('NewTeamName');

        delButton.click();
        browser.switchTo().alert().accept();

        browser.sleep(1000);
        expect(element(by.css('h5')).getText()).toContain('You have no related teams at the moment. Please create or find ones.');
        expect(element(by.css('div.panel-group')).getText()).toEqual('');

    });

    afterAll(function(){
        browser.get('#/logout');
    });
});