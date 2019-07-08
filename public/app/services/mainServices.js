(function() {
    'use strict';

    firstApp.factory('mainService', Service);

    function Service($http, $q) {
        var service = {};
        service.login = login;
        service.saveRegistration = saveRegistration;
        service.savePassword = savePassword;
        service.forgotPassword = forgotPassword;
        service.resetPassword = resetPassword;


        return service;

        function login(data) {
            return $http.post('/login', data).then(handleSuccess, handleError);
        }

        function saveRegistration(data) {
            return $http.post('/saveRegistration', data).then(handleSuccess, handleError);
        }

        function savePassword(data) {
            return $http.post('/savePassword', data).then(handleSuccess, handleError);
        }

        function forgotPassword(data) {
            return $http.post('/forgotPassword', data).then(handleSuccess, handleError);
        }

        function resetPassword(data) {
            return $http.post('/resetPassword', data).then(handleSuccess, handleError);
        }

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }



    }
})();