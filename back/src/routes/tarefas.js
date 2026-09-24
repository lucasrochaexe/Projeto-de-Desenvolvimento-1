import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { verificaToken } from './verificaToken';
const router = Router();
const tarefaSchema = z.object({
    titulo: z.string().min(3, { message: "O título deve ter no mínimo 3 caracteres" }),
    descricao: z.string().nullable().optional(),
    prioridade: z.enum(["ALTA", "MEDIA", "BAIXA"]).default("MEDIA"),
    status: z.enum(["EM_ANDAMENTO", "CONCLUIDA", "EM_ATRASO"]).default("EM_ANDAMENTO"),
    prazoInic: z.iso.datetime().nullable().optional(),
    prazoFim: z.iso.datetime().nullable().optional(),
    dicas: z.string().nullable().optional()
});
router.use(verificaToken);
router.get("/", async (req, res) => {
    try {
        const tarefas = await prisma.tarefa.findMany({
            where: {
                usuarioId: req.usuarioId,
                deletadoEm: null
            },
            orderBy: { prazoFim: 'asc' }
        });
        res.status(200).json(tarefas);
    }
    catch (error) {
        res.status(500).json({ erro: "Erro ao buscar as tarefas." });
    }
});
router.post("/", async (req, res) => {
    const valida = tarefaSchema.safeParse(req.body);
    if (!valida.success) {
        res.status(400).json({ erro: valida.error });
        return;
    }
    const { titulo, descricao, prioridade, status, prazoInic, prazoFim, dicas } = valida.data;
    try {
        const novaTarefa = await prisma.tarefa.create({
            data: {
                titulo,
                descricao,
                prioridade,
                status,
                prazoInic: prazoInic ? new Date(prazoInic) : null,
                prazoFim: prazoFim ? new Date(prazoFim) : null,
                dicas,
                usuarioId: req.usuarioId
            }
        });
        res.status(201).json(novaTarefa);
    }
    catch (error) {
        res.status(500).json({ erro: "Erro ao criar a tarefa." });
    }
});
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const tarefa = await prisma.tarefa.updateMany({
            where: {
                id: String(id),
                usuarioId: req.usuarioId,
                deletadoEm: null
            },
            data: {
                deletadoEm: new Date()
            }
        });
        if (tarefa.count === 0) {
            res.status(404).json({ erro: "Tarefa não encontrada." });
            return;
        }
        res.status(200).json({ mensagem: "Tarefa movida para a lixeira." });
    }
    catch (error) {
        res.status(500).json({ erro: "Erro ao deletar a tarefa." });
    }
});
const atualizaTarefaSchema = z.object({
    titulo: z.string().min(3, { message: "Mínimo de 3 caracteres" }).optional(),
    descricao: z.string().nullable().optional(),
    prioridade: z.enum(["ALTA", "MEDIA", "BAIXA"]).optional(),
    status: z.enum(["EM_ANDAMENTO", "EM_ATRASO", "CONCLUIDA"]).optional(),
    prazoInic: z.iso.datetime().nullable().optional(),
    prazoFim: z.iso.datetime().nullable().optional(),
    dicas: z.string().nullable().optional()
});
router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const valida = atualizaTarefaSchema.safeParse(req.body);
    if (!valida.success) {
        res.status(400).json({ erro: valida.error });
        return;
    }
    const { titulo, descricao, prioridade, prazoInic, prazoFim, dicas, status } = valida.data;
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
                prazoInic: prazoInic === null ? null : prazoInic ? new Date(prazoInic) : undefined,
                prazoFim: prazoFim === null ? null : prazoFim ? new Date(prazoFim) : undefined,
                dicas
            }
        });
        if (tarefa.count === 0) {
            res.status(404).json({ erro: "Tarefa não encontrada, na lixeira ou acesso negado." });
            return;
        }
        res.status(200).json({ mensagem: "Tarefa Atualizada!" });
    }
    catch (error) {
        res.status(500).json({ erro: "Erro ao atualizar a tarefa." });
    }
});
router.get("/lixeira", async (req, res) => {
    try {
        const tarefasLixeira = await prisma.tarefa.findMany({
            where: {
                usuarioId: req.usuarioId,
                deletadoEm: { not: null }
            },
            orderBy: { deletadoEm: 'desc' }
        });
        res.status(200).json(tarefasLixeira);
    }
    catch (error) {
        res.status(500).json({ erro: "Erro ao buscar tarefas na lixeira." });
    }
});
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const tarefa = await prisma.tarefa.findFirst({
            where: {
                id: String(id),
                usuarioId: req.usuarioId,
                deletadoEm: null
            }
        });
        if (!tarefa) {
            res.status(404).json({ erro: "Tarefa não encontrada." });
            return;
        }
        res.status(200).json(tarefa);
    }
    catch (error) {
        res.status(500).json({ erro: "Erro ao buscar a tarefa." });
    }
});
router.patch("/:id/restaurar", async (req, res) => {
    const { id } = req.params;
    try {
        const tarefa = await prisma.tarefa.updateMany({
            where: {
                id: String(id),
                usuarioId: req.usuarioId,
                deletadoEm: { not: null }
            },
            data: {
                deletadoEm: null
            }
        });
        if (tarefa.count === 0) {
            res.status(404).json({ erro: "Tarefa não encontrada na lixeira ou acesso negado." });
            return;
        }
        res.status(200).json({ mensagem: "Tarefa restaurada com sucesso!" });
    }
    catch (error) {
        res.status(500).json({ erro: "Erro ao restaurar a tarefa." });
    }
});
router.delete("/:id/definitivo", async (req, res) => {
    const { id } = req.params;
    try {
        const tarefa = await prisma.tarefa.deleteMany({
            where: {
                id: String(id),
                usuarioId: req.usuarioId,
                deletadoEm: { not: null }
            }
        });
        if (tarefa.count === 0) {
            res.status(404).json({ erro: "Tarefa não encontrada na lixeira." });
            return;
        }
        res.status(200).json({ mensagem: "Tarefa excluída permanentemente." });
    }
    catch (error) {
        res.status(500).json({ erro: "Erro ao excluir a tarefa definitivamente." });
    }
});
export default router;
