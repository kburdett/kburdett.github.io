///<reference path='../typings/angularjs/angular.d.ts' />
///<reference path='../typings/requirejs/require.d.ts' />

require.config({
    paths: {
        'jquery': '//code.jquery.com/jquery-2.1.0.min',
        'angular': '//ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular.min',
        'angular-route': '//ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular-route.min',
        'angular-sanitize': '//ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular-sanitize.min',
        'angular-resource': '//ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular-resource.min',
        'angulartics': 'dist/angulartics.min',
        'angulartics-ga': 'dist/angulartics-ga.min',
        'bootstrap': '//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min',
    },

    shim: {
        'angular': {
            exports: 'angular',
            deps: ['jquery', 'dist/domReady!']
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
require(['angular', 'dist/domReady!', 'app', 'bootstrap'],

    function (angular:ng.IAngularStatic, document) {

        // bootstrap the document, since we are loading asynchronously
        angular.bootstrap(document, ['homepage.app']);
    }
);
