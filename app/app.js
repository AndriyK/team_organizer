var app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when("/",
            {
                templateUrl: "views/intro.html"
            }
        )
        .when("/register",
            {
                templateUrl: "views/register.html",
                controller: "RegisterCtrl"
            }
        )
        .when("/login",
            {
                templateUrl: "views/login.html"
            }
        )
        .otherwise(
            {redirectTo: "/"}
        );
}]);
