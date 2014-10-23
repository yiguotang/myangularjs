define(['angular', 'jquery'], function(angular, $){
	function matchURL(urlPattern, urlToCompare, params){
		var urlParts = urlToCompare.split('?');
		urlToCompare = urlParts[0];
		if (urlParts.length > 1) {
			readParams(params, urlParts[1]);
		};
		var valuePattern = /\{\w+\}/g;
		var patternLastIndex = 0;
		var urlLastIndex = 0;
		while((result = valuePattern.exec(urlPattern)) != null){
			var start = result.index;
			var urlStart = urlLastIndex + start - patternLastIndex;
			var urlLimit = urlToCompare.substring(urlLastIndex, urlStart);
			var patternLimit = urlPattern.substring(patternLastIndex, start);
			if (urlLimit != patternLimit) {
				return false;
			};
			patternLastIndex = valuePattern.lastIndex;
			urlLastIndex = urlToCompare.indexOf('/', urlStart);
			urlLastIndex = urlLastIndex > -1 ? urlLastIndex : urlToCompare.length;
			var param = urlToCompare.substring(urlStart, urlLastIndex);
			var valueKey = result[0].substring(1, result[0].length - 1);
			param[valueKey] = param;
		};

		var result = urlPattern.substring(patternLastIndex) == urlToCompare.substring(urlLastIndex);
		return result;
	};

	//解析url的参数，将以&连接的键值对拆分保存到paramObj数组中
	function readParams(paramObj, paramStr){
		var paramPairStrs = paramStr.split('&');
		for(var i = 0, len = paramPairStrs.length; i < len; i++){
			var paramPair = paramPairStrs[i].split('=');
			paramObj[paramPair[0]] = paramPair[1];
		}
	};

	function generateGetAllHandler(dataList){
		return {
			'get': function(){
				console.log('find all');
				console.log(dataList);
				return {
					success: true,
					data: dataList
				}
			}
		};
	};

	function randomPK(length){
		var randomStringBase = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
		var stringBuffer = "";
		for(var i = 0; i < length; i++){
			var charIndex = Math.round(Math.random() * randomStringBase.length);
			stringBuffer += randomStringBase.charAt(charIndex);
		}
		return stringBuffer;
	};

	function createListItem(listItem, entity){
		var obj = {};
		for(var key in listItem){
			obj[key] = entity[key];
		}
		return obj;
	};

	function findOneById(list, id){
		for(var index = 0, len = list.length; index < len; index++){
			if (list[index].pkid == id) {
				return {
					index: index,
					data: list[index]
				};
			};
		}
		return null;
	};

	function generateFindOneHandler(dataDetails, dataList){
		return{
			'get': function(params){
				var obj = findOneById(dataDetails, param.id);
				if (obj == null) {
					return {success:false}
				}else{
					return {success:true, data:obj.data}
				}
			},
			'put': function(params, entity){
				var obj = findOneById(dataDetails, params.id);
				if (obj == null) {
					return {success: false}
				}else{
					dataDetails[obj.index] = entity;
					var liteObj = findOneById(dataList, param.id);
					if(liteObj != null){
						for(var key in dataList{liteObj.index}){
							dataList[liteObj.index][key] = entity[key];
						}
					}
					return {success: true}
				}
			},
			'delete': function(params){
				var obj = findOneById(dataDetails, params.id);
				if (obj != null) {
					dataDetails.splice(obj.index, 1);
				}
				obj = findOneById(dataList, param.id);
				if (obj != null) {
					dataList.splice(obj.index, 1);
				}
				return {success: true}
			}
		};
	};

	function generatePostHandler(dataDetails, dataList){
		return{
			'post':function(params, entity){
				var pky = randomPK(5);
				while(findOneById(dataDetails, pk) != null){
					pk = randomPK(5);
				}
				entity.pkid = pk;
				dataDetails.push(entity);
				var listItemObj = crceateListItem(dataList[0], entity);
				dataList.push(listItemObj);
				return{
					success:true
				}
			}
		};
	};

	return {
		dataMap:{},
		register:function(params){
			console.log("register new url:" + params.url);
			console.log(params);
			var url = param.url;
			if (url.substring(url.length - 1) == "/") {
				url = url.substring(0, url.length - 1);
			};
			var dataList = params.dataList;
			var dataDetails = params.dataDetails;
			this.dataMap[url + 's'] = generateGetAllHandler(dataList);
			this.dataMap[url + "/{id}"] = generateFindOneHandler(dataDetails, dataList);
			this.dataMap[url] = generatePostHandler(dataDetails, dataList);
		},
		allMappings:function(){
			console.log('handling get request:' + url);
			for(var urlPattern in this.dataMap){
				var params = {};
				if (matchURL(urlPattern, url, params)) {
					console.log('params');
					console.log(params);
					if (angular.isFunction(this.dataMap[urlPattern].get)) {
						return [200, this.dataMap[urlPattern].get(params)];
					};
				};
			};
			return [404];
		},
		handlePost:function(url, entity){
			for(var urlPattern in this.dataMap){
				var params = {};
				if (matchURL(urlPattern, url, params)) {
					params = $.extend({}, params, entity);
					if (angular.isFunction(this.dataMap[urlPattern].post)) {
						return [200, this.dataMap[urlPattern].post[params, entity]];
					};
				};
			}
			return [404];
		}
	};
});