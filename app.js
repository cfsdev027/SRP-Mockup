import { AppPages } from './app_pages.js';
import { ServiceAuthentication } from './service_authentication.js';

const selfAuthenticateStatus = await ServiceAuthentication.self_authenticate((data) => {
    if(data) {
        AppPages.activate('ponto');
    } else {
        AppPages.activate('login');
    }
});
