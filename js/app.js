///<reference path='types/angularjs/angularjs.d.ts' />

var homepageApp = angular.module('homepageApp', [
    'homepageControllers',
    'ngRoute',
    'angulartics',
    'angulartics.google.analytics'
]);

homepageApp.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/about_me', { templateUrl: 'partials/about_me.html', title: 'About Me' }).when('/about_page', { templateUrl: 'partials/about_page.html', title: 'About This Page' }).when('/aiken', { templateUrl: 'partials/aiken.html', title: 'Aiken' }).when('/blog', { templateUrl: 'partials/blog.html', title: 'Blog', controller: 'BlogCtrl' }).when('/coding', { templateUrl: 'partials/coding.html', title: 'Coding' }).when('/connect', { templateUrl: 'partials/connect.html', title: 'Connect' }).otherwise({ redirectTo: '/about_me' });
    }]);

// CORS config
homepageApp.config([
    '$httpProvider',
    function ($httpProvider) {
        // ...
        // delete header from client:
        // http://stackoverflow.com/questions/17289195/angularjs-post-data-to-external-rest-api
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }]);

// set the page title on route change
homepageApp.run(function ($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current) {
        $rootScope.pageTitle = current.title;
    });
});
//# sourceMappingURL=app.js.map
