module.exports = function(app) {

    var mainController = require('../controller/main');
    app.get('/', mainController.mainFn);
    app.post('/saveRegistration', mainController.saveRegistration);
    app.get('/getUserList', mainController.getUserList);
    app.get('/create-user-password', mainController.createUserPassword);
    app.post('/savePassword', mainController.savePassword);


    var googleOAuthLogin = require('../controller/googleOAuth');
    app.post('/auth/google', googleOAuthLogin.googleLogin);

};