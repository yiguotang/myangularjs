var requirements = [
	'angular',
	'angularAni',
	'angularMock',
	'angularUI',
	'uiSelect',
	'uiUtils',
	'loadingBar',
	'angularLocale',
	'directives/directives',
	'services/services',
	'filters/filters',
	'controllers/controllers',
	'./httpMockApp'
];

define(requirements, function(angular){
	return angular.module('app', ['ngAnimate', 'ngSanitize', 'controllers', 'ui.bootstrap', 'ui.select', 'ui.utils', 'angular-loading-bar', 'ngLocale', 'directives', 'filters', 'services', 'httpMock'], null);
});