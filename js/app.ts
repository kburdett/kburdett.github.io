///<reference path='../typings/angularjs/angular.d.ts' />
///<reference path='../typings/angularjs/angular-route.d.ts' />
///<reference path='../typings/requirejs/require.d.ts' />

interface IHomepageRootScope extends ng.IScope {
    pageTitle: string;
}

define(['angular', 'angular-route', 'controllers', 'angulartics', 'angulartics-ga'],
    function (angular:ng.IAngularStatic) {

        angular
            .module('homepage.app', [
                'homepage.controllers',
                'ngRoute',
                'angulartics',
                'angulartics.google.analytics'
            ])
            .config(['$routeProvider',
                function ($routeProvider:ng.route.IRouteProvider) {
                    $routeProvider
                        .when('/', { redirectTo: '/about_me' })
                        .when('/about_me', { templateUrl: 'partials/about_me.html', title: 'About Me' })
                        .when('/about_page', { templateUrl: 'partials/about_page.html', title: 'About This Page' })
                        .when('/aiken', { templateUrl: 'partials/aiken.html', title: 'Aiken' })
                        .when('/blog', { templateUrl: 'partials/blog.html', title: 'Blog', controller: 'BlogCtrl' })
                        .when('/coding', { templateUrl: 'partials/coding.html', title: 'Coding' })
                        .when('/connect', { templateUrl: 'partials/connect.html', title: 'Connect' })
                        .when('/error', {templateUrl: 'partials/error.html', title: 'Error'})
                        .otherwise({templateUrl: 'partials/404.html', title: 'Not Found'});
                }])
            // set the page title on route change
            .run(function ($rootScope:IHomepageRootScope, $location:ng.ILocationService) {
                $rootScope.$on('$routeChangeSuccess', function (event, current) {
                    $rootScope.pageTitle = current.title;
                });

                $rootScope.$on("$routeChangeError", function () {
                    //change this code to handle the error somehow
                    $rootScope.pageTitle = "Error";
                    $location.path('/404').replace();
                });
            });

    }
);