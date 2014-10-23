define(['angular', 'dataEngine', 'angularMock', appConfiguration.localDataConfig], function(angular, localDataEngine){
	return angular.module('httpMock', ['ngMockE2E'], null).run(['$httpBackend', '$log', function($httpBackend, $log){
		$httpBackend.whenGET(/.+\.html$/).passThrough();

		$httpBackend.whenGET(/.+$/).respond(function(method, url, data){
			$log.debug('get requesting url:' + url);
			return localDataEngine.handleGet(url);
		});

		$httpBackend.whenPOST(/.+$/).respond(function(method, url, data){
			$log.debug('post request url:' + url + ', data:');
			data = angular.fromJson(data);
			$log.debug(data);
			return localDataEngine.handlePost(url, data);
		});

		$httpBackend.whenPut(/.+$/).respond(function(method, url, data){
			$log.debug('put request url:' + url);
			$log.debug('data:');
			data = angular.fromJson(data);
			$log.debug(data);
			return localDataEngine.handlePut(url, data);
		});

		$httpBackend.whenDELETE(/.+$/).respond(function(method, url, data){
			$log.debug('delete request url:' + url + ', data:');
			$log.debug(data);
			return localDataEngine.handleDelete(url, data);
		});
	}]);
});