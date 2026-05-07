import ServiceSupabase from './service_supabase.js';

export const ServiceAuthentication = {
  authenticate: async function(username,password) {
        try {
            const client = ServiceSupabase.client();
            
            const { data, error } = await client
                .from('users')
                .select('*')
                .eq('username', username)
                .eq('password', password)
                .eq('ativo', true)
                .maybeSingle();

            if (error) throw error;

            return data;

        } catch (err) {
            console.error("Erro na autenticação:", err.message);
            alert("Ocorreu um erro ao tentar conectar ao servidor de autenticação (authenticate).");
            return null;
        }
    },
    self_authenticate: async function(id){
        try {
            const client = ServiceSupabase.client();
          
            const { data, error } = await client
                .from('users')
                .select('*')
                .eq('id', id)
                .eq('ativo', true)
                .maybeSingle();

            if (error) throw error;

            return data;

        } catch (err) {
            console.error("Erro na recuperação:", err.message);
            alert("Ocorreu um erro ao tentar conectar ao servidor de autenticação (self-authenticate).");
            return null;
        }
    }
};
