import { Router, Response } from "express"
import multer from "multer"
import { TokenInterface } from "../verificaToken"
import { conversarComAgente, encerrarSessao, extrairTarefa } from "../../services/elevenlabs"

const router = Router()
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }
})

async function transcreverAudio(audio: Express.Multer.File): Promise<string> {
    const form = new FormData()
    const audioBuffer = new ArrayBuffer(audio.buffer.byteLength)
    new Uint8Array(audioBuffer).set(audio.buffer)
    form.append("arquivo", new Blob([audioBuffer], { type: audio.mimetype }), audio.originalname)

    const resposta = await fetch(`${process.env.TRANSCRITOR_URL}/transcrever`, {
        method: "POST",
        body: form
    })
    if (!resposta.ok) throw new Error("Falha na transcrição")

    const { texto } = await resposta.json()
    return texto
}

async function processarTexto(usuarioId: string, texto: string) {
    const resposta = await conversarComAgente(usuarioId, texto)
    const tarefa = extrairTarefa(resposta)

    if (tarefa) {
        encerrarSessao(usuarioId)
        return { tipo: "tarefa", tarefa }
    }
    return { tipo: "mensagem", texto: resposta }
}

router.post("/mensagem", async (req: TokenInterface, res: Response) => {
    const texto = String(req.body?.texto || "").trim()
    if (!texto) {
        res.status(400).json({ erro: "Texto não enviado." })
        return
    }
    try {
        res.status(200).json(await processarTexto(req.usuarioId as string, texto))
    } catch (erro) {
        console.error("Erro no agente (mensagem):", erro)
        res.status(500).json({ erro: "Erro ao falar com o agente." })
    }
})

router.post("/audio", upload.single("audio"), async (req: TokenInterface, res: Response) => {
    if (!req.file) {
        res.status(400).json({ erro: "Áudio não enviado." })
        return
    }
    try {
        const texto = (await transcreverAudio(req.file)).trim()
        if (!texto) {
            res.status(400).json({ erro: "Não consegui ouvir nada no áudio. Tente de novo." })
            return
        }
        const resultado = await processarTexto(req.usuarioId as string, texto)
        res.status(200).json({ transcricao: texto, ...resultado })
    } catch (erro) {
        console.error("Erro no agente (áudio):", erro)
        res.status(500).json({ erro: "Erro ao processar o áudio." })
    }
})

router.delete("/sessao", (req: TokenInterface, res: Response) => {
    encerrarSessao(req.usuarioId as string)
    res.status(200).json({ mensagem: "Conversa reiniciada." })
})

export default router