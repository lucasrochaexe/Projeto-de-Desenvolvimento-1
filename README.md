<div align="center">

# 🤖 Dexter — Assistente Pessoal Inteligente com IA

**Gerenciamento inteligente de rotinas e tarefas por comando de voz, texto e quadro Kanban.**

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Neon_Postgres-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![ElevenLabs](https://img.shields.io/badge/ElevenLabs-000000?style=for-the-badge&logo=elevenlabs&logoColor=white)](https://elevenlabs.io/)
[![Groq](https://img.shields.io/badge/Groq-f55036?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com/)

> Repositório oficial da disciplina de **Projeto de Desenvolvimento 1** — *Análise e Desenvolvimento de Sistemas*.

</div>

---

## 📖 Visão Geral

O **Dexter** é uma aplicação mobile assistiva voltada à produtividade e administração pessoal. Através de **Transcrição de Áudio de alta velocidade** e **Agentes de Linguagem Natural**, o sistema atua como um copiloto diário: o usuário pode enviar um comando de voz ou digitar para cadastrar suas tarefas, organizar seu fluxo de trabalho em um quadro **Kanban** interativo e receber um retorno imediato com dicas práticas geradas por Inteligência Artificial.

---

## ✨ Funcionalidades e Escopo do Sistema

### 👤 Gestão de Conta e Autenticação
- Cadastro de usuários com autenticação criptografada via tokens.
- Recuperação de senha automatizada utilizando serviço SMTP de e-mails em tempo real.
- Registro contínuo de exceções e monitoramento de falhas do cliente e servidor em banco de dados.

### 📋 Gestão Inteligente de Tarefas (Kanban & IA)
- **Entrada por Voz ou Texto:** O usuário envia um áudio; o sistema transcreve automaticamente o conteúdo de forma otimizada e o agente estrutura a tarefa.
- **Retorno e Dicas via IA:** O agente analisa o contexto e retorna respostas em formato JSON com dicas práticas e acionáveis para auxiliar na conclusão.
- **Quadro Kanban Interativo:** Organização visual das tarefas por status (*A Fazer*, *Em Andamento*, *Concluído*), com recursos automatizados de "Soft Delete" (arquivamento em lixeira com limpeza automática).
- **Sistema de Alertas (Push Notifications):** Motor de notificações preventivas categorizado por níveis de urgência em relação ao prazo final da tarefa.

---

## 📐 Arquitetura e Documentação UML

A documentação técnica do sistema baseia-se nas normativas da **UML 2.5**, mapeando regras de negócio e interações do software:

- **Atores Principais:**
  - **Usuário (Gestor/Secretário):** Interage com o app via voz/texto, movimenta o Kanban e recebe as notificações de prazo e dicas da IA.
- **Sistemas Externos (Atores Secundários):**
  - **Serviço de Transcrição e Agente IA:** Processam o áudio, interpretam comandos de linguagem natural e devolvem os parâmetros.
- Todos os detalhamentos estruturais, log de arquitetura, atas de validação e diagramas (`.png`) estão localizados na pasta `docs/` do repositório.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologias Utilizadas |
| :--- | :--- |
| **Front-end (Mobile)** | React Native, Expo (v58), JavaScript / TypeScript |
| **Back-end** | Node.js, TypeScript, REST API, Prisma ORM, Logger Pino |
| **Banco de Dados** | Neon Postgres (Serverless PostgreSQL) |
| **Inteligência Artificial** | **ElevenLabs** (Agente de Conversa e Geração), **Groq** (Transcrição Rápida Whisper-large-v3) |
| **Infraestrutura / Cloud**| **Render** (Hospedagem da API), **Brevo** (Serviço SMTP de E-mails) |
| **Documentação & Modelagem** | Markdown, PlantUML, Astah UML |

---

## 👥 Equipe de Desenvolvimento

| Integrante | Função / Papel no Projeto | Responsabilidades Principais |
| :--- | :--- | :--- |
| [**Dione**](https://github.com/Dione6030) | Product Owner (PO) | Visão do produto, gestão de backlog e integração de Agentes e APIs de Inteligência Artificial. |
| [**Ítalo**](https://github.com/istalo) | Desenvolvedor Back-end | Arquitetura da API (Node.js/Prisma), banco de dados Neon, rotinas Cron e infraestrutura SMTP. |
| [**Bruno**](https://github.com/BrunoPCdS) | Desenvolvedor Front-end | Desenvolvimento mobile (React Native/Expo), regras locais de UI/UX, captura de áudio e Push Notifications. |
| [**Lucas**](https://github.com/lucasrochaexe) | Documentador Técnico / Arquitetura | Modelagem estrutural UML, elaboração de especificações técnicas, gestão do repositório e atas. |

---

## 📂 Estrutura de Diretórios

```plaintext
Projeto-de-Desenvolvimento-1/
├── back/                       # API Node.js, endpoints REST, serviços e ORM
│   ├── prisma/                 # Schema e migrações do banco de dados
│   ├── src/
│   │   ├── routes/             # Rotas de autenticação, tarefas, IA e notificações
│   │   └── services/           # Integrações de IA, e-mail, logs e notificações
│   ├── package.json
│   └── README.md
├── front/                      # Aplicação mobile desenvolvida com Expo
│   ├── assets/                 # Imagens, ícones e recursos visuais
│   ├── src/
│   │   ├── screens/            # Telas do aplicativo
│   │   ├── services/           # Comunicação com a API e notificações
│   │   └── utilidade/          # Componentes e utilitários reutilizáveis
│   ├── App.tsx
│   ├── package.json
│   └── README.md
├── docs/                       # Documentação, atas, regras e diagramas UML
│   ├── atas/
│   ├── casos_de_uso.md
│   ├── diagrama_casos_uso.png
|   ├── requisitos_e_backlog.md
│   └── stack_tecnologico_e_arquitetura.md
└── README.md                   # Documentação principal do projeto
```

📊 Status do Projeto (MVP Concluído)
[x] Definição do escopo do produto, regras de negócio e papéis da equipe.

[x] Modelagem de Diagramas de Casos de Uso (UML) validados para documentação técnica.

[x] Estruturação relacional do banco de dados Serverless (Neon Postgres).

[x] Implementação do fluxo de áudio, transcrição via Groq e geração de tarefas via ElevenLabs.

[x] Construção de interface mobile com Kanban, autenticação criptografada via Token e notificações.

[x] Hospedagem escalável da API (Render) integrada com envio de e-mails em tempo real (Brevo).

[ ] Apresentação e entrega final da disciplina
