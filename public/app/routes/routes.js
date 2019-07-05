firstApp.config(function($stateProvider) {
    $stateProvider

        .state('login', {
        url: '/',
        templateUrl: '/partials/pagelogin.html',

    })

    .state('forgotPassword', {
        url: '/forgotPassword',
        templateUrl: '/partials/pageforgotpassword.html',

    })

    .state('register', {
        url: '/register',
        templateUrl: '/partials/pageregister.html',
        controller: 'registerController'


    })

    .state('createAdminPassword', {
        url: '/create-user-password/:token',
        templateUrl: '/partials/create_password.html',
        controller: 'createAdminPasswordController',
        //resolve: {
        //    checkCreateUserPassword: checkCreateUserPassword
        //}
    })

});


function checkCreateUserPassword($q, $http, $state, $stateParams) {
    var deferred = $q.defer($http, $q, $stateParams);
    $http({
        method: 'get',
        url: '/create-user-password/?token=' + $stateParams.token
    }).then(function successCallback(response) {
        if (response.data.result) {
            deferred.resolve(response.data);
        } else {
            deferred.reject({ tokenExpired: true });
        }
    }, function errorCallback(error) {
        deferred.reject({ tokenExpired: true });
    });
    $state.go('createAdminPassword');
    return deferred.promise;
}