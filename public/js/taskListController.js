/*
Copyright © 2016 ServiceNow, Inc.
 
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/*
 * Task list controller. Load all the tasks and render them.
 */
myTasksControllers.controller('taskListCtrl', ['$scope', '$rootScope', '$window', '$http', '$location', 'LoginSvc',
    function($scope, $rootScope, $window, $http, $location, LoginSvc) {
        $scope.loginSvc = LoginSvc;
        $scope.loadingTasks = false;

        // Loads the tasks to render.
        angular.element(document).ready(function() {
            $scope.getTasks();
        });

        $scope.getTasks = function() {
            $scope.loadingTasks = true;
            $http.get('/tasks', {}).success(function(data, status, headers, config) {
            	
            	// we store the result in root scope so that it can be shared with the task details controller to retrieve the task.
                $rootScope.tasks = data.result;

                // if there are tasks sort it with key
                if ($rootScope.tasks)
                    $rootScope.tasks = $scope.getOrderByKey($rootScope.tasks);

                //store in session storage as $rootScope variables is cleared on refresh.
                if ($window.Storage)
                    $window.sessionStorage.setItem('tasks', JSON.stringify($rootScope.tasks));
                $scope.loadingTasks = false;
            }).error(function(data, status, headers, config) {
            	$scope.loadingTasks = false;
                $scope.errorMessage = data;
                $scope.$apply();
            });
        }

        // function to order map based on key values.
        $scope.getOrderByKey = function(map) {
            var sortedMap = {};
            var keys = [];

            for (var k in map) {
                keys.push(k);
            }
            keys.sort();
            for (var idx = 0; idx < keys.length; idx++) {
                sortedMap[keys[idx]] = map[keys[idx]];
            }
            return sortedMap;
        }
    }
]);
