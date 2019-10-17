/*
Copyright © 2016 ServiceNow, Inc.
 
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/*
 * Login service shared between taskDetailController.js and taskListController.js to
 * implement login and logout functions.
 */

myTasks.service('LoginSvc', ['$http', '$rootScope', '$location', '$q', '$window',
    function($http, $rootScope, $location, $q, $window) {
        this.login = function(url, username, password) {
            var deferred = $q.defer();
            var data = {};
            data['hosturl'] = url;
            data['username'] = username;
            data['password'] = password;

            $http.post('/login', data).success(function(data, status, headers, config) {
                return deferred.resolve(data, status, headers, config);
            }).error(function(data, status, headers, config) {
                var error = {}
                error.message = data;
                error.status = status;
                error.headers = headers;
                error.config = config;

                return deferred.reject(error);
            });
            return deferred.promise;
        }

        this.logout = function() {
            $http.delete('/logout').success(
                function(data, status, headers, config) {
                    $rootScope.tasks = null;

                    if($window.sessionStorage)
                        $window.sessionStorage.clear();

                    $location.url('/login');
                }).error(function(data, status, headers, config) {

                });
        }
    }
]);
