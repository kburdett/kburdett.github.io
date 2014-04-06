///<reference path='../typings/angularjs/angular.d.ts' />
///<reference path='../typings/angularjs/angular-resource.d.ts' />
///<reference path='../typings/requirejs/require.d.ts' />

interface WordPressPostsModel {
    found: number;
    posts: WordPressPostModel[];
}

interface WordPressPostModel {
    ID: number;
    title: string;
    URL: string;
    excerpt: string;
}

define(['angular', 'angular-resource'],
    function (angular:ng.IAngularStatic) {

        var WordPressPosts = ['$resource',
            function ($resource:ng.resource.IResourceService) {
                return $resource('https://public-api.wordpress.com/rest/v1/sites/:site/posts',
                    { callback: 'JSON_CALLBACK', number: 5, order_by: 'date' },
                    { get: { method: 'JSONP', params: {site: 'site'} }});
            }
        ];

        angular
            .module('homepage.services', ['ngResource'])
            .factory('WordPressPosts', WordPressPosts)
    }
);