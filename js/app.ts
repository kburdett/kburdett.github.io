///<reference path='types/angularjs/angularjs.d.ts' />

interface IHomepageRootScope extends ng.IScope {
    pageTitle: string;
}

var homepageApp = angular.module('homepageApp', [
    'homepageControllers',
    'ngRoute'
]);

homepageApp.config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/about_me', { templateUrl: 'partials/about_me.html', title: 'About Me' }).
                when('/about_page', { templateUrl: 'partials/about_page.html', title: 'About This Page' }).
                when('/aiken', { templateUrl: 'partials/aiken.html', title: 'Aiken' }).
                when('/blog', { templateUrl: 'partials/blog.html', title: 'Blog', controller: 'BlogCtrl' }).
                when('/coding', { templateUrl: 'partials/coding.html', title: 'Coding' }).
                when('/connect', { templateUrl: 'partials/connect.html', title: 'Connect' }).
                otherwise({ redirectTo: '/about_me' });
        }]
);

// set the page title on route change
homepageApp.run(
    function ($rootScope:IHomepageRootScope) {
        $rootScope.$on('$routeChangeSuccess', function (event, current) {
            $rootScope.pageTitle = current.title;
        });
    }
);