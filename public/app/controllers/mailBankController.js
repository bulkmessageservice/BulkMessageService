firstApp.controller('mailSetupController', ['$scope', '$state', 'dashboardService', 'getMailConfigrationData', function($scope, $state, dashboardService, getMailConfigrationData) {

    if (getMailConfigrationData.data.emailSetup) {
        $scope.emailSetupData = getMailConfigrationData.data.emailSetup;
    } else {
        $scope.emailSetupData = {};
    }

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

firstApp.controller('testMailController', ['$scope', '$state', 'dashboardService', 'getMailConfigrationData', function($scope, $state, dashboardService, getMailConfigrationData) {

    if (getMailConfigrationData.data.emailSetup) {
        $scope.viewForm = true;
        $scope.testMailData = getMailConfigrationData.data.emailSetup;
        $scope.testMailData.subject = 'Test Mail';
        $scope.testMailData.content = 'Testing Mail Configration'
    } else {
        $scope.viewForm = false;
        $scope.testMailData = {};
    }

    $scope.sendTestMail = function(data) {
        dashboardService.sendTestMail(data)
            .then(function(response) {

            })
            .catch(function(error) {

            });
    }


}]);

firstApp.controller('logListController', ['$scope', '$state', 'getLogList', function($scope, $state, getLogList) {
    console.log(getLogList);

    $scope.logList = getLogList.data.result;

}])

firstApp.controller('sendMailController', ['$scope', 'dashboardService', function($scope, dashboardService, ) {


    $scope.sendTestMail = function(sendMailData) {
        console.log(sendMailData);
        dashboardService.saveSendMailData(sendMailData)
            .then(function(response) {})
            .catch(function(error) {})
    }
}])


firstApp.controller('excellConfigrationController', ['$scope', '$state', 'Upload', function($scope, $state, Upload) {

    $scope.selectFile = function(file) {
        $scope.fileSelected = true;
        $scope.fileName = file.name;
        if (file) {
            $('#couponError').hide();
            var fileType = file.name.substr(file.name.lastIndexOf('.') + 1);
            if (fileType == 'xlsx' || fileType == 'xlsx') {
                $scope.fileError = false;
            } else {
                $scope.fileError = true;
            }
        }
    };


    $scope.uploadExcel = function(excelFile) {
        excelFile.upload = Upload.upload({
                url: '/adminApi/uploadExcel',
                data: { excelFile: excelFile },
            }).then(function(response) {

            })
            .catch(function(error) {
                if (error.status == 409) {
                    $('#couponError').show();
                    $scope.successArray = error.data.successArray;
                    $scope.duplicateCouponList = error.data.duplicateArray;
                    $scope.uploadCouponButtonDisabled = false;
                    $scope.uploadCouponButtonValue = "UPLOAD EXCEL";
                } else {

                    $scope.uploadCouponButtonDisabled = false;
                    $scope.uploadCouponButtonValue = "UPLOAD EXCEL";
                }
            });
    };
}])