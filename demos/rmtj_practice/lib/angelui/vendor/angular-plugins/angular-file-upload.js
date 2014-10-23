/**!
 * AngularJS file upload/drop directive with http post and progress
 * @author  MyCtrlDanial  <danial.farid@gmail.com>
 * @version <%= pkg.version %>
 */
define(['../angular/angular', './angular-file-upload-html5-shim'], function (angular) {
    var angularFileUpload = angular.module('angularFileUpload', []);



    angularFileUpload.directive('ngFileSelect', [ '$parse', '$http', '$timeout', function ($parse, $http, $timeout) {
        return function (scope, elem, attr) {
            var fn = $parse(attr['ngFileSelect']);
            elem.bind('change', function (evt) {
                var files = [], fileList, i;
                fileList = evt.target.files;
                if (fileList != null) {
                    for (i = 0; i < fileList.length; i++) {
                        files.push(fileList.item(i));
                    }
                }
                $timeout(function () {
                    fn(scope, {
                        $files: files,
                        $event: evt
                    });
                });
            });
            elem.bind('click', function () {
                this.value = null;
            });
        };
    } ]);

    angularFileUpload.directive('ngFileDropAvailable', [ '$parse', '$http', '$timeout', function ($parse, $http, $timeout) {
        return function (scope, elem, attr) {
            if ('draggable' in document.createElement('span')) {
                var fn = $parse(attr['ngFileDropAvailable']);
                $timeout(function () {
                    fn(scope);
                });
            }
        };
    } ]);

    angularFileUpload.directive('ngFileDrop', [ '$parse', '$http', '$timeout', function ($parse, $http, $timeout) {
        return function (scope, elem, attr) {
            if ('draggable' in document.createElement('span')) {
                var fn = $parse(attr['ngFileDrop']);
                elem[0].addEventListener("dragover", function (evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    elem.addClass(attr['ngFileDragOverClass'] || "dragover");
                }, false);
                elem[0].addEventListener("dragleave", function (evt) {
                    elem.removeClass(attr['ngFileDragOverClass'] || "dragover");
                }, false);
                elem[0].addEventListener("drop", function (evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    elem.removeClass(attr['ngFileDragOverClass'] || "dragover");
                    var files = [], fileList = evt.dataTransfer.files, i;
                    if (fileList != null) {
                        for (i = 0; i < fileList.length; i++) {
                            files.push(fileList.item(i));
                        }
                    }
                    $timeout(function () {
                        fn(scope, {
                            $files: files,
                            $event: evt
                        });
                    });
                }, false);
            }
        };
    } ]);

    return angularFileUpload;
});
	

