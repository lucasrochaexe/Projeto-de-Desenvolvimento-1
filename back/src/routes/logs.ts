import { Router, Response } from "express";
import { prisma } from "../../lib/prisma";
import { registrarErro } from "../services/logger";
import { verificaAdmin, verificaToken, TokenInterface } from "./verificaToken";

const router = Router();

router.use(verificaToken);

router.post("/client", async (req: TokenInterface, res: Response) => {
  const { erro, onde, stack } = req.body;

  if (
    typeof erro !== "string" ||
    typeof onde !== "string" ||
    !erro.trim() ||
    !onde.trim()
  ) {
    res.status(400).json({ erro: "Mensagem e local do erro são obrigatórios." });
    return;
  }

  await registrarErro({
    usuarioId: req.usuarioId,
    erro: erro.trim(),
    onde: onde.trim(),
    stack: typeof stack === "string" ? stack : undefined,
    sessao: String(req.id),
    rota: req.originalUrl,
    metodo: req.method,
  });

  res.status(201).json({ mensagem: "Erro registrado com sucesso." });
});

router.get("/", verificaAdmin, async (_req: TokenInterface, res: Response) => {
  try {
    const logs = await prisma.log.findMany({
      orderBy: { criadoEm: "desc" },
      include: {
        usuario: {
          select: { id: true, nome: true, email: true },
        },
      },
    });

    res.status(200).json(logs);
  } catch (error) {
    await registrarErro({
      erro: error instanceof Error ? error.message : String(error),
      onde: "consulta do histórico de erros",
      stack: error instanceof Error ? error.stack : undefined,
      rota: "/logs",
      metodo: "GET",
    });
    res.status(500).json({ erro: "Erro ao buscar histórico de erros." });
  }
});

export default router;
