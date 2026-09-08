# Dexter - Assistente de Administração com IA 🧠📅

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![Versão](https://img.shields.io/badge/Vers%C3%A3o-0.1.0-blue)
![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![React Native](https://img.shields.io/badge/React_Native-Front--end-blueviolet)
![Neon Postgres](https://img.shields.io/badge/Neon-Postgres-336791)
![ElevenLabs](https://img.shields.io/badge/ElevenLabs-IA%20%26%20Voice-black)

## 📌 Sobre o Projeto

O **Dexter** é um aplicativo voltado para gestores, secretários e profissionais da área administrativa que precisam de agilidade na gestão de suas rotinas. Através de um Assistente de Inteligência Artificial operado por voz, o Dexter permite que o usuário delegue tarefas, agende compromissos e tire dúvidas sobre suas atividades, minimizando o tempo gasto digitando ou navegando em interfaces complexas.

Nosso diferencial é a simulação de uma secretária virtual (Deedee), utilizando a API da **ElevenLabs** para processamento de linguagem natural e feedback em áudio fluido e humano, criando uma experiência ágil e intuitiva, ideal para quem está no trânsito ou sobrecarregado de informações.

## 👥 A Equipe do Laboratório

O projeto está sendo desenvolvido no âmbito do módulo de Projeto de Desenvolvimento I por:

*   **Dione Pinheiro** - *PO (Product Owner)*: Priorização de backlog e coordenação.
*   **Ítalo Valente** - *Back-end Developer*: Lógica do servidor e banco de dados.
*   **Bruno Correa** - *Front-end Developer*: Interface em React Native e UX/UI.
*   **Lucas Rocha** - *Documentador (Technical Writer)*: Documentação do projeto, arquitetura e versionamento.

## 🎯 Público-Alvo

*   **Gestores (Ex: Roberto, 52 anos):** Buscam comandos práticos (áudio) e aversão a interfaces burocráticas. Precisam de lembretes rápidos para não perder reuniões e negociações.
*   **Secretários(as) (Ex: Diego, 48 anos):** Necessitam orquestrar calendários, evitar conflitos de agenda e gerenciar o fluxo de informações corporativas de forma metódica.
*   **Empreendedores (Ex: Mariana, 35 anos):** Buscam automação, centralização de rotinas e clareza visual sobre a disponibilidade de tempo.

## 🚀 Funcionalidades Principais

*   🎙️ **Criação de Tarefas via Comando de Voz:** Fale com o Dexter e ele extrairá a intenção, o título, a data e o horário para agendar automaticamente.
*   🤖 **Dicas de Execução de Tarefas (IA):** O assistente fornece sugestões inteligentes e passos para resolver atividades complexas.
*   🎧 **Feedback em Áudio Natural:** Respostas geradas e faladas usando o serviço da ElevenLabs.
*   📋 **Quadro Kanban / Gestão Manual:** Controle total sobre a visualização, edição, exclusão e status das tarefas de forma manual quando preferir.
*   📊 **Planos SaaS (Monetização):**
    *   *Gratuito:* Limite de 6 tarefas/dia, 1 dica para 2 tarefas.
    *   *Mensal:* 12 tarefas/dia, 1 dica por tarefa.
    *   *Anual:* Sem limite de tarefas, 3 dicas por tarefa.
*   🔐 **Segurança e Privacidade:** Dados sensíveis guardados no dispositivo e credenciais criptografadas no banco Neon Postgres.

## 🛠️ Stack Tecnológico

### Front-end
*   **React Native** - Framework para construção do aplicativo mobile (iOS e Android).
*   **Figma** - Prototipação e design de interfaces.

### Back-end & Banco de Dados
*   **Python** - Lógica do servidor e intermediação de requisições.
*   **Neon Postgres** - Banco de dados relacional em nuvem.

### Inteligência Artificial & Automação
*   **ElevenLabs API** - Processamento de Linguagem Natural (Comandos) e Text-to-Speech (Voz da Assistente).
*   **n8n** - Automação de fluxos e integração de agentes.

### Ferramentas de Gestão
*   **Miro** - Organização de ideias, Modelagem de DER e Casos de Uso.
*   **GitHub / GitLab** - Versionamento de código e documentação.

## 📂 Arquitetura e Modelagem

Os artefatos de modelagem do projeto (como o Modelo Entidade-Relacionamento e os Diagramas de Casos de Uso em PlantUML) estão documentados nas pastas internas do repositório, garantindo rastreabilidade e facilidade de manutenção.

*(Insira aqui links para os diagramas caso estejam em pastas como `/docs`)*

## 🗓️ Cronograma de Execução

1.  **Etapa 1:** Planejamento e Levantamento de Requisitos (✅ Concluído)
2.  **Etapa 2:** Prototipação no Figma e Modelagem de Dados (DER) (✅ Concluído)
3.  **Etapa 3:** Desenvolvimento Back-end (Neon) e Front-end (React Native)
4.  **Etapa 4:** Integração de Agentes de IA e Testes Finais

---

> *"Para focar no que realmente precisa, se organize com Dexter (e sua irmã Deedee)."*
