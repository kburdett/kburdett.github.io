///<reference path='../typings/angularjs/angular.d.ts' />
///<reference path='../typings/requirejs/require.d.ts' />
require.config({
    paths: {
        'jquery': 'dist/jquery-2.1.0.min',
        'angular': 'dist/angular.min',
        'angular-route': 'dist/angular-route.min',
        'angular-sanitize': 'dist/angular-sanitize.min',
        'angular-resource': 'dist/angular-resource.min',
        'angulartics': 'dist/angulartics.min',
        'angulartics-ga': 'dist/angulartics-ga.min',
        'bootstrap': '../bootstrap/js/bootstrap.min'
    },
    shim: {
        'angular': {
            exports: 'angular',
            deps: ['jquery', 'dist/domReady!']
        },
        'angular-route': ['angular'],
        'angular-sanitize': ['angular'],
        'angulartics': ['angular'],
        'angulartics-ga': ['angular', 'angulartics'],
        'bootstrap': ['jquery']
    }
});

// startup the application
require(['angular', 'dist/domReady!', 'app', 'bootstrap'], function (angular, document) {
    // bootstrap the document, since we are loading asynchronously
    angular.bootstrap(document, ['homepage.app']);
});
//# sourceMappingURL=main.js.map
