import * as FileSystem from "expo-file-system/legacy";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

type ApiOptions = RequestInit & {
  token?: string;
};

export async function apiRequest(path: string, options: ApiOptions = {}) {
  const { token, headers, ...requestOptions } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro || "Erro na comunicação com o servidor");
  }

  return data;
}

export async function fazerLogin(email: string, senha: string) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });
}

export async function cadastrarUsuario(
  nome: string,
  email: string,
  senha: string,
) {
  return apiRequest("/usuarios", {
    method: "POST",
    body: JSON.stringify({ nome, email, senha }),
  });
}

export async function buscarTarefas(token: string) {
  return apiRequest("/tarefas", { method: "GET", token });
}

export async function criarTarefa(
  token: string,
  tarefa: {
    titulo: string;
    descricao?: string | null;
    prioridade?: "ALTA" | "MEDIA" | "BAIXA";
    status?: "EM_ANDAMENTO" | "CONCLUIDA" | "EM_ATRASO";
    prazoInic?: string | null;
    prazoFim?: string | null;
    dicas?: string | null;
  },
) {
  return apiRequest("/tarefas", {
    method: "POST",
    token,
    body: JSON.stringify(tarefa),
  });
}

export async function buscarTarefasArquivadas(token: string) {
  return apiRequest("/tarefas/arquivo", { method: "GET", token });
}

export async function buscarTarefasExcluidas(token: string) {
  return apiRequest("/tarefas/lixeira", { method: "GET", token });
}

export async function arquivarTarefa(token: string, id: string) {
  return apiRequest(`/tarefas/${id}/arquivar`, { method: "PATCH", token });
}

export async function excluirTarefa(token: string, id: string) {
  return apiRequest(`/tarefas/${id}`, { method: "DELETE", token });
}

export async function restaurarTarefa(token: string, id: string) {
  return apiRequest(`/tarefas/${id}/restaurar`, { method: "PATCH", token });
}
export async function atualizarTarefa(
  token: string,
  id: string,
  tarefa: {
    titulo?: string;
    descricao?: string | null;
    prioridade?: "ALTA" | "MEDIA" | "BAIXA";
    prazoInic?: string | null;
    prazoFim?: string | null;
    status?: "EM_ANDAMENTO" | "CONCLUIDA" | "EM_ATRASO";
  },
) {
  return apiRequest(`/tarefas/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(tarefa),
  });
}

// JSON que o agente Dexter devolve depois que a pessoa confirma a tarefa.
export type TarefaDoAgente = {
  titulo: string;
  descricao?: string | null;
  prazo?: { data: string | null; hora: string | null } | null;
  prioridade?: { nivel: string; motivo?: string } | null;
  dicas?: { titulo: string; descricao: string }[] | null;
};

// Resposta das rotas /agent-chat/mensagem e /agent-chat/audio.
// "transcricao" só vem na rota de áudio.
export type RespostaAgente =
  | { tipo: "mensagem"; texto: string; transcricao?: string }
  | { tipo: "tarefa"; tarefa: TarefaDoAgente; transcricao?: string };

export async function enviarMensagemAoAgente(
  token: string,
  texto: string,
): Promise<RespostaAgente> {
  return apiRequest("/agent-chat/mensagem", {
    method: "POST",
    token,
    body: JSON.stringify({ texto }),
  });
}

export async function enviarAudioAoAgente(
  token: string,
  uri: string,
): Promise<RespostaAgente> {
  const resposta = await FileSystem.uploadAsync(
    `${API_URL}/agent-chat/audio`,
    uri,
    {
      httpMethod: "POST",
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: "audio",
      mimeType: "audio/m4a",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  const data = JSON.parse(resposta.body);

  if (resposta.status < 200 || resposta.status >= 300) {
    throw new Error(data.erro || "Erro ao enviar o áudio ao Dexter");
  }

  return data as RespostaAgente;
}

export async function reiniciarConversaComAgente(token: string) {
  return apiRequest("/agent-chat/sessao", {
    method: "DELETE",
    token,
  });
}

function prazoDoAgenteParaISO(prazo: TarefaDoAgente["prazo"]): string | null {
  if (!prazo?.data) {
    return null;
  }

  const [ano, mes, dia] = prazo.data.split("-").map(Number);
  // Sem hora informada, o prazo vale até o fim do dia: o back marca a
  // tarefa como atrasada assim que prazoFim passa.
  const [hora, minuto] = prazo.hora
    ? prazo.hora.split(":").map(Number)
    : [23, 59];
  const data = new Date(ano, mes - 1, dia, hora, minuto);

  return Number.isNaN(data.getTime()) ? null : data.toISOString();
}

// Converte o JSON do agente para o formato de tarefa do app e salva
// (no celular ou no back, conforme TAREFAS_NO_CELULAR).
export async function salvarTarefaDoAgente(
  token: string,
  tarefa: TarefaDoAgente,
) {
  const nivel = tarefa.prioridade?.nivel;

  return criarTarefa(token, {
    titulo: tarefa.titulo,
    descricao: tarefa.descricao ?? null,
    prioridade: nivel === "ALTA" || nivel === "BAIXA" ? nivel : "MEDIA",
    status: "EM_ANDAMENTO",
    prazoInic: null,
    prazoFim: prazoDoAgenteParaISO(tarefa.prazo),
    dicas: tarefa.dicas?.length
      ? tarefa.dicas
          .map((dica) => `${dica.titulo}: ${dica.descricao}`)
          .join("\n")
      : null,
  });
}

export async function buscarNotificacoes(token: string) {
  return apiRequest("/notificacoes", {
    method: "GET",
    token,
  });
}

export async function marcarNotificacaoComoVisualizada(
  token: string,
  id: string,
) {
  return apiRequest(`/notificacoes/${id}/visualizada`, {
    method: "PATCH",
    token,
  });
}

export async function limparNotificacoes(token: string) {
  return apiRequest("/notificacoes", {
    method: "DELETE",
    token,
  });
}
