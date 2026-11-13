import pino from "pino";
import { prisma } from "../../lib/prisma";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
});

export type ErrorLog = {
  usuarioId?: string;
  usuarioNome?: string;
  erro: string;
  onde: string;
  sessao?: string;
  stack?: string;
  rota?: string;
  metodo?: string;
};

export async function registrarErro(dados: ErrorLog) {
  logger.error(dados);

  try {
    let usuarioNome = dados.usuarioNome;

    if (dados.usuarioId && !usuarioNome) {
      const usuario = await prisma.usuario.findUnique({
        where: { id: dados.usuarioId },
        select: { nome: true },
      });
      usuarioNome = usuario?.nome;
    }

    await prisma.log.create({
      data: {
        usuarioId: dados.usuarioId,
        usuarioNome,
        erro: dados.erro,
        onde: dados.onde,
        sessao: dados.sessao,
        stack: dados.stack,
        rota: dados.rota,
        metodo: dados.metodo,
      },
    });
  } catch (erroBanco) {
    logger.error(
      { erroBanco },
      "Erro ao registrar erro no banco de dados",
    );
  }
}