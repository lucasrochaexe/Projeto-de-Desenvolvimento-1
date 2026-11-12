import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { verificaToken } from './verificaToken';
const router = Router();
router.use(verificaToken);
router.get("/", async (req, res) => {
    try {
        const notificacoes = await prisma.notificacao.findMany({
            where: {
                usuarioId: req.usuarioId,
                visualizada: false
            },
            include: {
                tarefa: {
                    select: {
                        id: true,
                        titulo: true,
                        descricao: true,
                        prazoInic: true,
                        prazoFim: true,
                        prioridade: true,
                        status: true
                    }
                }
            },
            orderBy: { data: 'desc' }
        });
        res.status(200).json(notificacoes);
    }
    catch (error) {
        res.status(500).json({ erro: "Erro ao buscar notificações." });
    }
});
router.delete("/", async (req, res) => {
    try {
        await prisma.notificacao.deleteMany({
            where: {
                usuarioId: req.usuarioId
            }
        });
        res.status(200).json({ mensagem: "Notificações limpas com sucesso." });
    }
    catch (error) {
        res.status(500).json({ erro: "Erro ao limpar notificações." });
    }
});
router.patch("/:id/visualizada", async (req, res) => {
    const { id } = req.params;
    try {
        const notificacao = await prisma.notificacao.updateMany({
            where: {
                id: String(id),
                usuarioId: req.usuarioId
            },
            data: {
                visualizada: true
            }
        });
        if (notificacao.count === 0) {
            res.status(404).json({ erro: "Notificação não encontrada ou acesso negado." });
            return;
        }
        res.status(200).json({ mensagem: "Notificação marcada como visualizada." });
    }
    catch (error) {
        res.status(500).json({ erro: "Erro ao marcar notificação como visualizada." });
    }
});
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const notificacao = await prisma.notificacao.deleteMany({
            where: {
                id: String(id),
                usuarioId: req.usuarioId
            }
        });
        if (notificacao.count === 0) {
            res.status(404).json({ erro: "Notificação não encontrada ou acesso negado." });
            return;
        }
        res.status(200).json({ mensagem: "Notificação descartada com sucesso." });
    }
    catch (error) {
        res.status(500).json({ erro: "Erro ao deletar notificação." });
    }
});
export default router;
