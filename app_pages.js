const PAGE_LOGIN_ID = 'tela-login';
const PAGE_PONTO_ID = 'tela-ponto';

export const AppPages = {
    pageLogin: document.getElementById(PAGE_LOGIN_ID),
    pagePonto: document.getElementById(PAGE_PONTO_ID),
    activate: function(page, callback) {
        pageLogin.classList.remove('ativa');
        pagePonto.classList.remove('ativa');

        var pageActive = null;
        switch(page){
          case 'login':
            pageLogin.classList.add('ativa');
            pageActive = pageLogin;
            break;
          case 'ponto':
            pagePonto.classList.add('ativa');
            pageActive = pagePonto;
            break;
          default:
            throw 'Invalid page';
        };

        if(callback === 'function')
            callback(pageActive);
    }
}
