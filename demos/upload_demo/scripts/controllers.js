var app = angular.module('uploadApp', ['angularFileUpload']);

app.controller('AppController', ['$scope', 'FileUploader', function($scope, FileUploader){
	var uploader = $scope.uploader = new FileUploader({
		url: 'uploader.php'
	});

	uploader.filters.push({
		name:'customFilter',
		fn:function(item /*{File|FileLikeObject}*/, options){
			return this.queue.length < 10;
		}
	});

	uploader.onWhenAddingFileFailed = function(item/*{File|FileLikeObject}*/, filter, options){
		
	}
}])