var firstApp = angular.module('firstApp', [
    'ui.router', 'satellizer', 'angular-storage', 'toaster',
]);

firstApp.config(function($locationProvider, $urlMatcherFactoryProvider, $httpProvider) {
    $locationProvider.html5Mode(true);
    $urlMatcherFactoryProvider.strictMode(false);
    $httpProvider.interceptors.push('APIInterceptor');
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