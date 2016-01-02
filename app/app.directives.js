angular

    .module('app')

    .directive('sportIcon', function(){
        return {
            restrict: "E",
            scope: {},
            template: '<img ng-src="assets/img/{{sport}}.gif" width="{{size}}px" height="{{size}}px" align="top">',
            link: function (scope, elem, attr){
                scope.sport = attr.sport;
                scope.size = attr.size || 17;
            }

        }
    });