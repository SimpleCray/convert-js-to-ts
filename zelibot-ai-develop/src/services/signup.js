const { CognitoUserAttribute } = require("amazon-cognito-identity-js");

export const SignUpUserWithCognito = (email, password) => {
    // Add attribute list values.
    const attributeList = [];
    attributeList.push(
        new CognitoUserAttribute({
            Name: 'email',
            // Enter email value here
            Value: email
        })
    );

    let username = email;
    userpool.signUp(username, password, attributeList, null, (err, data) => {
        if (err) {
            // console.log(err)
            alert('Could not sign up.')
            // Trigger some kind of error message here by setting state.
        } else {
            alert('User added successfully');
            // Re-route user to auth pages here.
        }
    });

}
