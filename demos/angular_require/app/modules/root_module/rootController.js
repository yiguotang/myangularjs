/**
 * Created by zhy on 14-10-17.
 */
define(['scripts/controllers/controllers', 'modules/root_module/userService'], function (controllers) {
    controllers.controller('RootController', ['$scope', 'UserService', function($scope, UserService){
        $scope.name = UserService.getUser();
    }]);
});