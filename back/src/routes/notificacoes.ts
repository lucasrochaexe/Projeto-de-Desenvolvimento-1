import { Router, Response } from 'express'
import { prisma } from '../../lib/prisma'
import { verificaToken, TokenInterface } from './verificaToken'
import { verificarNotificacoesDiarias } from '../services/dailyNotifications'

const router = Router()

router.use(verificaToken)

router.post("/verificar-diarias", async (req: TokenInterface, res: Response) => {
    if (!req.usuarioId) {
        res.status(401).json({ erro: "Usuário não autenticado." })
        return
    }

    try {
        const totalEnviado = await verificarNotificacoesDiarias(req.usuarioId)
        res.status(200).json({ totalEnviado })
    } catch (error) {
        console.error("Erro ao verificar notificações diárias:", error)
        res.status(500).json({ erro: "Erro ao verificar notificações diárias." })
    }
})

router.get("/", async (req: TokenInterface, res: Response) => {
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
        })

        res.status(200).json(notificacoes)
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar notificações." })
    }
})

router.delete("/", async (req: TokenInterface, res: Response) => {
    try {
        await prisma.notificacao.deleteMany({
            where: {
                usuarioId: req.usuarioId
            }
        })

        res.status(200).json({ mensagem: "Notificações limpas com sucesso." })
    } catch (error) {
        res.status(500).json({ erro: "Erro ao limpar notificações." })
    }
})

router.patch("/:id/visualizada", async (req: TokenInterface, res: Response) => {
    const { id } = req.params

    try {
        const notificacao = await prisma.notificacao.updateMany({
            where: {
                id: String(id),
                usuarioId: req.usuarioId
            },
            data: {
                visualizada: true
            }
        })

        if (notificacao.count === 0) {
            res.status(404).json({ erro: "Notificação não encontrada ou acesso negado." })
            return
        }

        res.status(200).json({ mensagem: "Notificação marcada como visualizada." })
    } catch (error) {
        res.status(500).json({ erro: "Erro ao marcar notificação como visualizada." })
    }
})

router.delete("/:id", async (req: TokenInterface, res: Response) => {
    const { id } = req.params

    try {
        const notificacao = await prisma.notificacao.deleteMany({
            where: {
                id: String(id),
                usuarioId: req.usuarioId
            }
        })

        if (notificacao.count === 0) {
            res.status(404).json({ erro: "Notificação não encontrada ou acesso negado." })
            return
        }

        res.status(200).json({ mensagem: "Notificação descartada com sucesso." })
    } catch (error) {
        res.status(500).json({ erro: "Erro ao deletar notificação." })
    }
})

export default router