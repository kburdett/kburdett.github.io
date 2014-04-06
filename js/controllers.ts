///<reference path='../typings/angularjs/angular.d.ts' />
///<reference path='../typings/requirejs/require.d.ts' />

interface IBlogPostScope extends ng.IScope {
    postCollection: any;
}

define(['angular', 'angular-sanitize'],
    function (angular:ng.IAngularStatic) {

        var blogCtrl = ['$scope', '$http',
            function ($scope:IBlogPostScope, $http:ng.IHttpService) {
                $http
                    .jsonp('https://public-api.wordpress.com/rest/v1/sites/kaburdett.wordpress.com/posts?callback=JSON_CALLBACK&number=5&order_by=date')
                    .success(function (data) {
                        $scope.postCollection = data;
                    });
            }];

        angular
            .module('homepage.controllers', ['ngSanitize'])
            .controller('BlogCtrl', blogCtrl);

    }
);