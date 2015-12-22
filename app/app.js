angular

    .module('app', ['ngRoute', 'ui.bootstrap'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when("/",
                {templateUrl: "app/components/intro/intro.html"}
            )
            .when("/register",
                {
                    templateUrl: "app/components/register/register.html",
                    controller: "RegisterCtrl",
                    resolve: {check: checkIsGuest}
                }
            )
            .when("/login",
                {
                    templateUrl: "app/components/login/login.html",
                    controller: "LoginCtrl",
                    resolve: {check: checkIsGuest}
                }
            )
            .when("/logout",
                {
                    template: "",
                    controller: "LogoutCtrl"
                }
            )
            .when("/dashboard",
                {
                    templateUrl: "app/components/dashboard/dashboard.html",
                    resolve: {check: checkPersmission}
                }
            )
            .when("/teams",
                {
                    templateUrl: "app/components/teams/teams.html",
                    controller: "TeamsCtrl",
                    resolve: {check: checkPersmission}
                }
            )
            .when("/games",
                {
                    templateUrl: "app/components/games/games.html",
                    resolve: {check: checkPersmission}
                }
            )
            .otherwise(
                {redirectTo: "/"}
            );
    }]);

function checkPersmission($location, authService){
    if(!authService.isAuthed()) {
        $location.path("/login").replace();
    }
}

function checkIsGuest($location, authService){
    if(authService.isAuthed()) {
        $location.path("/dashboard").replace();
    }
}