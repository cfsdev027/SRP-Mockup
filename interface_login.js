import { ServiceAuthentication } from './service_authentication.js';

const FORM_LOGIN_VIEW_ID = 'form-login';
const USERNAME_VIEW_ID = 'usuario';
const PASSWORD_VIEW_ID = 'senha';

export const InterfaceLogin = {
    formLoginView: document.getElementById(FORM_LOGIN_VIEW_ID),
    usernameView: document.getElementById(USERNAME_VIEW_ID),
    passwordView: document.getElementById(PASSWORD_VIEW_ID),
    initialize: function() {
        formLoginView.addEventListener('submit', formLoginViewOnSubmit);
    },
    formLoginViewOnSubmit: async function(e) {
        e.preventDefault();

        const authenticateState = ServiceAuthentication.authenticate(
            usernameView.value,
            passwordView.value,
            (data) => {
                window.location.reload();
            }
        );
    }
}
