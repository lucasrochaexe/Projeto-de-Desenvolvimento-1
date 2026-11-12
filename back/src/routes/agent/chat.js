import { Router } from "express";
import multer from "multer";
import { conversarComAgente, encerrarSessao, extrairMensagem, extrairTarefa } from "../../services/elevenlabs";
import { transcreverAudio } from "../../services/groq";
const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }
});
async function processarTexto(usuarioId, texto) {
    const resposta = await conversarComAgente(usuarioId, texto);
    const tarefa = extrairTarefa(resposta);
    if (tarefa) {
        encerrarSessao(usuarioId);
        return {
            tipo: "tarefa",
            texto: extrairMensagem(resposta) || "Deseja confirmar esta tarefa?",
            tarefa
        };
    }
    return { tipo: "mensagem", texto: resposta };
}
router.post("/mensagem", async (req, res) => {
    const texto = String(req.body?.texto || "").trim();
    if (!texto) {
        res.status(400).json({ erro: "Texto não enviado." });
        return;
    }
    try {
        res.status(200).json(await processarTexto(req.usuarioId, texto));
    }
    catch (erro) {
        console.error("Erro no agente (mensagem):", erro);
        res.status(500).json({ erro: "Erro ao falar com o agente." });
    }
});
router.post("/audio", upload.single("audio"), async (req, res) => {
    if (!req.file) {
        res.status(400).json({ erro: "Áudio não enviado." });
        return;
    }
    try {
        const texto = (await transcreverAudio(req.file)).trim();
        if (!texto) {
            res.status(400).json({ erro: "Não consegui ouvir nada no áudio. Tente de novo." });
            return;
        }
        const resultado = await processarTexto(req.usuarioId, texto);
        res.status(200).json({ transcricao: texto, ...resultado });
    }
    catch (erro) {
        console.error("Erro no agente (áudio):", erro);
        res.status(500).json({ erro: "Erro ao processar o áudio." });
    }
});
router.delete("/sessao", (req, res) => {
    encerrarSessao(req.usuarioId);
    res.status(200).json({ mensagem: "Conversa reiniciada." });
});
export default router;
