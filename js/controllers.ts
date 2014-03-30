///<reference path='types/angularjs/angularjs.d.ts' />

// Ideally, controllers would be in their own files. However, my needs are super-simple, so it seems overkill
module Controllers {

    export interface IBlogPostScope extends ng.IScope {
        postCollection: any;
    }

    export class BlogCtrl {

        constructor($scope:IBlogPostScope, $http:ng.IHttpService) {
            $http.jsonp('https://public-api.wordpress.com/rest/v1/sites/kaburdett.wordpress.com/posts?callback=JSON_CALLBACK&number=5&order_by=date').
                success(function (data) {
                    $scope.postCollection = data;
                });
        }
        
    }
}

var homepageControllers = angular.module('homepageControllers', [
    'ngSanitize'
]);
Controllers.BlogCtrl.$inject = ['$scope', '$http'];
homepageControllers.controller('BlogCtrl', Controllers.BlogCtrl);