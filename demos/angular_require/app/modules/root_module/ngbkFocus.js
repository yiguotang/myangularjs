/**
 * Created by zhy on 14-10-17.
 */
define(['scripts/directives/directives'], function (directives) {
    directives.directive('ngbkFocus', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'A',
            scope: true,
            link: function(scope, element, attrs){
                element[0].focus();
            }
        };
    }]);
});
