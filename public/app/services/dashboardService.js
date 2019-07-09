(function() {
    'use strict';

    firstApp.factory('dashboardService', Service);

    function Service($http, $q) {
        var service = {};
        service.saveMailSetup = saveMailSetup;
        service.sendTestMail = sendTestMail;
        service.saveSendMailData = saveSendMailData;


        return service;

        function saveMailSetup(data) {
            return $http.post('/adminApi/saveMailSetup', data).then(handleSuccess, handleError);
        }

        function sendTestMail(data) {
            return $http.post('/adminApi/sendTestMail', data).then(handleSuccess, handleError);
        }

        function saveSendMailData(data) {
            return $http.post('/adminApi/saveSendMailData', data).then(handleSuccess, handleError);
        }


        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }

    }
})();