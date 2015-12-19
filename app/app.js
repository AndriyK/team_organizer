angular

    .module('app', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when("/",
                {templateUrl: "app/components/intro/intro.html"}
            )
            .when("/register",
                {templateUrl: "app/components/register/register.html", controller: "RegisterCtrl"}
            )
            .when("/login",
                {templateUrl: "app/components/login/login.html", controller: "LoginCtrl"}
            )
            .when("/logout",
                {template: "", controller: "LogoutCtrl"}
            )
            .when("/dashboard",
                {templateUrl: "app/components/dashboard/dashboard.html"}
            )
            .otherwise(
                {redirectTo: "/"}
            );
    }]);