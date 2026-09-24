import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { prisma } from '../lib/prisma';
//Rotas
import routesUsuarios from './routes/usuarios';
import routesTarefas from './routes/tarefas';
import routesNotificacoes from './routes/notificacoes';
import routesAutorizacao from './routes/auth/login';
import routesAgentChat from './routes/agent/chat';
//Middleware
import { verificaToken } from './routes/verificaToken';
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
    res.send('API Backend: Dexter');
});
// Rotas Públicas
app.use("/usuarios", routesUsuarios);
app.use("/auth/login", routesAutorizacao);
// Middleware + Segurança
app.use(verificaToken);
app.use("/tarefas", routesTarefas);
app.use("/notificacoes", routesNotificacoes);
app.use("/agent-chat", routesAgentChat);
// Lixeira (caso tarefas não sejam excluídas manualmente)
cron.schedule('0 0 * * *', async () => {
    console.log("Iniciando limpeza da lixeira de tarefas...");
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - 7);
    try {
        const apagadas = await prisma.tarefa.deleteMany({
            where: {
                deletadoEm: {
                    lte: dataLimite
                }
            }
        });
        console.log(`${apagadas.count} tarefas antigas foram removidas definitivamente.`);
    }
    catch (error) {
        console.error("Erro ao limpar a lixeira:", error);
    }
});
// Notificações diárias para tarefas vencendo amanhã
cron.schedule('0 8 * * *', async () => {
    console.log("Iniciando verificação de prazos para notificações...");
    const amanhaInicio = new Date();
    amanhaInicio.setDate(amanhaInicio.getDate() + 1);
    amanhaInicio.setHours(0, 0, 0, 0);
    const amanhaFim = new Date(amanhaInicio);
    amanhaFim.setHours(23, 59, 59, 999);
    try {
        const tarefasVencendo = await prisma.tarefa.findMany({
            where: {
                deletadoEm: null,
                status: { not: "CONCLUIDA" },
                prazoFim: {
                    gte: amanhaInicio,
                    lte: amanhaFim
                },
                notificacoes: {
                    none: {}
                }
            }
        });
        if (tarefasVencendo.length === 0) {
            console.log("Nenhuma tarefa pendente vencendo amanhã.");
            return;
        }
        const notificacoesCriadas = await prisma.$transaction(tarefasVencendo.map((tarefa) => prisma.notificacao.create({
            data: {
                usuarioId: tarefa.usuarioId,
                tarefaId: tarefa.id,
                vencimento: tarefa.prazoFim
            }
        })));
        console.log(`${notificacoesCriadas.length} alertas gerados para tarefas de amanhã.`);
    }
    catch (error) {
        console.error("Erro ao gerar notificações diárias:", error);
    }
});
// Marca como atrasadas as tarefas pendentes cujo prazo já terminou.
cron.schedule('*/5 * * * *', async () => {
    try {
        const atualizadas = await prisma.tarefa.updateMany({
            where: {
                status: "EM_ANDAMENTO",
                deletadoEm: null,
                prazoFim: { lt: new Date() }
            },
            data: {
                status: "EM_ATRASO"
            }
        });
        if (atualizadas.count > 0) {
            console.log(`${atualizadas.count} tarefa(s) marcada(s) como atrasada(s).`);
        }
    }
    catch (error) {
        console.error("Erro ao atualizar tarefas atrasadas:", error);
    }
});
app.listen(port, () => {
    console.log(`Servidor rodando na porta: ${port}`);
});
