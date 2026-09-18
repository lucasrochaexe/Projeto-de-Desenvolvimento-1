import { Router, Response } from 'express'
import { prisma } from '../../lib/prisma'
import { z } from 'zod'
import { verificaToken, TokenInterface } from './verificaToken'

const router = Router()

const tarefaSchema = z.object({
    titulo: z.string().min(3, { message: "O título deve ter no mínimo 3 caracteres" }),
    descricao: z.string().optional(),
    prioridade: z.enum(["ALTA", "MEDIA", "BAIXA"]).default("MEDIA"),
    status: z.enum(["EM_ANDAMENTO", "CONCLUIDA", "EM_ATRASO"]).default("EM_ANDAMENTO"),
    prazoInic: z.iso.datetime(),
    prazoFim: z.iso.datetime(),
    dicas: z.string().optional()
})

router.use(verificaToken)

router.get("/", async (req: TokenInterface, res: Response) => {
    try {
        const tarefas = await prisma.tarefa.findMany({
            where: {
                usuarioId: req.usuarioId,
                deletadoEm: null
            },
            orderBy: { prazoFim: 'asc' }
        })

        res.status(200).json(tarefas)
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar as tarefas." })
    }
})

router.post("/", async (req: TokenInterface, res: Response) => {
    const valida = tarefaSchema.safeParse(req.body)

    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { titulo, descricao, prioridade, prazoInic, prazoFim, dicas } = valida.data

    try {
        const novaTarefa = await prisma.tarefa.create({
            data: {
                titulo,
                descricao,
                prioridade,
                prazoInic: prazoInic ? new Date(prazoInic) : null,
                prazoFim: prazoFim ? new Date(prazoFim) : null,
                dicas,
                usuarioId: req.usuarioId as string
            }
        })

        res.status(201).json(novaTarefa)
    } catch (error) {
        res.status(500).json({ erro: "Erro ao criar a tarefa." })
    }
})

router.delete("/:id", async (req: TokenInterface, res: Response) => {
    const { id } = req.params

    try {
        const tarefa = await prisma.tarefa.updateMany({
            where: {
                id: String(id),
                usuarioId: req.usuarioId
            },
            data: {
                deletadoEm: new Date()
            }
        })

        if (tarefa.count === 0) {
            res.status(404).json({ erro: "Tarefa não encontrada." })
            return
        }

        res.status(200).json({ mensagem: "Tarefa movida para a lixeira." })
    } catch (error) {
        res.status(500).json({ erro: "Erro ao deletar a tarefa." })
    }
})

const atualizaTarefaSchema = z.object({
    titulo: z.string().min(3, { message: "Mínimo de 3 caracteres" }).optional(),
    descricao: z.string().optional(),
    prioridade: z.enum(["ALTA", "MEDIA", "BAIXA"]).optional(),
    status: z.enum(["EM_ANDAMENTO", "EM_ATRASO", "CONCLUIDA"]).optional(),
    prazoInic: z.iso.datetime().optional(),
    prazoFim: z.iso.datetime().optional(),
    dicas: z.string().optional()
})

router.patch("/:id", async (req: TokenInterface, res: Response) => {
    const { id } = req.params

    const valida = atualizaTarefaSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { titulo, descricao, prioridade, prazoInic, prazoFim, dicas, status } = valida.data

    try {
        const tarefa = await prisma.tarefa.updateMany({
            where: {
                id: String(id),
                usuarioId: req.usuarioId,
                deletadoEm: null
            },
            data: {
                titulo,
                descricao,
                prioridade,
                status,
                prazoInic: prazoInic ? new Date(prazoInic) : undefined,
                prazoFim: prazoFim ? new Date(prazoFim) : undefined,
                dicas
            }
        })

        if (tarefa.count === 0) {
            res.status(404).json({ erro: "Tarefa não encontrada, na lixeira ou acesso negado." })
            return
        }

        res.status(200).json({ mensagem: "Tarefa Atualizada!" })
    } catch (error) {
        res.status(500).json({ erro: "Erro ao atualizar a tarefa." })
    }
})

export default router