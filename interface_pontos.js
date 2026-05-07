import { ServiceStorage } from './service_storage.js';

const RELOGIO_VIEW_ID = 'relogio';
const DATA_ATUAL_VIEW_ID = 'data-atual';
const LOG_VIEW_ID = 'console-ponto';
const LOG_PLACEHOLDER_ID = 'placeholder-log';
const USERNAME_VIEW_ID = 'username-view';
const DOCUMENT_VIEW_ID = 'document-view';
const DOCUMENT_TYPE_VIEW_ID = 'document-type-view';
const TO_LOCALE_DATA_STRING_OPTIONS = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const LOG_TEMPLATE_HTML = `
            <div class="log-item">
                <div class="log-header-line">
                    <span class="log-time">[{HOUR}]</span>
                    <span class="log-status status-entry">{TYPE}</span>
                </div>
                <div class="log-details">{DETAILS}</div>
            </div>`;

export const InterfacePontos = {
    initialize: function() {
        try {
            const date = new Date().toLocaleTimeString('pt-BR');
            setRelogioView(date);
            setDataAtualView(date);
        } catch(err) {
            console.log('An exception has ben throw in InterfacePontos.initialize: ' + err.message);
        }
    },
    setRelogioView: function(value) {
        try {
            setInterval(() => {
                document.getElementById(RELOGIO_VIEW_ID).innerText = value; // new Date().toLocaleTimeString('pt-BR');
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
    btnToggle: function(id, disable) {
        const btn = document.getElementById(id);
        btn.disable = disable;
      
        if (disable) {
            btn.classList.add('disabled');
        } else {
            btn.classList.remove('disabled');
        }
    },
    setLogView: function(value) {
        try {
            var logView = null;
            switch(value.type) {
              case 1: // ENTRADA
                btnToggle('btn-entrada', true);
                btnToggle('btn-saida', false);
                logView = getLogEntradaView(value.timestamp);
                break;
              case 2: // SAÍDA INTERVALO
                btnToggle('btn-entrada', false);
                btnToggle('btn-saida', true);
                logView = getLogSaidaIntervaloView(value.timestamp);
                break;
              case 3: // ENTRADA INTERVALO
                btnToggle('btn-entrada', true);
                btnToggle('btn-saida', false);
                logView = getLogEntradaIntervaloView(value.timestamp);
                break;
              case 4: // SAÍDA
                btnToggle('btn-entrada', true);
                btnToggle('btn-saida', true);
                logView = getLogSaidaView(value.timestamp);
                break;
              default:
                throw 'Invalid log.type';
            };

            document.getElementById(LOG_VIEW_ID).innerHTML += logView;
        } catch(err) {
            console.log('An exception has ben throw in InterfacePontos.setLogView: ' + err.message);
        }
    },
    getLogEntradaView: function(value) {
        return LOG_TEMPLATE_HTML
          .replaceAll('{HOUR}', value)
          .replaceAll('{TYPE}', 'ENTRADA - 1')
          .replaceAll('{DETAIL}', 'SESSÃO DE ENTRADA VINCULADA AO CPF.'
    },
    getLogSaidaIntervaloView: function(value) {
        return LOG_TEMPLATE_HTML
          .replaceAll('{HOUR}', value)
          .replaceAll('{TYPE}', 'SAÍDA INTERVALO - 2')
          .replaceAll('{DETAIL}', 'SESSÃO DE SAÍDA PARA O INTERVALO VINCULADA AO CPF.'
    },
    getLogEntradaIntervaloView: function(value) {
        return LOG_TEMPLATE_HTML
          .replaceAll('{HOUR}', value)
          .replaceAll('{TYPE}', 'ENTRADA INTERVALO - 3')
          .replaceAll('{DETAIL}', 'SESSÃO DE ENTRADA DO INTEVALO VINCULADA AO CPF.'
    },
    getLogSaidaView: function(value) {
        return LOG_TEMPLATE_HTML
          .replaceAll('{HOUR}', value)
          .replaceAll('{TYPE}', 'SAÍDA - 4')
          .replaceAll('{DETAIL}', 'SESSÃO DE ENTRADA VINCULADA AO CPF.'
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

        setUsernameView(user.username);
        setDocumentView(user.document);
        setDocumentTypeView(user.document_type);
    }
}
