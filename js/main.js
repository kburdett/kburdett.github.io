///<reference path='../typings/angularjs/angular.d.ts' />
///<reference path='../typings/requirejs/require.d.ts' />
require.config({
    paths: {
        'jquery': 'https://code.jquery.com/jquery-2.1.1.min',
        'angular': 'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.25/angular.min',
        'angular-route': 'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.25/angular-route.min',
        'angular-sanitize': 'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.25/angular-sanitize.min',
        'angular-resource': 'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.25/angular-resource.min',
        'angulartics': 'dist/angulartics.min',
        'angulartics-ga': 'dist/angulartics-ga.min',
        'bootstrap': 'https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min',
        'domReady': 'https://cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min'
    },
    shim: {
        'angular': {
            exports: 'angular',
            deps: ['jquery', 'domReady!']
        },
        'angular-route': ['angular'],
        'angular-resource': ['angular'],
        'angular-sanitize': ['angular'],
        'angulartics': ['angular'],
        'angulartics-ga': ['angular', 'angulartics'],
        'bootstrap': ['jquery']
    }
});

// startup the application
require(['angular', 'domReady!', 'app', 'bootstrap'], function (angular, document) {
    // bootstrap the document, since we are loading asynchronously
    angular.bootstrap(document, ['homepage.app']);
});
//# sourceMappingURL=main.js.map
