var firstApp = angular.module('firstApp', [
    'ui.router', 'satellizer', 'angular-storage', 'toaster', 'ngFileUpload',
]);

firstApp.config(function($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true);
    // $urlMatcherFactoryProvider.strictMode(false);
    $httpProvider.interceptors.push('APIInterceptor');
})


firstApp.run(['$transitions', '$state', function($transitions, $state) {
    $transitions.onError({}, function(error) {

        if (error._error.detail.session == true && error._error.detail.role == 'admin') {
            $state.go('dashboard.home');
        } else if (!error._error.detail.session && error._error.detail.role == null) {
            $state.go('login');
        } else {
            $state.go('login');
        }
    });
}]);