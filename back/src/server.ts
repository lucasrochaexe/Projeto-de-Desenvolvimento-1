import express from 'express'
import cors from 'cors'

// Rotas Padrão
import routesUsuarios from './routes/usuarios'
import routesTarefas from './routes/tarefas'
import routesNotificacoes from './routes/notificacoes'

// Tokens e Autorização
import routesAutorizacao from './routes/auth/login'

// Agente de IA
import routesAgentChat from './routes/agent/chat'

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.use("/usuarios", routesUsuarios)
app.use("/tarefas", routesTarefas)
app.use("/notificacoes", routesNotificacoes)
app.use("/auth", routesAutorizacao)
app.use("/agent-chat", routesAgentChat)

app.get('/', (req, res) => {
  res.send('API Backend: Dexter')
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})