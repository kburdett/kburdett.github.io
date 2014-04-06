///<reference path='../typings/angularjs/angular.d.ts' />
///<reference path='../typings/angularjs/angular-resource.d.ts' />
///<reference path='../typings/requirejs/require.d.ts' />
///<reference path='./services.ts' />

interface IBlogPostScope extends ng.IScope {
    wordPressPosts: WordPressPostsModel;
}

define(['angular', 'angular-sanitize', 'services'],
    function (angular:ng.IAngularStatic) {

        var blogCtrl = ['$scope', 'WordPressPosts',
            function ($scope:IBlogPostScope, WordPressPosts:ng.resource.IResourceClass<WordPressPostsModel>) {
                WordPressPosts.get({site: 'kaburdett.wordpress.com'},
                    function (data:WordPressPostsModel) {
                        $scope.wordPressPosts = data;
                    })
            }];

        angular
            .module('homepage.controllers', ['ngSanitize', 'homepage.services'])
            .controller('BlogCtrl', blogCtrl);

    }
);