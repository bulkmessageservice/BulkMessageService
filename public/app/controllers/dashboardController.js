firstApp.controller('dashboardController', ['$scope', '$state', 'userAuth', function($scope, $state, userAuth) {

    $scope.logOut = function() {
        userAuth.setCurrentUser(null);
        $state.go('login');
    }

}]);