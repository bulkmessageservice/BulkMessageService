module.exports = function(app, adminRouter) {

    var jwt = require('jsonwebtoken');
    var secret_key = 'SRCEukzwWJybZkUpHVdA5PtdkFvWPmddyUwtb2';
    var mainController = require('../controller/main');
    var mailBankController = require('../controller/dasboard')

    app.get('/', mainController.mainFn);
    app.post('/saveRegistration', mainController.saveRegistration);
    app.get('/create-user-password', mainController.createUserPassword);
    app.post('/savePassword', mainController.savePassword);
    app.post('/forgotPassword', mainController.forgotPassword);
    app.post('/ResetPassword', mainController.ResetPassword);
    app.post('/login', mainController.login);


    var googleOAuthLogin = require('../controller/googleOAuth');
    app.post('/auth/google', googleOAuthLogin.googleLogin);


    adminRouter.use(function(req, res, next) {
        console.log("Hello");
        console.log(req.headers.authorization);
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
    // adminRouter.post('/changePassword', mainController.changePassword);


    app.use('/adminApi', adminRouter);
};