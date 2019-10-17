/*
Copyright © 2016 ServiceNow, Inc.
 
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/*
 * Defines the login controller function. 
 */
myTasksControllers.controller('loginCtrl', [
    '$scope',
    '$rootScope',
    '$http',
    '$location', 'LoginSvc',
    function($scope, $rootScope, $http, $location, LoginSvc) {
    	
        $scope.loginSvc = LoginSvc;
        $scope.instanceName = '';

        // register login function here. Login button of login.html will invoke this method when user wants to log in.
        $scope.login = function() {
        	// We assume service now end point in the following format.
            $scope.loginSvc.login('https://' + $scope.instanceName + '.service-now.com', $scope.userName, $scope.password).then(function(data, status, headers, config) {
                $location.path('/tasks');
            }, function(error) {
                $scope.errorMessage = error.status + " : " + error.message;
            })
        }
    }
]);
