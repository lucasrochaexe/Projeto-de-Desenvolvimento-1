import { Router, Response } from 'express'
import { prisma } from '../../lib/prisma'
import { z } from 'zod'
import { verificaToken, TokenInterface } from './verificaToken'

const router = Router()

router.use(verificaToken)

router.get("/", async (req: TokenInterface, res: Response) => {
    try {
        const notificacoes = await prisma.notificacao.findMany({
            where: {
                usuarioId: req.usuarioId
            },
            include: {
                tarefa: {
                    select: {
                        titulo: true,
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