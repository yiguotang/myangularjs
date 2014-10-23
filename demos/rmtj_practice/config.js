var appConfiguration = {};

//是否运行服务端版本
appConfiguration.inServer = false;
appConfiguration.replaceSrcFolder = function(url){
	var srcFolder = appConfiguration.inServer ? 'lib' : 'src';
	return url.replace('{lib}', srcFolder);
};

//web根目录相对于main的路径
appConfiguration.mainToRootPath = '../..';
//自己编写的应用相对于main.js的路径
appConfiguration.appPath = '../../{lib}/scripts/';
appConfiguration.getAppPath = function(){
	return appConfiguration.replaceSrcFolder(appConfiguration.appPath);
};

//appContext.js相对于main.js的路径，不需要加.js
appConfiguration.contextPath = '../../{lib}/scripts/appContext';
appConfiguration.getContextPath = function(){
	return appConfiguration.replaceSrcFolder(appConfiguration.contextPath);
};

//自己编写的controller根目录相对于main.js的路径
appConfiguration.getControllerPath = function(){
	return appConfiguration.getAppPath() + 'controllers/'
};

//index首页的controller路径
appConfiguration.getIndexCtrlPath = function(){
	return appConfiguration.getControllerPath() + "indexCtrl";
};

//自己编写service根目录相对于main.js的路径
appConfiguration.getServicePath = function(){
	return appConfiguration.getAppPath() + 'services/';
};

//自己编写的filter根目录相对于main.js的路径
appConfiguration.getFilterPath = function(){
	return appConfiguration.getAppPath() + 'filters/';
};

//自己编写的directive根目录相对于main.js的路径
appConfiguration.getDirectivePath = function(){
	return appConfiguration.getAppPath() + 'directives/';
};

//末班页面相对于index的路径
appConfiguration.viewPath = '{lib}/views/';
appConfiguration.getViewPath = function(){
	return appConfiguration.replaceSrcFolder(appConfiguration.viewPath);
};

//菜单列表相对于main的路径
appConfiguration.menuCfg = '../../{lib}/scripts/menuCfg';
appConfiguration.getMenuCfg = function(){
	return appConfiguration.replaceSrcFolder(appConfiguration.menuCfg);
};

//表单配置文件相对于main的路径
appConfiguration.formConext = '../../{lib}/scripts/formConext';
appConfiguration.getFormContext = function() {
	return appConfiguration.replaceSrcFolder(appConfiguration.formConext);	
};

//本地数据跟目录相对于main.js的路径
appConfiguration.localDataConfig = '../../resources/localdata/localConfig';
appConfiguration.dictionaryURL = 'sys/categories';