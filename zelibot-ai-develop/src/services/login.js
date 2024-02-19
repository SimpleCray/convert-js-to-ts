const { authenticate } = require("./authenticate");

export const LoginCognitoUser = (email, password) => {
    authenticate(email, password).then((data) => {
        setLoginErr('');
        // Navigate user here to auth pages.
    }, (err) => {
        // console.log(err);
        // Display error message.
        setLoginErr(err.message)
    }).catch(err => console.log(err))
}
