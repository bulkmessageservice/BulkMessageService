firstApp.controller('registerController', ['$scope', '$auth', 'toaster', '$state', 'mainService', 'userAuth', function($scope, $auth, toaster, $state, mainService, userAuth) {
    $scope.saveRegistration = function(registrationData) {
        toaster.pop('success', 'registered', 'user registered');
        mainService.saveRegistration(registrationData)
            .then(function(response) {
                $state.go('login');

            })
            .catch(function(error) {})
    }

    $scope.authenticate = function(provider) {
        $auth.authenticate(provider)
            .then(function(response) {
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
                var user = {};
                user.access_token = response.token;
                userAuth.setCurrentUser(user);
                $state.go('dashboard.home');
            })
            .catch(function(error) {

            });
    }
}]);

firstApp.controller('forgotPassController', ['$scope', '$state', 'mainService', function($scope, $state, mainService) {

    $scope.forgotPassword = function(data) {
        mainService.forgotPassword(data)
            .then(function(response) {
                $state.go('login');
            })
            .catch(function(error) {
                $scope.errorMessage = error.message;
            });
    }
}])

firstApp.controller('resetPasswordController', ['$scope', '$state', 'mainService', '$stateParams', function($scope, $state, mainService, $stateParams) {

    $scope.resetPassword = function(data) {
        data.resetToken = $stateParams.resetToken;
        mainService.resetPassword(data)
            .then(function(response) {
                $state.go('login');
            })
            .catch(function(error) {

            })
    }
}])