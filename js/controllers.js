///<reference path='../typings/angularjs/angular.d.ts' />
///<reference path='../typings/requirejs/require.d.ts' />

define(['angular', 'angular-sanitize'], function (angular) {
    var blogCtrl = [
        '$scope', '$http',
        function ($scope, $http) {
            $http.jsonp('https://public-api.wordpress.com/rest/v1/sites/kaburdett.wordpress.com/posts?callback=JSON_CALLBACK&number=5&order_by=date').success(function (data) {
                $scope.postCollection = data;
            });
        }];

    angular.module('homepage.controllers', ['ngSanitize']).controller('BlogCtrl', blogCtrl);
});
//# sourceMappingURL=controllers.js.map
