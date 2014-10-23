/**
 * Created by zhy on 14-10-17.
 */
define(['scripts/services/services'], function (services) {
    services.factory('UserService', [function () {
        return {
            getUser: function () {
                return 'testUser'
            }
        };
    }]);
});
