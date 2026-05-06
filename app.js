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

function efetuarLogout() {     
        // 1. Apaga o cookie definindo uma data de expiração no passado e limpando o caminho (path)
        document.cookie = NOME_COOKIE + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        // 2. Redireciona o usuário de volta para a tela inicial/login
        window.location.href = 'index.html';
};

function registrarPonto(tipo) {
    const hora = new Date().toLocaleTimeString('pt-BR');
    const log = document.getElementById('console-ponto');
    const placeholder = document.getElementById('placeholder-log');
    
    // Remove o placeholder na primeira interação
    if (placeholder) {
        log.innerHTML = '';
    }
    
    if (tipo === 'ENTRADA') {
        // Altera o estado do botão Entrada para desabilitado corporativo
        const btnEntrada = document.getElementById('btn-entrada');
        btnEntrada.disabled = true;
        btnEntrada.style.background = "#f8fafc";
        btnEntrada.style.color = "#64748b";
        btnEntrada.style.border = "1px solid #e2e8f0";
        
        // Ativa o botão Saída com destaque vermelho discreto
        const btnSaida = document.getElementById('btn-saida');
        btnSaida.disabled = false;
        btnSaida.style.background = "#ef4444";
        btnSaida.style.color = "#ffffff";
        btnSaida.style.border = "none";
        
        log.innerHTML += `
            <div style="border-left: 2px solid #10b981; padding-left: 8px; line-height: 1.4;">
                <div style="margin-bottom: 2px;">
                    <span style="color: #64748b; font-weight: bold;">[${hora}]</span>
                    <span style="color: #10b981; font-weight: bold;">ENTRADA CONFIRMADA</span>
                </div>
                <div style="color: #94a3b8; font-size: 0.75rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    Trilha: IP 177.42.11.89 | Sessão vinculada ao CPF
                </div>
            </div>`;
    } else {
        const btnSaida = document.getElementById('btn-saida');
        btnSaida.disabled = true;
        btnSaida.style.background = "#f8fafc";
        btnSaida.style.color = "#64748b";
        btnSaida.style.border = "1px solid #e2e8f0";
        
        log.innerHTML += `
            <div style="border-left: 2px solid #f59e0b; padding-left: 8px; line-height: 1.4;">
                <div style="margin-bottom: 2px;">
                    <span style="color: #64748b; font-weight: bold;">[${hora}]</span>
                    <span style="color: #f59e0b; font-weight: bold;">SAÍDA CONFIRMADA</span>
                </div>
                <div style="color: #94a3b8; font-size: 0.75rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    Trilha: Log de Auditoria fechado e selado no servidor
                </div>
            </div>`;
    }
};

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
