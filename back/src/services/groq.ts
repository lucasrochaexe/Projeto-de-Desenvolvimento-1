import Groq, { toFile } from "groq-sdk"

const MODELO = "whisper-large-v3"
const IDIOMA = "pt"

const cliente = new Groq() // lê GROQ_API_KEY do ambiente

// A Groq identifica o formato pela extensão do nome do arquivo
function prepararArquivo(audio: Express.Multer.File) {
    return toFile(audio.buffer, audio.originalname || "audio.m4a", {
        type: audio.mimetype
    })
}

export async function transcreverAudio(audio: Express.Multer.File): Promise<string> {
    const transcricao = await cliente.audio.transcriptions.create({
        file: await prepararArquivo(audio),
        model: MODELO,
        language: IDIOMA,
        temperature: 0
    })
    return transcricao.text.trim()
}