# 📋 Engenharia de Requisitos, Personas e Backlog (Miro)

Este documento consolida as Histórias de Usuário, Personas, Critérios de Aceite (BDD) e o mapeamento de tarefas extraídos do quadro oficial de gestão visual (Miro) do **Projeto Dexter**.

---

## 👥 1. Personas Mapeadas

### 👔 Persona 01: Roberto (Gerente Comercial Tradicional)
* **Perfil e Dores:** Sofre de estresse crônico pelo receio constante de esquecer compromissos importantes perdidos em meio a dezenas de mensagens diárias. Possui resistência a ferramentas complexas que exigem muita digitação.
* **Necessidade (User Story):** *"Como Roberto, quero poder registrar meus afazeres e reuniões de forma simples e rápida enviando apenas um áudio, evitando a perda imediata de reuniões de negócios."*

### 🚀 Persona 02: Mariana (Empreendedora com Rotina Movimentada)
* **Perfil e Dores:** Lida com múltiplas demandas simultâneas que mudam de urgência ao longo do dia. Perde tempo precioso relendo listas extensas de tarefas para decidir o que fazer a seguir.
* **Necessidade (User Story):** *"Como uma empreendedora com uma rotina movimentada, quero que minha lista de tarefas do dia seja reordenada e atualizada automaticamente por nível de prioridade à medida que concluo cada atividade, poupando tempo e eliminando o risco de esquecer algo importante."*

---

## 🎯 2. Histórias de Usuário e Critérios de Aceite (BDD)

### US01 — Captura de Voz e Transcrição para Criação de Tarefas
**Ator Principal:** Roberto (Gestor)  
**Prioridade:** Alta | **Status:** Completo

**Critérios de Aceite (Acceptance Criteria):**
* **CA 1 (Presença do Botão de Microfone):** A tela de "Falar" deve conter um botão interativo com ícone de microfone posicionado na interface do Front-end, acompanhado da instrução *"Segure para Falar"*.
* **CA 2 (Sinalização Visual de Microfone Ativo):** Ao acionar o botão para iniciar a captação de voz, ele deve alterar seu estado visual (mudança de cor/animação) sinalizando que o áudio está sendo gravado, e desabilitar novas entradas enquanto o agente Dexter estiver processando ("pensando").
* **CA 3 (Permissão e Captura de Áudio):** O aplicativo deve solicitar e utilizar as permissões nativas de microfone do dispositivo móvel.
* **CA 4 (Economia de Tokens e Confirmação):** A tela de voz deve possuir um botão dedicado para envio de confirmação rápida ("Confirmado") e filtragem no *System Prompt* (ignorando verbos de comando como "CRIAR", "FAZER" no título), otimizando o consumo de tokens do serviço de transcrição e IA.
* **CA 5 (Persistência em Nuvem):** A IA deve interpretar corretamente a intenção do usuário e registrar a tarefa estruturada no banco de dados em nuvem (Neon PostgreSQL).

---

### US02 — Envio Manual de Pedidos por Texto
**Prioridade:** Alta | **Status:** Completo

**Critérios de Aceite (Acceptance Criteria):**
* **CA 1 (Presença do Botão):** A interface deve apresentar um botão visível e interativo para envio do pedido digitado.
* **CA 2 (Captura do Texto):** O componente deve capturar integralmente a string preenchida no campo de entrada/chat antes do disparo.
* **CA 3 (Feedback Visual de Envio):** Ao clicar no botão, a interface deve exibir sinalização visual clara (ícone de carregamento/spinner ou botão desabilitado temporariamente) indicando que a requisição está em andamento.
* **CA 4 e CA 5 (Integração com Endpoint REST):** O Front-end deve disparar a requisição HTTP enviando o payload em texto para a rota da API no Back-end, garantindo validação e persistência.

---

### US03 — Exibição de Dicas Geradas por IA na Tabela de Tarefas
**Prioridade:** Alta | **Status:** Completo

* **Cenário 1: Exibição da dica quando fornecida pela IA**
  * **Dado** que uma tarefa possui uma dica gerada pela IA disponível na resposta da API,
  * **Quando** a tabela/detalhes de tarefas for carregada no Front-end,
  * **Então** a dica de IA deve ser exibida no espaço dedicado correspondente com clareza visual.
* **Cenário 2: Comportamento quando não houver dica da IA**
  * **Dado** que uma tarefa não possui uma dica gerada pela IA (`null` ou vazio),
  * **Quando** a visualização for renderizada no Front-end,
  * **Então** o espaço deve ser ocultado adequadamente ou exibir um estado vazio (*placeholder*), sem quebrar o layout.
* **Cenário 3: Responsividade e adaptação do texto**
  * **Dado** que a dica da IA pode ter tamanhos de texto variados,
  * **Quando** o texto da dica for longo,
  * **Então** o layout deve acomodar o conteúdo com quebra de linha adequada sem sobrepor outros elementos da interface.

---

### US04 — Reordenação Automática de Tarefas por Prioridade
**Ator Principal:** Mariana (Empreendedora)  
**Prioridade:** Alta | **Status:** Completo

**Critérios de Aceite (Acceptance Criteria):**
* **CA 1 (Reordenação Imediata):** Ao marcar a tarefa atual como concluída/arquivada, o sistema atualiza a lista automaticamente, elevando a próxima tarefa de maior urgência para o topo (ordem do Vermelho para o Verde).
* **CA 2 (Visibilidade com Foco Principal):** Os cards exibem claramente o nível de prioridade e status de prazo (*Em atraso*, *Prazo próximo*, *Em dia*).
* **CA 3 (Regra de Priorização Clara):** O banco de dados relacional armazena tipo, data de início/fim, escala de prioridade e observações.
* **CA 4 (Ocultação de Tarefas Finalizadas):** Tarefas concluídas ou descartadas saem imediatamente da visualização principal da Agenda e são movidas para as abas "Arquivos" ou "Excluídos".
* **CA 5 (Contextualização de Cabeçalho):** Uma divisão visual entre o *header* e a listagem identifica explicitamente o contexto atual do card:
  * Na Agenda: *"Detalhes da tarefa Agendada"*
  * No Arquivo: *"Detalhes da tarefa Arquivada"*
  * Na Lixeira: *"Detalhes da tarefa Descartada"*

---

### US05 — Notificações Push no Dispositivo Móvel
**Prioridade:** Média/Alta | **Status:** Completo

* **Cenário 1: Recebimento e exibição**
  * **Dado** que o aplicativo está instalado no dispositivo móvel e possui permissão concedida,
  * **Quando** o sistema disparar uma notificação push de prazo,
  * **Então** a notificação deve aparecer na barra/menu superior de status do aparelho.
* **Cenário 2: Conteúdo da notificação**
  * **Dado** que uma notificação push foi disparada,
  * **Quando** exibida na barra superior,
  * **Então** deve conter o título, o cálculo de dias restantes/atraso e o ícone oficial do aplicativo.
* **Cenário 3: Interação e Redirecionamento**
  * **Dado** que a notificação está visível,
  * **Quando** o usuário tocar sobre ela,
  * **Então** o aplicativo deve abrir, redirecionar o usuário para a agenda e limpar o alerta visualizado.
* **Cenário 4: Tratamento de permissão negada**
  * **Dado** que o usuário desativou as permissões no sistema operacional ou não possui `PushToken`,
  * **Quando** a rotina de verificação rodar,
  * **Então** o disparo não deve gravar registros órfãos no banco nem causar travamentos no Back-end/Front-end.

---

## 📊 3. Métricas do Backlog e Roadmap Futuro

Do total de **36 itens de trabalho** planejados no Miro ao longo do semestre:
* **Concluídos (Done):** 33 itens (91,67% do escopo total entregue, incluindo 100% dos requisitos críticos de IA, CRUD, Autenticação, Banco Neon, Deploy no Render e Validação de E-mail Real via Brevo).
* **Backlog Futuro / Próxima Sprint (To Do):** 3 itens remanescentes mapeados para evolução contínua (PD2):
  1. **Testes de Carga e Estimativa de Custos (Prioridade Alta):** Submeter o aplicativo a uso real intensivo para mensurar o consumo médio diário de tokens (Groq e ElevenLabs) por usuário ativo.
  2. **Publicação Definitiva no Expo (Prioridade Média):** Subir a build final consolidada de produção após o congelamento de código da banca.
  3. **Efeito Sonoro Customizado (Prioridade Média):** Adicionar feedback auditivo próprio no disparo de notificações do aplicativo.