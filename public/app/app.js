var firstApp = angular.module('firstApp', [
    'ui.router', 'satellizer', 'angular-storage'
]);

firstApp.config(function($locationProvider, $authProvider) {
    $locationProvider.html5Mode(true);

    $authProvider.google({
        clientId: '750877060752-9id4mesee899ihqk6ufs4ldi367n031u.apps.googleusercontent.com'
    });

    $authProvider.facebook({
        clientId: '561347801063464'
    });


    $authProvider.linkedin({
        clientId: '8138i93yvedf57'
    });

})


firstApp.run(['$transitions', '$state', function($transitions, $state) {
    $transitions.onError({}, function(error) {
        console.log("Line 14:", error._error.detail);
        if (error._error.detail.session == true && error._error.detail.role == 'admin') {
            $state.go('dashboard');
        } else if (!error._error.detail.session && error._error.detail.role == null) {
            $state.go('login');
        } else {
            $state.go('login');
        }
    });
}]);