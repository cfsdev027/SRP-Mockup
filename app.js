// Configurações do Supabase (Pode deixar exposto no GitHub Pages sem problemas se o RLS estiver ativo)
const SUPABASE_URL = "https://sdakvoeythnbfqfgupzf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkYWt2b2V5dGhuYmZxZmd1cHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMDA1MjksImV4cCI6MjA5MzY3NjUyOX0.U13KCcwWUTStp1-k8at9CudflI66uJ8YhMzSErQAlrM";

// Inicializa o cliente global do Supabase
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
        
        // Aqui você pode expandir depois para validar se o token/username guardado é válido
        if (cookieSessao) {
            document.getElementById('tela-ponto').classList.add('ativa');
        } else {
            document.getElementById('tela-login').classList.add('ativa');
        }
    },
    
    login: async function(usuario, senha) {
        try {
            // Consulta o Supabase procurando pelo username, se ele está ativo e se a senha bate
            const { data, error } = await supabaseClient
                .from('users')
                .select('username, ativo')
                .eq('username', usuario)
                .eq('password', senha) // Verificação simples de texto puro para o mockup
                .eq('ativo', true)
                .maybeSingle(); // Retorna um objeto único ou null (evita erro se não achar nada)

            if (error) throw error;

            // Se encontrou o usuário com essas credenciais
            if (data) {
                // Guarda o username no cookie por 1 dia para manter a sessão
                CookieHelper.set(NOME_COOKIE, data.username, 1);
                
                // Limpa mensagens de erro e atualiza a tela
                document.getElementById('alerta-erro').classList.replace('d-flex', 'd-none');
                this.validarSessao();
                return true;
            } else {
                // Usuário ou senha incorretos (ou usuário inativo)
                document.getElementById('alerta-erro').classList.replace('d-none', 'd-flex');
                return false;
            }

        } catch (err) {
            console.error("Erro na autenticação:", err.message);
            alert("Ocorreu um erro ao tentar conectar ao servidor de autenticação.");
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
        placeholder.remove();
    }
    
    if (tipo === 'ENTRADA') {
        const btnEntrada = document.getElementById('btn-entrada');
        btnEntrada.disabled = true;
        btnEntrada.style.background = "#f8fafc";
        btnEntrada.style.color = "#64748b";
        btnEntrada.style.border = "1px solid #e2e8f0";
        
        const btnSaida = document.getElementById('btn-saida');
        btnSaida.disabled = false;
        btnSaida.style.background = "#ef4444";
        btnSaida.style.color = "#ffffff";
        btnSaida.style.border = "none";
        
        // Mantendo a estrutura de classes que você usou no HTML original para ficar bonito no CSS
        log.innerHTML += `
            <div class="log-item">
                <div class="log-header-line">
                    <span class="log-time">[${hora}]</span>
                    <span class="log-status status-entry">ENTRADA CONFIRMADA</span>
                </div>
                <div class="log-details">Trilha: IP 177.42.11.89 | Sessão vinculada ao CPF</div>
            </div>`;
    } else {
        const btnSaida = document.getElementById('btn-saida');
        btnSaida.disabled = true;
        btnSaida.style.background = "#f8fafc";
        btnSaida.style.color = "#64748b";
        btnSaida.style.border = "1px solid #e2e8f0";
        
        log.innerHTML += `
            <div class="log-item">
                <div class="log-header-line">
                    <span class="log-time">[${hora}]</span>
                    <span class="log-status status-exit">SAÍDA CONFIRMADA</span>
                </div>
                <div class="log-details">Trilha: Log de Auditoria fechado e selado no servidor</div>
            </div>`;
    }
};

document.addEventListener("DOMContentLoaded", () => {
    ServicoAutenticacao.validarSessao();

    // Transformamos a função do evento em ASYNC
    document.getElementById('form-login').addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = document.getElementById('usuario').value;
        const pass = document.getElementById('senha').value;
        
        // Adicionamos o AWAY para esperar a resposta do Supabase
        await ServicoAutenticacao.login(user, pass);
    });

    setInterval(() => {
        const relogio = document.getElementById('relogio');
        if(relogio) relogio.innerText = new Date().toLocaleTimeString('pt-BR');
    }, 1000);
    
    const opcoes = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dataAtual = document.getElementById('data-atual');
    if(dataAtual) dataAtual.innerText = new Date().toLocaleDateString('pt-BR', opcoes);
});
