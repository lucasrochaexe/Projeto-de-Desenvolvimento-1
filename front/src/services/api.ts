const API_URL =
    process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

type ApiOptions = RequestInit & {
    token?: string;
};

export async function apiRequest(
    path: string,
    options: ApiOptions = {}
) {
    const { token, headers, ...requestOptions } = options;

        const response = await fetch(`${API_URL}${path}`, {
        ...requestOptions,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
    throw new Error(data.erro || 'Erro na comunicação com o servidor');
    }

    return data;
}

export async function fazerLogin(email: string, senha: string) {
    return apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha }),
    });
}

export async function cadastrarUsuario(
    nome: string,
    email: string,
    senha: string
) {
    return apiRequest('/usuarios', {
        method: 'POST',
        body: JSON.stringify({ nome, email, senha }),
    });
}

export async function buscarTarefas(token: string) {
    return apiRequest('/tarefas', {
        method: 'GET',
        token,
    });
}

export async function criarTarefa(
    token: string,
    tarefa: {
        titulo: string;
        descricao?: string | null;
        prioridade?: 'ALTA' | 'MEDIA' | 'BAIXA';
        status?: 'EM_ANDAMENTO' | 'CONCLUIDA' | 'EM_ATRASO';
        prazoInic?: string | null;
        prazoFim?: string | null;
        dicas?: string | null;
    }
) {
    return apiRequest('/tarefas', {
        method: 'POST',
        token,
        body: JSON.stringify(tarefa),
    });
}