(function() {
    'use strict';

    firstApp.factory('mainService', Service);

    function Service($http, $q) {
        var service = {};
        service.saveRegistration = saveRegistration;
        service.savePassword = savePassword;
        service.forgotPassword = forgotPassword;
        service.ResetPassword = ResetPassword;

        service.login = login;
        return service;

        function saveRegistration(data) {
            console.log('saveRegistration');
            return $http.post('/saveRegistration', data).then(handleSuccess, handleError);
        }

        function savePassword(data) {
            console.log('savePass', data);
            return $http.post('/savePassword', data).then(handleSuccess, handleError);
        }

        function forgotPassword(data) {
            console.log(data);
            return $http.post('/forgotPassword', data).then(handleSuccess, handleError);

        }

        function ResetPassword(data) {
            return $http.post('/ResetPassword', data).then(handleSuccess, handleError);

        }

        function login(data) {
            return $http.post('/login', data).then(handleSuccess, handleError);
        }

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }



    }
})();