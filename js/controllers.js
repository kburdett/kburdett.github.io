///<reference path='types/angularjs/angularjs.d.ts' />
// Ideally, controllers would be in their own files. However, my needs are super-simple, so it seems overkill
var Controllers;
(function (Controllers) {
    var BlogCtrl = (function () {
        function BlogCtrl($scope, $http) {
            $http.get('https://public-api.wordpress.com/rest/v1/sites/kaburdett.wordpress.com/posts?number=5&order_by=date').success(function (data) {
                $scope.postCollection = data;
            });
        }
        return BlogCtrl;
    })();
    Controllers.BlogCtrl = BlogCtrl;
})(Controllers || (Controllers = {}));

var homepageControllers = angular.module('homepageControllers', [
    'ngSanitize'
]);
Controllers.BlogCtrl.$inject = ['$scope', '$http'];
homepageControllers.controller('BlogCtrl', Controllers.BlogCtrl);
//# sourceMappingURL=controllers.js.map
