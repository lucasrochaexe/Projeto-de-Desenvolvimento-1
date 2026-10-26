<div align="center">

# 🤖 Dexter — Assistente Pessoal Inteligente com IA

**Gerenciamento inteligente de rotinas e tarefas por comando de voz, texto e quadro Kanban.**

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![PostgreSQL](https://img.shields.io/badge/Neon_Postgres-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![OpenAI](https://img.shields.io/badge/OpenAI_API-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![UML](https://img.shields.io/badge/PlantUML-000000?style=for-the-badge&logo=uml&logoColor=white)](https://plantuml.com/)

> Repositório oficial da disciplina de **Projeto de Desenvolvimento 1** — *Análise e Desenvolvimento de Sistemas*.

</div>

---

## 📖 Visão Geral

O **Dexter** é uma aplicação mobile assistiva voltada à produtividade e administração pessoal. Através de **Transcrição de Áudio (Speech-to-Text)** e **Processamento de Linguagem Natural (OpenAI)**, o sistema atua como um copiloto diário: o usuário pode enviar um áudio ou digitar para cadastrar suas tarefas, organizar seu fluxo de trabalho em um quadro **Kanban** interativo e receber um retorno imediato com dicas práticas geradas por Inteligência Artificial sobre como executar cada atividade com mais eficiência.

---

## ✨ Funcionalidades e Escopo do Sistema

### 👤 Gestão de Conta e Autenticação
- Cadastro, autenticação segura e gerenciamento de perfil do usuário.

### 📋 Gestão Inteligente de Tarefas (Kanban & IA)
- **Entrada por Voz (Transcrição) ou Texto:** O usuário envia um áudio falando sua pendência; o sistema transcreve automaticamente o conteúdo e estrutura a tarefa (ou permite o cadastro manual via texto).
- **Retorno de Dicas de Execução via IA:** A partir da tarefa criada ou selecionada, a IA analisa o contexto e retorna dicas práticas e passos acionáveis para auxiliar na sua conclusão.
- **Quadro Kanban Interativo:** Organização visual e movimentação das tarefas por status (*A Fazer*, *Em Andamento*, *Concluído*).
- **Edição e Exclusão:** Controle completo sobre prazos, títulos, descrições e prioridades.

---

## 📐 Arquitetura e Modelagem UML

O projeto conta com documentação técnica baseada nos padrões da **UML**, utilizando **PlantUML / Astah** para mapear os requisitos e interações do sistema:

- **Atores Principais:**
  - **Usuário:** Interage com o aplicativo enviando áudios/textos, gerenciando sua conta, movimentando o quadro Kanban e consultando as dicas da IA.
- **Sistemas Externos / Atores Secundários:**
  - **API de IA (OpenAI):** Responsável pela transcrição do áudio enviado pelo usuário (Speech-to-Text), interpretação do comando e geração do retorno em texto com dicas personalizadas para a tarefa.
- **Artefatos no Repositório:** Os diagramas de Casos de Uso (`.puml` / imagens exportadas) e especificações técnicas encontram-se organizados nos diretórios de documentação do projeto.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologias Utilizadas |
| :--- | :--- |
| **Front-end (Mobile)** | React Native, Expo, JavaScript / TypeScript |
| **Back-end** | Python, REST API, Integração de Serviços de IA |
| **Banco de Dados** | Neon Postgres (Serverless PostgreSQL) |
| **Inteligência Artificial** | OpenAI API (Transcrição de Áudio / Whisper & Geração de Dicas via LLM) |
| **Documentação & Modelagem** | Markdown, PlantUML, Astah UML |
| **Controle de Versão** | Git & GitHub |

---

## 👥 Equipe de Desenvolvimento

| Integrante | Função / Papel no Projeto | Responsabilidades Principais |
| :--- | :--- | :--- |
| [**Dione**](https://github.com/Dione6030) | Product Owner (PO) | Visão do produto, levantamento de requisitos e gestão de backlog. |
| [**Ítalo**](https://github.com/istalo) | Desenvolvedor Back-end | Arquitetura da API em Python, banco de dados Neon e integração de transcrição/IA. |
| [**Bruno**](https://github.com/BrunoPCdS) | Desenvolvedor Front-end | Desenvolvimento mobile em React Native, captura de áudio, telas do Kanban e UI/UX. |
| [**Lucas**](https://github.com/lucasrochaexe) | Documentador Técnico / Arquitetura | Modelagem de sistemas, Diagramas UML (PlantUML) e documentação técnica do repositório. |

---

## 📂 Estrutura de Diretórios

```plaintext
Projeto-de-Desenvolvimento-1/
├── docs/                       # Documentação técnica e artefatos de engenharia de software
│   ├── uml/                    # Diagramas de Casos de Uso, código PlantUML (.puml) e imagens (.png/.svg)
│   └── requisitos/             # Escopo, regras de negócio e documentação complementar
├── backend/                    # Servidor Python, rotas da API, transcrição de áudio e integração IA/Banco
├── mobile/                     # Aplicação cliente desenvolvida em React Native
└── README.md                   # Documentação principal do projeto

📊 Status do Projeto (Roadmap)
[x] Definição do escopo do produto e papéis da equipe

[x] Modelagem e refinamento do Diagrama de Casos de Uso em PlantUML

[x] Estruturação do banco de dados em nuvem (Neon Postgres)

[x] Implementação do fluxo de envio de áudio, transcrição e geração de dicas com IA

[x] Construção do fluxo principal e quadro Kanban no React Native

[X] Testes integrados de ponta a ponta (Front-end ↔ Back-end ↔ IA)

[ ] Apresentação e entrega final da disciplina
