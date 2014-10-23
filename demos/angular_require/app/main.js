/**
 * Created by zhy on 14-10-17.
 * 定义了RequireJS的配置
 */
require.config({
    paths: {
        jquery: 'vendor/jquery',
        angular: 'vendor/angular.min',
        domReady: 'vendor/domReady'
    },
    shim: {
        'angular': {deps: ['jquery'], exports: 'angular'}
    }
});

require([
    'angular',
    'app',
    'domReady',
    'modules/root_module/userService',
    'modules/root_module/rootController',
    'modules/root_module/ngbkFocus'
], function(angular, app, domReady){
    angular.config(['$routeProvider', function ($routeProvider){
        $routeProvider.when('/', {
            templateUrl: 'modules/root_module/_root.html',
            controller: 'RootController'
        });
    }]);

    domReady(function () {
        //手动初始化angular，不要在html中添加ngApp指令
        angular.bootstrap(document, ['MyApp']);

        //下面的这条语句angular将自动初始化
        //$('html').addClass('ng-app=MyApp');
    });
});