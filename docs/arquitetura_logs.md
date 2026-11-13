# 🛡️ Arquitetura de Monitoramento e Logs de Erro

## 📌 Visão Geral
O Sistema Dexter conta com uma camada centralizada de observabilidade e rastreamento de falhas. Os erros ocorridos tanto no servidor (Back-end) quanto no aplicativo mobile (Front-end) são capturados, estruturados com a biblioteca **Pino** e persistidos diretamente no banco de dados **PostgreSQL** via **Prisma ORM**.

---

## ⚙️ Componentes e Implementação

### 1. Back-end e Banco de Dados
* **Motor de Log (`logger.ts`):** Configuração do logger **Pino** integrado à rotina de persistência assíncrona no PostgreSQL.
* **Modelagem de Dados (`schema.prisma`):** Atualização do modelo `Log` para armazenar o contexto completo das exceções.
* **Migration Aplicada:** `20261113221946_adiciona_logs_de_erro`.
* **Interceptação Global (`app.ts`):** Middleware global configurado para capturar e registrar automaticamente qualquer resposta com status **HTTP 500+**.
* **Processamento em Background:** Rotinas e *jobs* automáticos do sistema agora interceptam falhas de execução e salvam os registros diretamente no banco.

### 2. Integração Front-end (React Native)
* **Comunicação (`api.ts`):** Adição da função responsável por despachar relatórios de falha do cliente para a API.
* **Captura no Aplicativo (`App.tsx`):** Erros críticos no cliente (como falhas na inicialização ou no serviço de notificações) são interceptados e enviados automaticamente ao Back-end.

---

## 🌐 Endpoints da API (`logs.ts`)

| Método | Rota | Descrição | Controle de Acesso |
| :--- | :--- | :--- | :--- |
| `POST` | `/logs/client` | Recebe e armazena os logs de erro originados no aplicativo mobile (Front-end). | Autenticado / Cliente |
| `GET` | `/logs` | Retorna o histórico detalhado de logs registrados no banco de dados. | Restrito a Administradores |

---

## 🗂️ Estrutura do Registro de Log (Payload)

Cada ocorrência persistida na tabela de logs armazena os seguintes metadados para diagnóstico e auditoria:

* **ID:** Identificador único do registro de log.
* **Usuário:** ID e nome do usuário associado à sessão no momento da falha.
* **Mensagem do Erro:** Descrição legível da exceção disparada.
* **Local do Erro:** Origem da falha (módulo, arquivo ou camada onde ocorreu).
* **Sessão / Requisição:** Identificador de rastreio da requisição ou sessão ativa.
* **Rota:** Endpoint ou tela acessada no momento do erro.
* **Método HTTP:** Verbo utilizado na chamada (`GET`, `POST`, `PUT`, `DELETE`, etc.).
* **Stack Trace:** Pilha completa de execução para depuração técnica.
* **Data e Hora:** *Timestamp* exato do evento.