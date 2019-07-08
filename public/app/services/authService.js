(function() {
    'use strict';

    firstApp.factory('userAuth', ['store', Service]);

    function Service(store) {
        var service = {};
        var currentUser = null;

        service.setCurrentUser = setCurrentUser;
        service.getCurrentUser = getCurrentUser;

        return service;

        function setCurrentUser(user) {
            currentUser = user;
            store.set('feedbackUser', user);
            return currentUser;
        }

        function getCurrentUser() {
            if (!currentUser) {
                currentUser = store.get('feedbackUser');
            }
            return currentUser;
        }

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }
})();

firstApp.service('APIInterceptor', ['$rootScope', 'userAuth', '$q', function($rootScope, userAuth, $q) {
    var service = this;
    service.request = function(config) {
        var currentUser = userAuth.getCurrentUser();
        console.log("Line 42:", currentUser);

        access_token = currentUser ? currentUser.access_token : null;

        if (access_token) {
            config.headers.authorization = access_token;
            console.log("Line 48:", config.headers.authorization);
        }
        return config;
    };
    service.responseError = function(response) {
        if (response.status === 400) {
            userAuth.setCurrentUser(null);
            $rootScope.$broadcast('unauthorized');
        }
        return $q.reject(response);
    };
}]);