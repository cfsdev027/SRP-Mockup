const NOME_COOKIE = "SRP-Mockup-Autentication";

const CookieHelper = {
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

const ServicoAutenticacao = {
    validarSessao: function() {
        const cookieSessao = CookieHelper.get(NOME_COOKIE);
        
        document.getElementById('tela-login').classList.remove('ativa');
        document.getElementById('tela-ponto').classList.remove('ativa');
        
        if (cookieSessao === "token_autenticado_operador") {
            document.getElementById('tela-ponto').classList.add('ativa');
        } else {
            document.getElementById('tela-login').classList.add('ativa');
        }
    },
    login: function(usuario, senha) {
        if (usuario === "operador" && senha === "123mudar") {
            CookieHelper.set(NOME_COOKIE, "token_autenticado_operador", 1);
            document.getElementById('alerta-erro').classList.replace('d-flex', 'd-none');
            this.validarSessao();
            return true;
        } else {
            document.getElementById('alerta-erro').classList.replace('d-none', 'd-flex');
            return false;
        }
    },
    logout: function() {
        CookieHelper.erase(NOME_COOKIE);
        this.validarSessao();
    }
};

function registrarPonto(tipo) {
    const hora = new Date().toLocaleTimeString('pt-BR');
    const log = document.getElementById('console-ponto');
    
    log.classList.remove('justify-content-center');
    
    if (tipo === 'ENTRADA') {
        document.getElementById('btn-entrada').disabled = true;
        document.getElementById('btn-entrada').className = "btn btn-secondary w-100 py-3 fw-bold rounded-3 d-flex flex-column align-items-center gap-1";
        
        document.getElementById('btn-saida').disabled = false;
        document.getElementById('btn-saida').className = "btn btn-danger w-100 py-3 fw-bold rounded-3 d-flex flex-column align-items-center gap-1 shadow-sm";
        
        log.innerHTML = `<div><span class="text-success fw-bold">⚡ [${hora}] ENTRADA CONFIRMADA</span><br><span style="font-size: 10px; color: #6b7280;">Trilha: IP 177.42.11.89 | Sessão vinculada ao CPF</span></div>`;
    } else {
        document.getElementById('btn-saida').disabled = true;
        document.getElementById('btn-saida').className = "btn btn-secondary w-100 py-3 fw-bold rounded-3 d-flex flex-column align-items-center gap-1";
        
        log.innerHTML += `<div class="mt-2"><span class="text-warning fw-bold">⚡ [${hora}] SAÍDA CONFIRMADA</span><br><span style="font-size: 10px; color: #6b7280;">Trilha: Log de Auditoria fechado e selado no servidor</span></div>`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    ServicoAutenticacao.validarSessao();

    document.getElementById('form-login').addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('usuario').value;
        const pass = document.getElementById('senha').value;
        ServicoAutenticacao.login(user, pass);
    });

    setInterval(() => {
        const relogio = document.getElementById('relogio');
        if(relogio) relogio.innerText = new Date().toLocaleTimeString('pt-BR');
    }, 1000);
    
    const opcoes = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dataAtual = document.getElementById('data-atual');
    if(dataAtual) dataAtual.innerText = new Date().toLocaleDateString('pt-BR', opcoes);
});
  
