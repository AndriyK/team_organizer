angular

    .module('app')

    .controller('TeamsCtrl', ['$http', function($http) {

        //this.teams = [];
        this.teams = [
            {
                "id": 14,
                "sport": "football",
                "name": "Super",
                "is_capitan": "1"
            },
            {
                "id": 8,
                "sport": "football",
                "name": "Test2",
                "is_capitan": "0"
            }
        ];

        this.hasTeams = function () {
            return this.teams.length > 0;
        }

        this.getTeams = function () {
            return this.teams;
        }
    }]);