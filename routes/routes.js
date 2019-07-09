module.exports = function(app, adminRouter, multipartMiddleware) {

    var jwt = require('jsonwebtoken');
    var secret_key = 'SRCEukzwWJybZkUpHVdA5PtdkFvWPmddyUwtb2';

    var mainController = require('../controller/main');
    var mailBankController = require('../controller/mailBank')
    var googleOAuthLogin = require('../controller/googleOAuth');

    app.post('/login', mainController.login);
    app.post('/saveRegistration', mainController.saveRegistration);
    app.get('/create-user-password', mainController.createUserPassword);
    app.post('/savePassword', mainController.savePassword);
    app.post('/forgotPassword', mainController.forgotPassword);
    app.post('/resetPassword', mainController.resetPassword);

    app.post('/auth/google', googleOAuthLogin.googleLogin);


    adminRouter.use(function(req, res, next) {

        var token = req.headers.authorization;
        jwt.verify(token, secret_key, function(err, decoded) {
            if (err) {
                res.status(400).json('Invalid Request');
            } else {
                req.decoded = decoded;
                next();
            }
        });
    });

    adminRouter.post('/saveMailSetup', mailBankController.saveMailSetup);
    adminRouter.get('/getMailConfigrationData', mailBankController.getMailConfigrationData);
    adminRouter.post('/sendTestMail', mailBankController.sendTestMail);
    adminRouter.get('/getLogList', mailBankController.getLogList);
    adminRouter.post('/saveSendMailData', mailBankController.saveSendMailData);
    adminRouter.post('/uploadExcel', multipartMiddleware, mailBankController.uploadExcel);



    app.use('/adminApi', adminRouter);
};