import {ServiceUsers} from './service_users.js';
import {ServiceCookies} from './service_cookies.js';
import {ServiceStorage} from './service_storage.js';

const AUTHENTICATION_COOKIE_NAME = 'SRP-MOCKUP-AUTHENTICATION';

export const ServiceAuthentication = {
  authenticate: async function(username,password,callback) {
        try {
            const data = await ServiceUsers.fetchByUsernameAndPassword(username,password);
            if(data === null || data === undefined)
                return false;

            ServiceCookies.set(AUTHENTICATION_COOKIE_NAME,data.id,1);
            ServiceStorage.set(AUTHENTICATION_COOKIE_NAME,data);

            if(callback === 'function')
                callback(data);

            return true;

        } catch (err) {
            console.error("Erro na autenticação:", err.message);
            alert("Ocorreu um erro ao tentar conectar ao servidor de autenticação (authenticate).");

            return false;
        }
    },
    self_authenticate: async function(callback){
        try {
            const data = await ServiceUsers.fetch(ServiceCookies.get(AUTHENTICATION_COOKIE_NAME));
            if(data === null || data === undefined)
                return false;

            if (error) throw error;

            ServiceStorage.set(AUTHENTICATION_COOKIE_NAME,data);

            if(callback === 'function')
                callback(data);

            return true;

        } catch (err) {
            console.error("Erro na recuperação:", err.message);
            alert("Ocorreu um erro ao tentar conectar ao servidor de autenticação (self-authenticate).");
            
            return false;
        }
    },
    logout: function(callback){
        try {
            ServiceCookies.arase(AUTHENTICATION_COOKIE_NAME);
            ServiceStorage.arase(AUTHENTICARION_COOKIE_NAME);

            if(callback === 'function')
                callback();

            return true;
        } catch(e) {
            return false;
        }
    }
};
