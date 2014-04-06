///<reference path='../typings/angularjs/angular.d.ts' />
///<reference path='../typings/angularjs/angular-resource.d.ts' />
///<reference path='../typings/requirejs/require.d.ts' />
///<reference path='./services.ts' />

define(['angular', 'angular-sanitize', 'services'], function (angular) {
    var blogCtrl = [
        '$scope', 'WordPressPosts',
        function ($scope, WordPressPosts) {
            WordPressPosts.get({ site: 'kaburdett.wordpress.com' }, function (data) {
                $scope.wordPressPosts = data;
            });
        }];

    angular.module('homepage.controllers', ['ngSanitize', 'homepage.services']).controller('BlogCtrl', blogCtrl);
});
//# sourceMappingURL=controllers.js.map
