var firstApp = angular.module('firstApp', [
    'ui.router', 'satellizer'
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