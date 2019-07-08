firstApp.controller('registerController', ['$scope', '$auth', 'toaster', '$state', 'mainService', 'userAuth', function($scope, $auth, toaster, $state, mainService, userAuth) {
    $scope.saveRegistration = function(registrationData) {
        toaster.pop('success', 'registered', 'user registered');
        console.log('from ctrl', registrationData);
        mainService.saveRegistration(registrationData)
            .then(function(response) {
                console.log('response-from-server', response);
                $state.go('login');

            })
            .catch(function(error) {})
    }

    $scope.authenticate = function(provider) {
        $auth.authenticate(provider)
            .then(function(response) {
                console.log("LIne 17:", response.data.token);
                var user = {};
                user.access_token = response.data.token;
                userAuth.setCurrentUser(user);
                $state.go('dashboard.home');
            })
            .catch(function(error) {

            })
    };

}])
firstApp.controller('createAdminPasswordController', ['$scope', '$state', '$stateParams', 'mainService', function($scope, $state, $stateParams, mainService) {


    $scope.savePassword = function(data) {
        if (data.confirmPassword == data.password) {
            data.token = $stateParams.token;
            mainService.savePassword(data)
                .then(function(response) {
                    $state.go('login');
                })
                .catch(function(error) {});
        } else {

        }
    }
}])

firstApp.controller('loginController', ['$scope', '$state', 'mainService', 'userAuth', function($scope, $state, mainService, userAuth) {


    $scope.login = function(data) {
        mainService.login(data)
            .then(function(response) {
                console.log(response);
                var user = {};
                user.access_token = response.token;
                userAuth.setCurrentUser(user);
                $state.go('dashboard.home');
            })
            .catch(function(error) {

            });
    }
}]);

firstApp.controller('forgotPasswordController', ['$scope', '$state', 'mainService', function($scope, $state, mainService) {
    $scope.forgotPassword = function(data) {

        mainService.forgotPassword(data)

        .then(function(response) {
                console.log(response);
                $state.go('login');

            })
            .catch(function(error) {

            })
    }
}])

firstApp.controller('ResetPasswordController', ['$scope', 'mainService', function($scope, mainService) {
    $scope.ResetPassword = function(data) {


        mainService.ResetPassword(data)

        .then(function(response) {

            })
            .catch(function(error) {

            })
    }
}])
firstApp.controller('dashboardController', ['$scope', '$state', 'userAuth', function($scope, $state, userAuth) {

    $scope.logOut = function() {
        userAuth.setCurrentUser(null);
        $state.go('login');
    }

}]);


// firstApp.controller('mailSetupController', ['$scope', '$state', 'dashboardService', function($scope, $state, dashboardService) {
//     $scope.saveMailSetup = function(emailSetupData) {
//         console.log(data);
//         console.log('from ctrl', emailSetupData);

//         dashboardService.saveMailSetup(emailSetupData)

//         .then(function(response) {
//                 console.log('response-from-server', response);
//                 $state.go('testMale')
//             })
//             .catch(function(error) {

//             })
//     }
// }])


// firstApp.controller('testMailController', ['$scope', '$state', 'dashboardService', function($scope, $state, dashboardService) {
//     $scope.sendTestMail = function(testMailData) {
//         console.log(testMaledata);
//         console.log('from ctrl', testMailData);

//         dashboardService.sendTestMale(testMailData)

//         .then(function(response) {
//                 console.log('response-from-server', response);
//             })
//             .catch(function(error) {

//             })
//     }
// }])

// firstApp.controller('loglistController', ['$scope', '$state', 'getUserList', 'dashboardService', function($scope, getUserList, $state, dashboardService) {
//     console.log(getUserList.data.result);
//     $scope.userList = getUserList.data.result;
//     $scope.deleteUser = function(data) {
//         console.log(data.id);
//         dashboardService.deleteUser(data.id);
//     }

// }])