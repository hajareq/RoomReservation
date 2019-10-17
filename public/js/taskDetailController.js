/*
Copyright © 2016 ServiceNow, Inc.
 
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/*
 * Task details controller. This controller responsible for load task and comments. To load task it finds the 
 * task from the existing root scope object and load comments directly from the back end.
 */
myTasksControllers.controller('taskDetailCtrl', ['$scope', '$rootScope',
    '$routeParams', '$http', '$location', '$window', '$route', '$routeParams', 'LoginSvc',
    function($scope, $rootScope, $routeParams, $http, $location, $window, $route, $routeParams, LoginSvc) {
	
        $scope.loginSvc = LoginSvc;
        $scope.infoMessage = '';
        $scope.errorMessage = '';

        angular.element(document).ready(function() {
            // Not in session storage, seems like user has logged out.
            // Redirect to login page.
            if (!$window.sessionStorage.getItem('tasks')) {
                $location.url("/login");
                $scope.$apply();
            } else {
                //case: page reload, recover from session storage.
                if (!$rootScope.tasks)
                    $rootScope.tasks = JSON.parse($window.sessionStorage.getItem('tasks'));

                //collect task type and index to identify the specific task.
                if ($routeParams.type && $routeParams.id) {
                    $scope.task = $rootScope.tasks[$routeParams.type][$routeParams.id];
                }

                if ($scope.task) {
                    $scope.getComments();
                }
            }
        });

        $scope.addComment = function() {
            var body = {};
            body['comment'] = $scope.comment;

            $scope.infoMessage = 'Adding comment ...';
            $http.post('/task/' + $scope.task.sys_id + '/comments', body).success(
                function(data, status, headers, config) {
                    $scope.infoMessage = '';                 
                    $scope.comment = '';
                    // Reload the comments to display new one.
                    $scope.getComments();
                }).error(function(data, status, headers, config) {
                    $scope.infoMessage = '';
                    $scope.errorMessage = status + " : " + data;
            });

        }

        $scope.getComments = function() {
            
            $scope.infoMessage = 'Loading comments ...';
            $http.get('/task/' + $scope.task.sys_id + '/comments', {}).success(
                function(data, status, headers, config) {          
                    $scope.status = status;
                    $scope.infoMessage = '';
                    $scope.comments = data.result;
                }).error(function(data, status, headers, config) {
                	$scope.status = status;
                    $scope.infoMessage = '';
                    $scope.errorMessage = status + " : " + data;                  
            });
        }
    }
]);
