import express from 'express'
import cors from 'cors'

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

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})