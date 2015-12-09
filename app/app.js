var app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when("/",
            {
                templateUrl: "intro/intro.html"
                //controller: "AppCtrl",
                //controllerAs: "app"
            }
        )
        .when("/register",
            {
                templateUrl: "register/register.html",
                //controller: "RegisterCtrl"
                //controllerAs: "regCtrl"
            }
        )
        .when("/login",
            {
                templateUrl: "login/login.html"
            }
        )
        .otherwise(
            {redirectTo: "/"}
        );
}]);
