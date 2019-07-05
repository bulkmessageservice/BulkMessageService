firstApp.controller('registerController', ['$scope', '$auth', '$state', 'mainService', function($scope, $auth, $state, mainService) {
    $scope.saveRegistration = function(registrationData) {
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
    console.log('createPass');


    $scope.savePassword = function(data) {
        console.log(data);
        // if (data.confirmPassword == data.password) {
        //     data.token = $stateParams.token;
        //     mainService.savePassword(data)
        //         .then(function(response) {
        //             $state.go('home.login');
        //         })
        //         .catch(function(error) {});
        // } else {

        // }
    }
}])