const PAGE_LOGIN_ID = 'tela-login';
const PAGE_PONTO_ID = 'tela-ponto';

const FORM_LOGIN_VIEW_ID = 'form-login';
const USERNAME_ID = 'usuario';
const PASSWORD_ID = 'senha';

const AUTHENTICATION_COOKIE_NAME = 'SRP-MOCKUP-AUTHENTICATION';

const BTN_LOGOUT_ID = 'btn-logout';
const BTN_ENTRADA_ID = 'btn-entrada';
const BTN_SAIDA_ID = 'btn-saida';
const LOG_ENTRADA_COLOR = '#10b981';
const LOG_SAIDA_COLOR = '#f59e0b';
const LOG_ENTRADA_ID = 'log-entrada';
const LOG_SAIDA_INTERVALO_ID = 'log-saida-intervalo';
const LOG_ENTRADA_INTERVALO_ID = 'log-entrada-intervalo';
const LOG_SAIDA_ID = 'log-saida';
const RELOGIO_VIEW_ID = 'relogio';
const DATA_ATUAL_VIEW_ID = 'data-atual';
const LOG_VIEW_ID = 'console-ponto';
const LOG_PLACEHOLDER_ID = 'placeholder-log';
const USERNAME_VIEW_ID = 'username-view';
const DOCUMENT_VIEW_ID = 'document-view';
const DOCUMENT_TYPE_VIEW_ID = 'document-type-view';
const TO_LOCALE_DATA_STRING_OPTIONS = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const LOG_TEMPLATE_HTML = `
            <div id="{ID}"class="log-item" style="color: {COLOR} !important;">
                <div class="log-header-line">
                    <span class="log-time">[{HOUR}]</span>
                    <span class="log-status status-entry">{TYPE}</span>
                </div>
                <div class="log-details">{DETAILS}</div>
            </div>`;

const SUPABASE_URL = "https://sdakvoeythnbfqfgupzf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkYWt2b2V5dGhuYmZxZmd1cHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMDA1MjksImV4cCI6MjA5MzY3NjUyOX0.U13KCcwWUTStp1-k8at9CudflI66uJ8YhMzSErQAlrM";

const ServiceSupabase = {
    client: function(){
      return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
}

const ServiceCookies = {
    set: function(nome, valor, dias) {
        let expiracao = "";
        if (dias) {
            const data = new Date();
            data.setTime(data.getTime() + (dias * 24 * 60 * 60 * 1000));
            expiracao = "; expires=" + data.toUTCString();
        }
        document.cookie = nome + "=" + (valor || "") + expiracao + "; path=/; SameSite=Strict";
    },
    get: function(nome) {
        const nomeEQ = nome + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nomeEQ) == 0) return c.substring(nomeEQ.length, c.length);
        }
        return null;
    },
    erase: function(nome) {
        document.cookie = nome + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
};

const ServiceStorage = {
    set: function(key,data) {
        localStorage.setItem(key,JSON.stringify(data));
    },
    get: function(key){
        try {
            return JSON.parse(localStorage.getItem(key))  
        } catch(e) {
            return null;
        };
    },
    erase: function(key) {
        localStorage.removeItem(key);
    }
};

const ServiceUsers = {
    get: async function() {
        try {
            const client = ServiceSupabase.client();

           const { data, error } = await client.from('users').select();

           if (error) throw error;

            return data;
        } catch(err) {
            console.log('An exception has ben throw in service Users.get: ' + err.message);
          
            return null;
        }
    },
    fetch: async function(id) {
        try {
            const client = ServiceSupabase.client();

            const { data, error } = await client.from('users')
              .select()
              .eq('id', id)
              .maybeSingle();

            if (error) throw error;

            return data;
        } catch(err) {
            alert('An exception has ben throw in ServiceUsers.fetch: ' + err.message);
            console.log('An exception has ben throw in service Users.fetch: ' + err.message);
          
            return null;
        }
    },
    fetchByUsernameAndPassword: async function(username,password) {
        try {
            const client = ServiceSupabase.client();

            const { data, error } = await client.from('users')
              .select()
              .eq('username', username)
              .eq('password', password)
              .maybeSingle();

            if (error) throw error;

            return data;
        } catch(err) {
            console.log('An exception has ben throw in service Users.fetchByUsernameAndPassword: ' + err.message);
          
            return null;
        }
    },
    fetchByDocument: async function(documentType,document) {
        try {
            const client = ServiceSupabase.client();

            const { data, error } = await client.from('users')
              .select()
              .eq('document_type', documentType)
              .eq('document', document)
              .maybeSingle();

            if (error) throw error;

            return data;
        } catch(err) {
            console.log('An exception has ben throw in service Users.fetchByDocument: ' + err.message);
          
            return null;
        }
    },
    add: async function(username,password,documentType,document,role) {
        try {
            const client = ServiceSupabase.client();

            const { data, error } = await client
                .from('users')
                .insert([{
                    username: username,
                    password: password,
                    document_type: documentType,
                    document: document,
                    role: role
                }]).select().maybeSingle();

            if (error) throw error;

            return data;
        } catch(err) {
            console.log('An exception has ben throw in service Users.add: ' + err.message);
          
            return null;
        }
    },
    update: async function(id,username,password,documentType,document,role,ativo) {
        try {
            const client = ServiceSupabase.client();

            const { data, error } = await client
                .from('users')
                .update({
                    username: username,
                    password: password,
                    document_type: documentType,
                    document: document,
                    role: role,
                    ativo: ativo
                }).select()
                .eq('id', id)
                .maybeSingle();

            if (error) throw error;

            return data;
        } catch(err) {
            console.log('An exception has ben throw in service Users.add: ' + err.message);
          
            return null;
        }
    },
    delete: async function(id) {
        try {
            const client = ServiceSupabase.client();

            const { data, error } = await client
                .from('users')
                .update({
                  ativo: false
                }).select()
                .eq('id', id)
                .maybeSingle();

            if (error) throw error;

            return data;
        } catch(err) {
            console.log('An exception has ben throw in service Users.add: ' + err.message);
          
            return null;
        }
    },
}

const ServiceAuthentication = {
  authenticate: async function(username,password,callback) {
        try {
            const data = await ServiceUsers.fetchByUsernameAndPassword(username,password);
            if(data === null || data === undefined)
                return false;

            ServiceCookies.set(AUTHENTICATION_COOKIE_NAME,data.id,1);
            ServiceStorage.set(AUTHENTICATION_COOKIE_NAME,data);

            if(typeof callback === 'function')
                callback(data);

            return true;

        } catch (err) {
            console.error("Erro na autenticação:", err.message);
            alert("Ocorreu um erro ao tentar conectar ao servidor de autenticação (authenticate).");

            return false;
        }
    },
    self_authenticate: async function(){
        try {
            const data = await ServiceUsers.fetch(ServiceCookies.get(AUTHENTICATION_COOKIE_NAME));
            if(data === null) {
                return false;
            }
                         
            ServiceStorage.set(AUTHENTICATION_COOKIE_NAME,data);

            return true;

        } catch (err) {
            console.error("Erro na recuperação:", err.message);
            alert("Ocorreu um erro ao tentar conectar ao servidor de autenticação (self-authenticate).");
            
            return false;
        }
    },
    logout: function(callback){
        try {
            ServiceCookies.erase(AUTHENTICATION_COOKIE_NAME);
            ServiceStorage.erase(AUTHENTICATION_COOKIE_NAME);

            if(typeof callback === 'function')
                callback();

            return true;
        } catch(e) {
            return false;
        }
    }
};

const InterfacePonto = {
    btnLogout: document.getElementById(BTN_LOGOUT_ID),
    btnEntrada: document.getElementById(BTN_ENTRADA_ID),
    btnSaida: document.getElementById(BTN_SAIDA_ID),
    initialize: function() {
        try {
            const date = new Date().toLocaleTimeString('pt-BR');
            this.setRelogioView();
            this.setDataAtualView(date);
            this.userStateHasChange();
        } catch(err) {
            console.log('An exception has ben throw in InterfacePontos.initialize: ' + err.message);
        }
    },
    btnLogoutOnClick: function() {
        alert('LOGOUT');
        ServiceAuthentication.logout(() => window.location.reload());
    },
    btnEntradaOnClick: function() {
        alert('ADD ENTRADA');
        let logPlaceHolder = document.getElementById(LOG_PLACEHOLDER_ID);
        if(logPlaceHolder !== null && logPlaceHolder !== undefined) 
            logPlaceHolder.remove();
                
        let logEntrada = document.getElementById(LOG_ENTRADA_ID);
        if(logEntrada === null || logEntrada === undefined) {
            this.setLogView({ type: 1, timestamp: new Date().toLocaleTimeString('pt-BR')});            
        } else {
            this.setLogView({ type: 3, timestamp: new Date().toLocaleTimeString('pt-BR')}); 
        }
    },
    btnSaidaOnClick: function() {
        alert('ADD SAÍDA');
        let logSaidaIntervalo = document.getElementById(LOG_SAIDA_INTERVALO_ID);
        if(logSaidaIntervalo === null || logSaidaIntervalo === undefined) {
            this.setLogView({ type: 2, timestamp: new Date().toLocaleTimeString('pt-BR')});
        } else {
            this.setLogView({ type: 4, timestamp: new Date().toLocaleTimeString('pt-BR')});
        }
    },
    setRelogioView: function() {
        try {
            setInterval(() => {
                document.getElementById(RELOGIO_VIEW_ID).innerText = new Date().toLocaleTimeString('pt-BR');
            }, 1000);
        } catch(err) {
            console.log('An exception has ben throw in InterfacePontos.setRelogioView: ' + err.message);
        }
    },
    getRelogioView: function() {
        try {
            return new Date(document.getElementById(RELOGIO_VIEW_ID).innerText).toLocaleDateString('pt-BR');
        } catch(err){
            console.log('An exception has ben throw in InterfacePontos.getRelogioView: ' + err.message);
        }
    },
    setDataAtualView: function(value) {
        try {
            document.getElementById(DATA_ATUAL_VIEW_ID).innerText = new Date(value).toLocaleDateString('pt-BR', TO_LOCALE_DATA_STRING_OPTIONS);
        } catch(err) {
            console.log('An exception has ben throw in InterfacePontos.setDataAtualView: ' + err.message);
        }
    },
    getDataAtualView: function() {
        try {
            return new Date(document.getElementById(DATA_ATUAL_VIEW_ID).innerText).toLocaleDataString('pt-BR', TO_LOCALE_DATA_STRING_OPTIONS);
        } catch(err){
            console.log('An exception has ben throw in InterfacePontos.getDataAtualView: ' + err.message);
        }
    },
    btnToggle: function(id, disabled) {
        const btn = document.getElementById(id);
        if (!btn) return;

        // Define o atributo real de desabilitado
        btn.disabled = disabled;

        // Opcional: Adiciona uma classe para garantir o estilo visual 
        // se o seu CSS 'ponto.css' não estiver herdando do Bootstrap corretamente
        if (disabled) {
            btn.style.opacity = "0.5";
            btn.style.cursor = "not-allowed";
            btn.style.pointerEvents = "none"; // Garante que não haja cliques
        } else {
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
            btn.style.pointerEvents = "auto";
        }
    },
    setLogView: function(value) {
        try {
            var logView = null;
            switch(value.type) {
              case 1: // ENTRADA
                this.btnToggle(BTN_ENTRADA_ID, true);
                this.btnToggle(BTN_SAIDA_ID, false);
                logView = this.getLogEntradaView(value.timestamp);
                break;
              case 2: // SAÍDA INTERVALO
                this.btnToggle(BTN_ENTRADA_ID, false);
                this.btnToggle(BTN_SAIDA_ID, true);
                logView = this.getLogSaidaIntervaloView(value.timestamp);
                break;
              case 3: // ENTRADA INTERVALO
                this.btnToggle(BTN_ENTRADA_ID, true);
                this.btnToggle(BTN_SAIDA_ID, false);
                logView = this.getLogEntradaIntervaloView(value.timestamp);
                break;
              case 4: // SAÍDA
                this.btnToggle(BTN_ENTRADA_ID, true);
                this.btnToggle(BTN_SAIDA_ID, true);
                logView = this.getLogSaidaView(value.timestamp);
                break;
              default:
                throw 'Invalid log.type';
            };

            document.getElementById(LOG_VIEW_ID).innerHTML += logView;
        } catch(err) {
            alert('An exception has ben throw in InterfacePontos.setLogView: ' + err.message);
            console.log('An exception has ben throw in InterfacePontos.setLogView: ' + err.message);
        }
    },
    getLogEntradaView: function(value) {
        return LOG_TEMPLATE_HTML
          .replaceAll('{ID}', LOG_ENTRADA_ID)
          .replaceAll('{COLOR}', LOG_ENTRADA_COLOR)
          .replaceAll('{HOUR}', value)
          .replaceAll('{TYPE}', 'ENTRADA - 1')
          .replaceAll('{DETAILS}', 'SESSÃO DE ENTRADA VINCULADA AO CPF.')
    },
    getLogSaidaIntervaloView: function(value) {
        return LOG_TEMPLATE_HTML
          .replaceAll('{ID}', LOG_SAIDA_INTERVALO_ID)
          .replaceAll('{COLOR}', LOG_SAIDA_COLOR)
          .replaceAll('{HOUR}', value)
          .replaceAll('{TYPE}', 'SAÍDA INTERVALO - 2')
          .replaceAll('{DETAILS}', 'SESSÃO DE SAÍDA PARA O INTERVALO VINCULADA AO CPF.')
    },
    getLogEntradaIntervaloView: function(value) {
        return LOG_TEMPLATE_HTML
          .replaceAll('{ID}', LOG_ENTRADA_INTERVALO_ID)
          .replaceAll('{COLOR}', LOG_ENTRADA_COLOR)
          .replaceAll('{HOUR}', value)
          .replaceAll('{TYPE}', 'ENTRADA INTERVALO - 3')
          .replaceAll('{DETAILS}', 'SESSÃO DE ENTRADA DO INTEVALO VINCULADA AO CPF.')
    },
    getLogSaidaView: function(value) {
        return LOG_TEMPLATE_HTML
          .replaceAll('{ID}', LOG_SAIDA_ID)
          .replaceAll('{COLOR}', LOG_SAIDA_COLOR)
          .replaceAll('{HOUR}', value)
          .replaceAll('{TYPE}', 'SAÍDA - 4')
          .replaceAll('{DETAILS}', 'SESSÃO DE ENTRADA VINCULADA AO CPF.')
    },
    getLogView: function() {
        try {
            return new Date(document.getElementById(DATA_ATUAL_VIEW_ID).innerText).toLocaleDataString('pt-BR', TO_LOCALE_DATA_STRING_OPTIONS);
        } catch(err){
            console.log('An exception has ben throw in InterfacePontos.getDataAtualView: ' + err.message);
        }
    },
    setUsernameView: function(value) {
        try {
            document.getElementById(USERNAME_VIEW_ID).textContent = value;
        } catch(err) {
            console.log('An exception has ben throw in InterfacePontos.setUsernameView: ' + err.message);
        }
    },
    setDocumentView: function(value) {
        try {
            document.getElementById(DOCUMENT_VIEW_ID).textContent = value;
        } catch(err) {
            console.log('An exception has ben throw in InterfacePontos.setDocumentView: ' + err.message);
        }
    },
    setDocumentTypeView: function(value) {
        try {
            document.getElementById(DOCUMENT_TYPE_VIEW_ID).textContent = value;
        } catch(err) {
            console.log('An exception has ben throw in InterfacePontos.setDocumentTypeView: ' + err.message);
        }
    },
    userStateHasChange: function() {
        const user = ServiceStorage.get('SRP-MOCKUP-AUTHENTICATION');
        if(user === null || user === undefined) {
            return;
        }

        this.setUsernameView(user.username);
        this.setDocumentView(user.document);
        this.setDocumentTypeView(user.document_type);
    }
};

const InterfaceLogin = {
    formLoginView: document.getElementById(FORM_LOGIN_VIEW_ID),
    usernameView: document.getElementById(USERNAME_ID),
    passwordView: document.getElementById(PASSWORD_ID),
    initialize: function() {
        this.formLoginView.addEventListener('submit', (e) => this.formLoginViewOnSubmit(e));
    },
    formLoginViewOnSubmit: async function(e) {
        e.preventDefault();

        const authenticateState = await ServiceAuthentication.authenticate(
            this.usernameView.value,
            this.passwordView.value,
            (data) => {
                if(data === null) {
                    alert('Usuário ou senha incorretos.');
                    return;
                }
            
                AppPages.activate('ponto');
            }
        );
    }
};

const AppPages = {
    pageLogin: document.getElementById(PAGE_LOGIN_ID),
    pagePonto: document.getElementById(PAGE_PONTO_ID),
    activate: function(page) {
        this.pageLogin.classList.remove('ativa');
        this.pagePonto.classList.remove('ativa');
        switch(page){
          case 'login':
            this.pageLogin.classList.add('ativa');
            InterfaceLogin.initialize();
            break;
          case 'ponto':
            this.pagePonto.classList.add('ativa');
            InterfacePonto.initialize();
            break;
          default:
            throw 'Invalid page';
        };
    }
};

(async () => {
    try {
        const isAuthenticated = await ServiceAuthentication.self_authenticate();
        if (isAuthenticated) {
            AppPages.activate('ponto');
        } else {
            AppPages.activate('login');
        }
    } catch (err) {
        alert('Erro no fluxo principal: ' + err.message);
        console.error('Erro na inicialização: ', err.message);
    }
})();
