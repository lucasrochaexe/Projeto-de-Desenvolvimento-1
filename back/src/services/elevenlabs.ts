import WebSocket from "ws"

const API_URL = process.env.ELEVENLABS_API_URL || "https://api.elevenlabs.io"
const AGENT_ID = process.env.ELEVENLABS_AGENT_ID as string
const API_KEY = process.env.ELEVENLABS_API_KEY as string

const TEMPO_RESPOSTA_MS = 30_000
const TEMPO_OCIOSO_MS = 10 * 60_000

type Sessao = { ws: WebSocket; timerOcioso: NodeJS.Timeout }
const sessoes = new Map<string, Sessao>()

async function obterUrlAssinada(): Promise<string> {
    const resposta = await fetch(
        `${API_URL}/v1/convai/conversation/get-signed-url?agent_id=${AGENT_ID}`,
        { headers: { "xi-api-key": API_KEY } }
    )
    if (!resposta.ok) {
        throw new Error(`Falha ao obter URL assinada do ElevenLabs (${resposta.status}): ${await resposta.text()}`)
    }
    const { signed_url } = await resposta.json()
    return signed_url
}

function enviarEvento(ws: WebSocket, evento: object) {
    ws.send(JSON.stringify(evento))
}

function lerEvento(dados: WebSocket.RawData) {
    return JSON.parse(dados.toString())
}

function formatarDataAtual(): string {
    return new Date().toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    })
}

function montarInicializacao() {
    return {
        type: "conversation_initiation_client_data",
        conversation_config_override: { conversation: { text_only: true } },
        dynamic_variables: { data_atual: formatarDataAtual() }
    }
}

function responderPing(ws: WebSocket) {
    ws.on("message", (dados) => {
        const evento = lerEvento(dados)
        if (evento.type === "ping") {
            enviarEvento(ws, { type: "pong", event_id: evento.ping_event.event_id })
        }
    })
}

function abrirConexao(url: string): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(url)

        ws.once("error", reject)
        ws.on("message", function aguardarInicio(dados) {
            if (lerEvento(dados).type !== "conversation_initiation_metadata") return
            ws.off("message", aguardarInicio)
            resolve(ws)
        })
        ws.once("open", () => enviarEvento(ws, montarInicializacao()))
    })
}

function aguardarResposta(ws: WebSocket): Promise<string> {
    return new Promise((resolve, reject) => {
        const limite = setTimeout(() => {
            ws.off("message", ouvir)
            reject(new Error("O agente demorou para responder"))
        }, TEMPO_RESPOSTA_MS)

        function ouvir(dados: WebSocket.RawData) {
            const evento = lerEvento(dados)
            if (evento.type !== "agent_response") return
            clearTimeout(limite)
            ws.off("message", ouvir)
            resolve(evento.agent_response_event.agent_response)
        }

        ws.on("message", ouvir)
    })
}

export function encerrarSessao(usuarioId: string) {
    const sessao = sessoes.get(usuarioId)
    if (!sessao) return
    clearTimeout(sessao.timerOcioso)
    sessao.ws.close()
    sessoes.delete(usuarioId)
}

function agendarEncerramento(usuarioId: string): NodeJS.Timeout {
    return setTimeout(() => encerrarSessao(usuarioId), TEMPO_OCIOSO_MS)
}

async function criarSessao(usuarioId: string): Promise<Sessao> {
    const ws = await abrirConexao(await obterUrlAssinada())
    responderPing(ws)
    ws.on("close", () => sessoes.delete(usuarioId))

    const sessao = { ws, timerOcioso: agendarEncerramento(usuarioId) }
    sessoes.set(usuarioId, sessao)
    return sessao
}

async function obterSessao(usuarioId: string): Promise<Sessao> {
    const existente = sessoes.get(usuarioId)
    if (!existente) return criarSessao(usuarioId)

    clearTimeout(existente.timerOcioso)
    existente.timerOcioso = agendarEncerramento(usuarioId)
    return existente
}

export async function conversarComAgente(usuarioId: string, texto: string): Promise<string> {
    const { ws } = await obterSessao(usuarioId)
    const resposta = aguardarResposta(ws) // ouvir ANTES de enviar
    enviarEvento(ws, { type: "user_message", text: texto })
    return resposta
}

export function extrairTarefa(resposta: string): Record<string, unknown> | null {
    const limpo = resposta.replace(/```json|```/g, "").trim()
    if (!limpo.startsWith("{")) return null
    try {
        const json = JSON.parse(limpo)
        return json.titulo ? json : null
    } catch {
        return null
    }
}