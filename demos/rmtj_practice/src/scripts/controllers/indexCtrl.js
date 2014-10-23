define(['app', '../services/normalFormParamFactory','../../../resources/localdata/dic/dictionaryData'], function(app) {
    app.controller('index', function () {
        //search()不带参数是getter，返回的是当前url中的参数
        $scope.requestParams = $location.search();

        //nav manager
        $scope.menuClick = function(menuItem){
            if(menuItem.appName != null){
                $scope.openTab({
                    appName: menuItem.appName,
                    text: menuItem.label,
                    param: menuItem.param
                });
            }
            $scope.activeMenu = menuItem;
        };

        $scope.isMenuActive = function(menuItem){
            return menuItem == $scope.activeMenu || hasMenuItem($scope.activeMenu, menuItem.submenus);
        };

        $scope.getActiveModule = function(){
            var module = {submenus: []};
            $($scope.permissionModules).each(function(){
                if ($scope.isMenuActive(this)) {
                    module = this;
                };
            });
            return module;
        };

        $scope.showSysMenu = function(){
            var sysMenu = null;
            angular.forEach($scope.permissionModules, function(menu){
                if(menu.menuid == 'm_system'){
                    sysMenu = menu;
                }
            });
            $scope.activeMenu = sysMenu;
        };

        $scope.loginOut = function(){
            location.href = "login.html";
        };

        function hasMenuItem(menuItem, menuList){
            var exists = false;
            $(menuList).each(function(){
                if (this == menuItem) {
                    exists = true;
                    return false;
                }
                if (this.submenus != null) {
                    if(hasMenuItem(menuItem, this.submenus)){
                        exists = true;
                        return false;
                    }
                }
                return true;
            });
            return exists;
        };

        //tab manager
        $scope.tabs = [];

        $scope.toggleTabShow = function(){
            $scope.showTabs = !$scope.showTabs;
        };

        /**
         *	打开一个子页面
         *	@param cfg
         * {
         *   appName 应用名称(映射到appContext.js)
         *   text Tab显示名称
         *   param 参数
         * }
         */
        $scope.openTab = function(cfg){
            if (cgf.appName == 'formApp') {
                if (cfg.param.definitionId != null) {
                    normalFormParamFactory.buildFormParam({
                        definitionId: cfg.param.definitionId,
                        instanceId: cfg.param.instanceId,
                        taskDefKey: cfg.param.taskDefKey,
                        taskId: cfg.param.taskId,
                        startKey: cfg.param.startKey,
                        callback: function(newParams){
                            cfg.param = newParams;
                            $scope.openTab(cfg);
                        }
                    });
                    return;
                };
            };
            var config = $scope.getAppConfig(cfg.appName);
            var requirements = config.controllerFile != null ? [config.controllerFile] : [];
            require(requirements, function(){
                cfg.templateUrl = config.htmlTemplateFile;
                cfg.active = true;
                cfg.funName = cfg.funName || cfg.appName;
                var newTabs = [];
                angular.forEach($scope.tabs, function(tab){
                    if (tab.appName != cfg.appName || !angular.equals(tab.param, cfg.param)) {
                        tab.active = false;
                        this.push(tab);
                    };
                }, newTabs);
                newTabs.push(cfg);
                $scope.tabs = newTabs;
                $scope.$digest();
            });
        };

        $scope.activeTab = function(appName, param){
            angular.forEach($scope.tabs, function(tab){
                tab.active = (tab.appName == appName && angular.equals(tab.param, param));
            });
            $scope.showTabs = false;
        };

        $scope.closeTab = function(appName, param){
            $log.debug('close tab called');
            var queryIndex = -1;
            var queryTab;
            for(var index = 0, len = $scope.tabs.length; index < len; index++){
                if ($scope.tabs[index].appName == appName && angular.equals($scope.tabs[index].param, params)) {
                    queryTab = $scope.tabs[index];
                    queryIndex = index;
                    break;
                };
            }
            if (queryTab != null) {
                //splice方法第一个参数是指定从数组中移除元素的开始位置，这个位置是从0开始计算的，第二个参数指定移除的个数
                $scope.tabs.splice(queryIndex, 1);
                if (queryTab.active && $scope.tab.length > 0) {
                    $scope.tabs[$scope.tabs.length - 1].active = true;
                };
            };
            $scope.showTabs = false;
        };

        $scope.getActTabName = function(){
            for(var index = 0, len = $scope.tabs.length; index < len; index++){
                if ($scope.tabs[index].active) {
                    return $scope.tabs[index].text;
                };
            }
            return "无窗口";
        };

        //Permission Manager
        var currentUserDefer = $q.defer();
        var currentUserPromise = currentUserDefer.promise;

        //检验用户的登陆状态
        $http.get('sys/cache/currentUser').success(function(data){
            if (data.success) {
                $scope.currentUser = data.data;
                currentUserDefer.resolve();
            }
            else
            {
                alert("请先登陆！");
                location.href = "login.html";
            }
        });

        function getURLParameter(name){
            return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
        };

        var roleMap = {
            'wangge': '网格信息员',
            'comunity': '社区调解员',
            'outorg': '外部矛调组织调解员',
            'street': '街道调解员',
            'county': '区县调解员',
            'city': '市级指导人员',
            'provincial': '省级指导人员'
        };

        function loadPermissionInfo(){
            var role = getURLParameter('role');
            $scope.username = roleMap[role];
            $http.get("sys/user/" + role + "/permissions").success(function(data){
                var permissionModules = $cacheFactory('permissionModules');
                permissionModules.put('modules', data.data);
                $scope.permissionModules = buildModules(data.data);
                $scope.menuClick($scope.permissionModules[0]);
            });
        };

        currentUserPromise.then(function(){
            loadPermissionInfo();
        });

        function buildModules(menuMap){
            var skipKeys = ['pkid', 'params', 'op'];
            var menuList = [];
            angular.forEach(menuMap, function(submenus, key){
                if (skipKeys.indexOf(key) < 0) {
                    var menuInf = $scope.getMenuCfg()[key];
                    if (menuInf != null) {
                        var menuItem = {
                            label: menuInf.text,
                            appName: menuInf.appName,
                            iconClass: menuInf.iconClass,
                            param: submenu.params,
                            menuid: key,
                            visible: submenu.visible
                        };
                        menuItem.submenus = buildModules(submenu);
                        menuList.push(menuItem);
                    };
                };
            });
            return angular.copy(menuList);
        };

        $scope.mainBoxClass = "mainBox";
        //隐藏菜单
        $scope.closeLeft = function(){
            $scope.isLeft = false;
            $scope.mainBoxClass = "mainBox1";
        };

        //打开菜单
        $scope.openLeft = function(){
            $scope.isLeft = true;
            $scope.mainBoxClass = "mainBox";
        };

        //当前时间
        var currenTime = function(){
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth();
            var day = date.getDate();
            var hour = date.getHours();
            var minutes = date.getMinutes();
            return year + "年" + fillZero(month) + "月" + fillZero(day) + "日" + fillZero(hour) + ":" + fillZero(minutes);

            function fillZero(number){
                var str = number + "";
                var zeroStr = "";
                for(var i = 0; i < 2- str.length; i++){
                    zeroStr += "0";
                }
                return zeroStr + str;
            };
        };

        $scope.currenTime = currenTime();

        //Dictionary Cache Manager
        $http.get(appConfiguration.dictionaryURL).success(function(data){
            var dictionary = $cacheFactory('dictionary');
            dictionary.put('dictionary', data.data);
            $log.info(dictionary.info());
            $scope.dictionary.getDefer().resolve();
        });

        //huangle 返回按钮方法
        $scope.returnBack = function(){
            $scope.tabs.pop();
            $scope.openTab($scope.tabs[$scope.tabs.length-1]);
        };
    });
});