# 🛠️ Stack Tecnológico e Integrações

Este documento mapeia as tecnologias, bibliotecas e serviços externos integrados ao ecossistema do Sistema Dexter (Front-end e Back-end).

## 1. Inteligência Artificial e Processamento
* **ElevenLabs:** Utilizada como o agente conversacional principal. Responsável por dar voz ao assistente e atuar como gerador inteligente de tarefas a partir das interações do usuário.
* **Groq:** Implementado como serviço transcritor (Speech-to-Text). Escolhido por ser leve, rápido e possuir melhor custo-benefício para converter os comandos de áudio do usuário em texto para processamento.

## 2. Banco de Dados e Hospedagem (Deploy)
* **Banco de Dados (Neon):** O sistema utiliza o PostgreSQL serverless hospedado no **Neon**. 
* **Back-end (Render):** A API (Node.js/FastAPI) está hospedada no serviço **Render**. 
  * *Nota de Arquitetura:* Devido ao comportamento *serverless* da camada gratuita do Render (que "dorme" por inatividade), o Front-end foi configurado para enviar requisições de *keep-alive* para mitigar atrasos de primeira resposta (Timeout).

## 3. Serviços de Comunicação e E-mail
* **Brevo (Antigo Sendinblue):** O serviço **Mailtrap** (usado inicialmente como sandbox) foi descontinuado em produção e substituído pelo **Brevo**.
* **Motivo:** O Render bloqueia portas SMTP padrão. O Brevo atua como serviço de envio de e-mails reais via SMTP validado.
* *Pendência futura:* Para evitar que os e-mails de recuperação de senha caiam na caixa de spam (Hard Bounce), é recomendada a aquisição de um domínio próprio (ex: `@dexterapp.com`).

## 4. Monitoramento e Observabilidade
* **Pino (Node.js):** Biblioteca de logger implementada no Back-end. Captura erros em tempo real do servidor e do aplicativo, estruturando-os em formato JSON e persistindo no banco de dados para facilitar o *debug* sem depender de relatos do usuário final.