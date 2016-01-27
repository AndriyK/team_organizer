'use strict';

var TeamsPage = function (){

    var delButton = element(by.css('div.panel-body div.pull-right button:first-child'));

    this.login = function (){
        browser.get('#/login');
        element(by.model('user.email')).sendKeys('test@test.test');
        element(by.model('user.password')).sendKeys('test');
        element(by.css('button')).click();
        browser.sleep(2000);
    }

    this.get = function (){
        browser.get('#/teams');
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

    this.getPageTitle = function (){
        return element(by.css('h5')).getText();
    }

    this.openNewTeamForm = function (){
        element(by.id('addTeamButton')).click();
    }

    this.addNewTeam = function (teamName) {
        element(by.model('createTeam.teamNew.name')).sendKeys(teamName);
        element(by.id('newTeamForm')).submit();
        browser.sleep(1000);
    }

    this.getTeamsListText = function (){
        return element(by.css('div.panel-group')).getText();
    }

    this.openTeamDetails = function (){
        element(by.css('div.panel-heading a')).click();
    }

    this.getTeamPlayers = function (){
        return element(by.css('div.panel-body div.row'));
    }

    this.addPlayerForTeam = function (playerMail) {
        element(by.model('teamManage.newPlayerMail')).sendKeys(playerMail);
        element(by.css('div.panel-body div.pull-left form')).submit();
    }

    this.removeLastPlayerFromTeam = function (){
        element(by.css('div.panel-body div.row span:last-child a')).click();
    }

    this.renameTeam = function (newName) {
        var renameButton = element(by.css('div.panel-body div.pull-right button:last-child'));
        renameButton.click();

        var prompt = browser.switchTo().alert();
        prompt.sendKeys(newName);
        prompt.accept();
    }

    this.removeTeam_DismissConfirmation = function (){
        delButton.click();
        browser.switchTo().alert().dismiss();
    }

    this.removeTeam_AcceptConfirmation = function (){
        delButton.click();
        browser.switchTo().alert().accept();
        browser.sleep(1000);
    }
}

describe('my app teams page', function() {
    var teamsPage;

    beforeAll(function(){
        teamsPage = new TeamsPage();
        teamsPage.login();
    });

    it('should open teams page', function () {
        teamsPage.get();
        expect(browser.getLocationAbsUrl()).toMatch("/teams");
    });

    it('should have correct header links', function (){
        var headerLinks = teamsPage.getHeaderLinks();

        expect(headerLinks[0].getText()).toEqual('Dashboard');
        expect(headerLinks[1].getText()).toEqual('Teams');
        expect(headerLinks[2].getText()).toEqual('Games');
        expect(headerLinks[3].getText()).toEqual('Log out');

        expect(teamsPage.getActiveHeaderLinkText()).toEqual('Teams');
    });

    it('should not contain teams', function (){
        expect(teamsPage.getPageTitle()).toContain('You have no related teams at the moment. Please create or find ones.');
        expect(teamsPage.getTeamsListText()).toEqual('');
    });

    it('should create new team', function (){
        teamsPage.openNewTeamForm();
        teamsPage.addNewTeam('TestTeam');
        expect(teamsPage.getTeamsListText()).toContain('TestTeam');
    });

    it('should newly created team only one player', function (){
        teamsPage.openTeamDetails();
        var players = teamsPage.getTeamPlayers();
        expect(players.getText()).toContain('Test');
        expect(players.getText()).not.toContain('Test2');
    });

    it('should join player to the team', function (){
        teamsPage.addPlayerForTeam('test2@test.test');
        var players = teamsPage.getTeamPlayers();
        expect(players.getText()).toContain('Test2');
        expect(players.getText()).toContain('Test');
    });

    it('should remove player from the team', function (){
        teamsPage.removeLastPlayerFromTeam();
        var players = teamsPage.getTeamPlayers();
        expect(players.getText()).not.toContain('Test2');
        expect(players.getText()).toContain('Test');
    });

    it('should rename team ', function (){
        teamsPage.renameTeam('NewTeamName');
        expect(teamsPage.getTeamsListText()).toContain('NewTeamName');
        expect(teamsPage.getTeamsListText()).not.toContain('TestTeam');
    });

    it('should delete team ', function (){
        teamsPage.removeTeam_DismissConfirmation();
        expect(teamsPage.getTeamsListText()).toContain('NewTeamName');

        teamsPage.removeTeam_AcceptConfirmation();

        expect(teamsPage.getPageTitle()).toContain('You have no related teams at the moment. Please create or find ones.');
        expect(teamsPage.getTeamsListText()).toEqual('');
    });

    afterAll(function(){
        browser.get('#/logout');
    });
});