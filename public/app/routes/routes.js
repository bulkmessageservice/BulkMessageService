firstApp.config(function($stateProvider, $authProvider) {
    $stateProvider
        .state('login', {
            url: '/',
            templateUrl: '/partials/pagelogin.html',
            controller: 'loginController',
            resolve: {
                userBeforeLogin: userBeforeLogin
            }
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
            resolve: {
                checkCreateUserPassword: checkCreateUserPassword
            }
        })
        .state('forgotPassword', {
            url: '/forgotPassword',
            templateUrl: '/partials/pageforgotpassword.html',
            controller: 'forgotPassController'
        })
        .state('resetPassword', {
            url: '/reset-user-Password/:resetToken',
            templateUrl: '/partials/resetPassword.html',
            controller: 'resetPasswordController'
        })
        .state('dashboard', {
            abstract: true,
            url: '/dashboard',
            templateUrl: '/partials/dashboard.html',
            controller: 'dashboardController',
            resolve: {
                userAfterLogin: userAfterLogin
            }
        })
        .state('dashboard.home', {
            url: '',
            templateUrl: '/partials/dashboard_home.html'
                // controller: 'dashboardHomeController',

        })
        .state('dashboard.emailSetup', {
            url: '/emailSetup',
            templateUrl: '/partials/emailsetup.html',
            controller: 'mailSetupController',
            resolve: {
                getMailConfigrationData: ['$http', '$q', getMailConfigrationData]
            }
        })
        .state('dashboard.testMail', {
            url: '/testmail',
            templateUrl: '/partials/testmail.html',
            controller: 'testMailController',
            resolve: {
                getMailConfigrationData: ['$http', '$q', getMailConfigrationData]
            }
        })
        .state('dashboard.logList', {
            url: '/loglist',
            templateUrl: '/partials/loglist.html',
            controller: 'logListController',
            resolve: {
                getLogList: ['$http', '$q', getLogList]
            }
        })
        .state('dashboard.sendMail', {
            url: '/sendMail',
            templateUrl: '/partials/sendMail.html',
            controller: 'sendMailController',

        })
        .state('dashboard.excellConfigration', {
            url: '/excellConfigration',
            templateUrl: '/partials/excellConfigration.html',
            controller: 'excellConfigrationController',

        })


    $authProvider.google({
        clientId: '195962043832-im27q3ctoj1nl1rhq25ql7e0j1e35hsk.apps.googleusercontent.com'
    });

    $authProvider.facebook({
        clientId: '561347801063464'
    });

    $authProvider.linkedin({
        clientId: '8138i93yvedf57'
    });


});

function checkCreateUserPassword($q, $http, $stateParams) {
    var deferred = $q.defer($http, $q, $stateParams);
    $http({
        method: 'get',
        url: '/create-user-password/?token=' + $stateParams.token
    }).then(function successCallback(response) {
        console.log(response);
        if (response.data.result) {
            deferred.resolve(response.data);
        } else {
            deferred.reject({ tokenExpired: true });
        }
    }, function errorCallback(error) {
        deferred.reject({ tokenExpired: true });
    });
    return deferred.promise;
}

function userBeforeLogin($q, userAuth) {
    var deferred = $q.defer($q, userAuth);
    var currentUser = userAuth.getCurrentUser();
    access_token = currentUser ? currentUser.access_token : null;
    console.log("Line 75:", access_token);
    if (access_token) {
        deferred.reject({ session: true, role: 'admin' });
    } else {
        deferred.resolve();
    }
    return deferred.promise;
}

function userAfterLogin($q, userAuth) {
    var deferred = $q.defer();
    var currentUser = userAuth.getCurrentUser();
    access_token = currentUser ? currentUser.access_token : null;
    console.log("Line 75:", access_token);
    if (access_token) {
        deferred.resolve();
        // deferred.reject({ session: true, role: 'admin' });
    } else {
        deferred.reject({ session: false, role: 'admin' });
    }
    return deferred.promise;
}

function getLogList($http, $q) {
    var deferred = $q.defer();
    $http.get('/adminApi/getLogList').then(function(data) {
        deferred.resolve(data);
    });
    return deferred.promise;
}


function getMailConfigrationData($http, $q) {
    var deferred = $q.defer();
    $http.get('/adminApi/getMailConfigrationData').then(function(data) {
        deferred.resolve(data);
    });
    return deferred.promise;

}