import { InterfaceLogin } from './interface_login.js';
import { InterfacePonto } from './interface_ponto.js';

const PAGE_LOGIN_ID = 'tela-login';
const PAGE_PONTO_ID = 'tela-ponto';

export const AppPages = {
    pageLogin: document.getElementById(PAGE_LOGIN_ID),
    pagePonto: document.getElementById(PAGE_PONTO_ID),
    activate: function(page, callback) {
        // Use "this." para referenciar as propriedades do objeto
        this.pageLogin.classList.remove('ativa');
        this.pagePonto.classList.remove('ativa');

        var pageActive = null;
        switch(page){
          case 'login':
            this.pageLogin.classList.add('ativa');
            pageActive = this.pageLogin;
            InterfaceLogin.initialize();
            break;
          case 'ponto':
            this.pagePonto.classList.add('ativa');
            pageActive = this.pagePonto;
            InterfacePonto.initialize();
            break;
          default:
            throw 'Invalid page';
        };

        if(typeof callback === 'function') // Correção na checagem de função
            callback(pageActive);
    }
}
