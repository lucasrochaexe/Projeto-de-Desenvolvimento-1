from fastapi import FastAPI, UploadFile, File
from faster_whisper import WhisperModel

app = FastAPI()
modelo = WhisperModel("small", device="cpu", compute_type="int8")

def transcrever_arquivo(arquivo) -> str:
    segmentos, _ = modelo.transcribe(
        arquivo, language="pt", vad_filter=True, beam_size=5
    )
    return " ".join(s.text.strip() for s in segmentos)

@app.post("/transcrever")
def transcrever(arquivo: UploadFile = File(...)):
    return {"texto": transcrever_arquivo(arquivo.file)}