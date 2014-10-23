/**
 * Created by zhy on 14-10-17.
 * 定义了angular应用
 */

define(['angular', 'scripts/controllers/controllers.js',
    'scripts/services/services.js', 'scripts/filters/filters.js',
    'scripts/directives/directives.js'], function(angular){
    return angular.module('MyApp', ['controllers', 'services', 'filters', 'directives']);
});