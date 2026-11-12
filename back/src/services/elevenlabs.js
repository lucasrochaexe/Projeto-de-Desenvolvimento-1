import WebSocket from "ws";
const API_URL = process.env.ELEVENLABS_API_URL || "https://api.elevenlabs.io";
const AGENT_ID = process.env.ELEVENLABS_AGENT_ID;
const API_KEY = process.env.ELEVENLABS_API_KEY;
const TEMPO_RESPOSTA_MS = 30_000;
const TEMPO_OCIOSO_MS = 10 * 60_000;
const sessoes = new Map();
async function obterUrlAssinada() {
    const resposta = await fetch(`${API_URL}/v1/convai/conversation/get-signed-url?agent_id=${AGENT_ID}`, { headers: { "xi-api-key": API_KEY } });
    if (!resposta.ok) {
        throw new Error(`Falha ao obter URL assinada do ElevenLabs (${resposta.status}): ${await resposta.text()}`);
    }
    const { signed_url } = await resposta.json();
    return signed_url;
}
function enviarEvento(ws, evento) {
    ws.send(JSON.stringify(evento));
}
function lerEvento(dados) {
    return JSON.parse(dados.toString());
}
function formatarDataAtual() {
    return new Date().toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}
function montarInicializacao() {
    return {
        type: "conversation_initiation_client_data",
        conversation_config_override: { conversation: { text_only: true } },
        dynamic_variables: { data_atual: formatarDataAtual() }
    };
}
function responderPing(ws) {
    ws.on("message", (dados) => {
        const evento = lerEvento(dados);
        if (evento.type === "ping") {
            enviarEvento(ws, { type: "pong", event_id: evento.ping_event.event_id });
        }
    });
}
function abrirConexao(url) {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(url);
        ws.once("error", reject);
        ws.on("message", function aguardarInicio(dados) {
            if (lerEvento(dados).type !== "conversation_initiation_metadata")
                return;
            ws.off("message", aguardarInicio);
            resolve(ws);
        });
        ws.once("open", () => enviarEvento(ws, montarInicializacao()));
    });
}
function aguardarResposta(ws) {
    return new Promise((resolve, reject) => {
        const limite = setTimeout(() => {
            ws.off("message", ouvir);
            reject(new Error("O agente demorou para responder"));
        }, TEMPO_RESPOSTA_MS);
        function ouvir(dados) {
            const evento = lerEvento(dados);
            if (evento.type !== "agent_response")
                return;
            clearTimeout(limite);
            ws.off("message", ouvir);
            resolve(evento.agent_response_event.agent_response);
        }
        ws.on("message", ouvir);
    });
}
export function encerrarSessao(usuarioId) {
    const sessao = sessoes.get(usuarioId);
    if (!sessao)
        return;
    clearTimeout(sessao.timerOcioso);
    sessao.ws.close();
    sessoes.delete(usuarioId);
}
function agendarEncerramento(usuarioId) {
    return setTimeout(() => encerrarSessao(usuarioId), TEMPO_OCIOSO_MS);
}
async function criarSessao(usuarioId) {
    const ws = await abrirConexao(await obterUrlAssinada());
    responderPing(ws);
    ws.on("close", () => sessoes.delete(usuarioId));
    const sessao = { ws, timerOcioso: agendarEncerramento(usuarioId) };
    sessoes.set(usuarioId, sessao);
    return sessao;
}
async function obterSessao(usuarioId) {
    const existente = sessoes.get(usuarioId);
    if (!existente)
        return criarSessao(usuarioId);
    clearTimeout(existente.timerOcioso);
    existente.timerOcioso = agendarEncerramento(usuarioId);
    return existente;
}
export async function conversarComAgente(usuarioId, texto) {
    const { ws } = await obterSessao(usuarioId);
    const resposta = aguardarResposta(ws); // ouvir ANTES de enviar
    enviarEvento(ws, { type: "user_message", text: texto });
    return resposta;
}
export function extrairTarefa(resposta) {
    const limpo = resposta.replace(/```json|```/g, "").trim();
    if (!limpo.startsWith("{"))
        return null;
    try {
        const json = JSON.parse(limpo);
        if (json.titulo)
            return json;
        return json.tarefa?.titulo ? json.tarefa : null;
    }
    catch {
        return null;
    }
}
export function extrairMensagem(resposta) {
    const limpo = resposta.replace(/```json|```/g, "").trim();
    if (!limpo.startsWith("{"))
        return null;
    try {
        const json = JSON.parse(limpo);
        const mensagem = json.mensagem || json.texto;
        return typeof mensagem === "string" ? mensagem : null;
    }
    catch {
        return null;
    }
}
