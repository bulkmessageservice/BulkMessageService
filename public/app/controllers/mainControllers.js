firstApp.controller('registerController', ['$scope', '$auth', 'toaster', '$state', 'mainService', function($scope, $auth, toaster, $state, mainService) {
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
        $auth.authenticate(provider);
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
                $state.go('dashboard');
            })
            .catch(function(error) {

            });
    }
}]);
firstApp.controller('dashboardController', ['$scope', '$state', 'userAuth', function($scope, $state, userAuth) {

    $scope.logOut = function() {
        userAuth.setCurrentUser(null);
        $state.go('login');
    }
}]);