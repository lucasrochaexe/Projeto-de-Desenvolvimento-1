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

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})