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
import routesPushTokens from './routes/pushTokens'
import routesLogs from './routes/logs'
import { verificarNotificacoesDiarias } from './services/dailyNotifications'
import { logger, registrarErro } from './services/logger'
import { TokenInterface } from './routes/verificaToken'

import pinoHttp from 'pino-http';

//Middleware
import { verificaToken } from './routes/verificaToken'

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(pinoHttp({ logger }))

const respostasComErroRegistrado = new WeakSet<express.Response>()

app.use((req, res, next) => {
  res.on('finish', () => {
    if (res.statusCode < 500 || respostasComErroRegistrado.has(res)) {
      return
    }

    const request = req as TokenInterface
    void registrarErro({
      usuarioId: request.usuarioId,
      erro: `Resposta HTTP ${res.statusCode}`,
      onde: "resposta de erro da API",
      sessao: String(req.id),
      rota: req.originalUrl,
      metodo: req.method,
    })
  })

  next()
})

app.get('/', (req, res) => {
  res.send('API Backend: Dexter')
})

// Rotas Públicas
app.use("/usuarios", routesUsuarios)
app.use("/auth", routesAutorizacao)


// Middleware + Segurança
app.use(verificaToken)
app.use("/tarefas", routesTarefas)
app.use("/notificacoes", routesNotificacoes)
app.use("/push-tokens", routesPushTokens)
app.use("/agent-chat", routesAgentChat)
app.use("/logs", routesLogs)

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
    await registrarErro({
      erro: error instanceof Error ? error.message : String(error),
      onde: "limpeza automática da lixeira",
      sessao: "cron-lixeira",
      stack: error instanceof Error ? error.stack : undefined,
    })
  }
})

cron.schedule('0 8 * * *', () => {
  void verificarNotificacoesDiarias()
    .then((totalEnviado) => {
      console.log(`${totalEnviado} notificação(ões) diária(s) enviada(s).`)
    })
    .catch(async (error) => {
      await registrarErro({
        erro: error instanceof Error ? error.message : String(error),
        onde: "geração automática de notificações diárias",
        sessao: "cron-notificacoes-diarias",
        stack: error instanceof Error ? error.stack : undefined,
      })
    })
}, {
  timezone: 'America/Sao_Paulo',
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
    await registrarErro({
      erro: error instanceof Error ? error.message : String(error),
      onde: "atualização automática de tarefas atrasadas",
      sessao: "cron-tarefas-atrasadas",
      stack: error instanceof Error ? error.stack : undefined,
    })
  }
})

app.use(async (error: unknown, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  respostasComErroRegistrado.add(res)

  await registrarErro({
    erro: error instanceof Error ? error.message : String(error),
    onde: "middleware global de erros",
    sessao: String(req.id),
    stack: error instanceof Error ? error.stack : undefined,
    rota: req.originalUrl,
    metodo: req.method,
  })

  if (!res.headersSent) {
    res.status(500).json({ erro: "Erro interno do servidor." })
  }
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)

  void verificarNotificacoesDiarias()
    .then((totalEnviado) => {
      console.log(`${totalEnviado} notificação(ões) diária(s) enviada(s) na inicialização.`)
    })
    .catch(async (error) => {
      await registrarErro({
        erro: error instanceof Error ? error.message : String(error),
        onde: "verificação de notificações na inicialização",
        sessao: "inicio-servidor",
        stack: error instanceof Error ? error.stack : undefined,
      })
    })
})
