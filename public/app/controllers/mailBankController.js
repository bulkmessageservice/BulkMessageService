firstApp.controller('mailSetupController', ['$scope', '$state', 'dashboardService', 'getMailConfigrationData', function($scope, $state, dashboardService, getMailConfigrationData) {

    $scope.emailSetupData = getMailConfigrationData.data.emailSetup;

    $scope.saveEmailSetup = function(data) {
        dashboardService.saveMailSetup(data)
            .then(function(response) {
                console.log('response-from-server', response);
                $state.go('testMale')
            })
            .catch(function(error) {

            })
    }

}]);

firstApp.controller('testMailController', ['$scope', '$state', 'getMailConfigrationData', 'dashboardService', function($scope, $state, getMailConfigrationData, dashboardService) {

    if (getMailConfigrationData.data.emailSetup) {
        $scope.viewForm = true;
        $scope.testMailData = getMailConfigrationData.data.emailSetup;
        $scope.testMailData.subject = 'Test Mail';
        $scope.testMailData.content = 'Testing Mail Configration'
    } else {
        $scope.viewForm = false;
    }

    $scope.sendTestMail = function(data) {
        dashboardService.sendTestMail(data)
            .then(function(response) {

            })
            .catch(function(error) {

            });
    }
}]);