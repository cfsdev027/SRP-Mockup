import { AppPages } from './app_pages.js';
import { ServiceAuthentication } from './service_authentication.js';

try {
    alert('Carregamento da pagina iniciado...');
    const selfAuthenticateStatus = await ServiceAuthentication.self_authenticate((data) => {
        alert('User: ' + JSON.stringify(data));
    });

    if(selfAuthenticateStatus) {
        AppPages.activate('ponto');
    } else {
        AppPages.activate('login');
    }
} catch(err) {
    alert(err.message);
}
