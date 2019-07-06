module.exports = function(app) {

    var mainController = require('../controller/main');

    app.post('/saveRegistration', mainController.saveRegistration);
    app.get('/create-user-password', mainController.createUserPassword);
    app.post('/savePassword', mainController.savePassword);

    app.post('/login', mainController.login);
    var googleOAuthLogin = require('../controller/googleOAuth');
    app.post('/auth/google', googleOAuthLogin.googleLogin);

};