/**
 * Created by yixian on 13-12-31.
 */
var angelui = {version: '1.0'};
require.config({
    paths: {
        angular: "vendor/angular/angular",
        angularUI: 'vendor/angular-plugins/ui-bootstrap-tpls-0.11.0.min',
        angularAni: "vendor/angular/angular-animate.min",
        uiSelect: 'vendor/angular-plugins/select',
        angularSanitize: 'vendor/angular/angular-sanitize',
        jqueryUI: "vendor/jquery-plugins/jqueryui/jquery-ui-1.10.3.custom.min",
        jqueryUIDatePicker: "vendor/jquery-plugins/jqueryui/jquery.ui.datepicker-zh-CN",
        jquery: "vendor/jquery/jquery-1.10.2.min",
        jqprint: 'vendor/jquery-plugins/jquery.jqprint',
        angularMock: "vendor/angular/angular-mocks",
        angularLocale: "vendor/angular/angular-locale_zh-cn",
        icheck: "vendor/jquery-plugins/icheck/icheck",
        jqueryUIMonthPicker: 'vendor/jquery-plugins/jquery.mtz.monthpicker',
        messenger: 'vendor/jquery-plugins/messenger/messenger.min',
        fileUploadShim: 'vendor/angular-plugins/angular-file-upload-html5-shim',
        uiUtils: 'vendor/angular-plugins/ui-utils.min',
        ztree: 'vendor/jquery-plugins/ztree/jquery.ztree.all-3.5.min',
        loadingBar: 'vendor/angular-plugins/loading-bar.min',
        raphael: 'vendor/raphael-min',
        myflow: 'vendor/myflow',
        myflowJpdl4: 'vendor/myflow.jpdl4',
        myflowShow: 'vendor/myflow.show',
        highcharts: 'vendor/highcharts/highcharts',
        highcharts3d: 'vendor/highcharts/highcharts-3d'
    },
    shim: {
        angular: {
            deps: ['jquery', 'jqueryUI', 'jqueryUIDatePicker'],
            exports: "angular"
        },
        angularSanitize: {
            deps: ['angular']
        },
        uiSelect: {
            deps: ['angular', 'angularSanitize']
        },
        uiUtils: {
            deps: ['angular']
        },
        loadingBar: {
            deps: ['angular']
        },
        angularMock: {
            deps: ['angular']
        },
        angularAni: {
            deps: ['angular']
        },
        jqueryUI: {
            deps: ['jquery']
        },
        jqueryUIDatePicker: {
            deps: ['jquery', 'jqueryUI']
        },
        jqueryUIMonthPicker: {
            deps: ['jqueryUI']
        },
        app: {
            exports: 'app'
        },
        angularUI: {
            deps: ['angular'],
            exports: 'angularUI'
        },
        angularLocale: {
            deps: ['angular']
        },
        icheck: {
            deps: ['jquery'],
            exports: 'icheck'
        },
        messenger: {
            deps: ['jquery']
        },
        jqprint: {
            deps: ['jquery']
        },
        ztree: {
            deps: ['jquery']
        },
        raphael: {
            deps: ['jquery']
        },
        myflowJpdl4: {
            deps: ['myflowShow']
        },
        highcharts: {
            deps: ['jquery']
        },
        highcharts3d: {
            deps: ['highcharts']
        }
    }
});
if (appConfiguration == null) {
    console.error("appConfiguration未配置")
}

require([
    appConfiguration.getContextPath(),
    appConfiguration.getMenuCfg(),
    'globalContext',
    'app',
    'angular',
    'jquery',
    'directives/angular.icheck',
    'directives/angular.datepicker',
    'directives/angular.pager',
    'directives/angular.monthpicker',
    'directives/angel.operation',
    'directives/angel.iselector',
    'directives/ngEnter',
    'directives/angular.checkboxGroup',
    'directives/ztree',
    'directives/treeview',
    'directives/formvalidation/idcardValid',
    'directives/btnPrint',
    'directives/uploader',
    'directives/angel.highcharts',
    'filters/propsFilter',
    'services/messager',
    'services/dictionary',
    'services/angelModal',
    'services/iselectorModal',
    'services/angelConfirm',
    appConfiguration.getIndexCtrlPath()
], function (appCxt, menuCfg, globalContext, app, angular, $) {
    var appContext = $.extend({}, globalContext, appCxt);


//IE7 Support
    app.config(function ($sceProvider) {
        $sceProvider.enabled(false);
//        $locationProvider.html5Mode(true);
    });

    app.config(function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = true;
    });

    //lazy-loading
    app.config(function ($controllerProvider, $compileProvider, $filterProvider, $provide, $animateProvider) {
        app.lazy = {
            controller: $controllerProvider.register,
            directive: $compileProvider.directive,
            filter: $filterProvider.register,
            factory: $provide.factory,
            service: $provide.service,
            animation: $animateProvider.register
        }
    });

    app.run(function ($rootScope, $log, $http, $cacheFactory, $location, dictionary) {
        $rootScope.dictionary = dictionary;

        $rootScope.getMenuCfg = function () {
            return menuCfg;
        };

        $rootScope.getAppConfig = function (appConfigName) {
            var appConfig = appContext[appConfigName];
            var res = {};
            if (appConfig.controller != null) {
                res.controllerFile = appConfiguration.getControllerPath() + appConfig.controller;
            }
            res.htmlTemplateFile = appConfig.abstractTemplate || appConfiguration.getViewPath() + appConfig.templateUrl;
            return res;
        };

    });

    angular.bootstrap($("body"), ['app']);

});