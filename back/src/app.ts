import express from 'express'
import cors from 'cors'
import cron from 'node-cron'
import { prisma } from '../lib/prisma'

//Rotas
import routesUsuarios from './routes/usuarios'
import routesTarefas from './routes/tarefas'
import routesNotificacoes from './routes/notificacoes'
import routesAutorizacao from './routes/auth/login'
import routesAgentChat from './routes/agent/chat'

//Middleware
import { verificaToken } from './routes/verificaToken'

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('API Backend: Dexter')
})

// Rotas Públicas
app.use("/usuarios", routesUsuarios)
app.use("/auth/login", routesAutorizacao)


// Middleware + Segurança
app.use(verificaToken)
app.use("/tarefas", routesTarefas)
app.use("/notificacoes", routesNotificacoes)
app.use("/agent-chat", routesAgentChat)

// Lixeira (caso tarefas não sejam excluídas manualmente)
cron.schedule('0 0 * * *', async () => {
  console.log("Iniciando limpeza da lixeira de tarefas...")
  const dataLimite = new Date()
  dataLimite.setDate(dataLimite.getDate() - 7)

  try {
    const apagadas = await prisma.tarefa.deleteMany({
      where: {
        deletadoEm: {
          lte: dataLimite
        }
      }
    })
    console.log(`${apagadas.count} tarefas antigas foram removidas definitivamente.`)
  } catch (error) {
    console.error("Erro ao limpar a lixeira:", error)
  }
})

// Notificações para tarefas que vencem nos próximos 15 dias ou já estão atrasadas.
cron.schedule('0 * * * *', async () => {
  console.log("Iniciando verificação de prazos para notificações...")
  const agora = new Date()

  const limiteDosProximos15Dias = new Date(agora)
  limiteDosProximos15Dias.setDate(limiteDosProximos15Dias.getDate() + 7)

  try {
    const tarefasVencendo = await prisma.tarefa.findMany({
      where: {
        deletadoEm: null,
        arquivadoEm: null,
        status: { not: "CONCLUIDA" },
        prazoFim: {
          not: null,
          lte: limiteDosProximos15Dias,
        },
        notificacoes: {
          none: {
            visualizada: false,
          }
        }
      }
    })

    if (tarefasVencendo.length === 0) {
      console.log("Nenhuma tarefa pendente dentro da janela de notificação.")
      return
    }

    const notificacoesCriadas = await prisma.$transaction(
      tarefasVencendo.map((tarefa) =>
        prisma.notificacao.create({
          data: {
            usuarioId: tarefa.usuarioId,
            tarefaId: tarefa.id,
            vencimento: tarefa.prazoFim!
          }
        })
      )
    )

    console.log(`${notificacoesCriadas.length} alertas gerados para tarefas próximas do prazo.`)
  } catch (error) {
    console.error("Erro ao gerar notificações diárias:", error)
  }
})

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
    })

    if (atualizadas.count > 0) {
      console.log(`${atualizadas.count} tarefa(s) marcada(s) como atrasada(s).`)
    }
  } catch (error) {
    console.error("Erro ao atualizar tarefas atrasadas:", error)
  }
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})