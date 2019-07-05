(function() {
    'use strict';

    firstApp.factory('mainService', Service);

    function Service($http, $q) {
        var service = {};
        service.saveRegistration = saveRegistration;

        return service;

        function saveRegistration(data) {
            console.log('saveRegistration');
            return $http.post('/saveRegistration', data).then(handleSuccess, handleError);
        }


        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }
})();