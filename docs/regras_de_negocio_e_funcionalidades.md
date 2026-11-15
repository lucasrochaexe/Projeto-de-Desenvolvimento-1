# 📋 Regras de Negócio e UX (User Experience)

Documentação das regras lógicas aplicadas ao fluxo de tarefas, segurança do usuário e disparos de notificações no aplicativo Dexter.

## 1. Gestão de Sessão e Segurança
* **Armazenamento Local Restrito:** O Front-end está estritamente proibido de salvar dados sensíveis locais (como e-mail ou senhas em texto puro).
* **Token de Acesso:** A sessão é mantida localmente através de um JWT (Token de verificação).
* **Manter Logado:** Implementada a funcionalidade para salvar o token em armazenamento seguro do dispositivo, eliminando a necessidade de login a cada abertura do app.
* **Auto-Logout:** Caso a API invalide o token ou retorne erro de autenticação, o aplicativo executa o *logout* automático.

## 2. Fluxo de Conclusão, Arquivamento e Lixeira
* **Fim da Tarefa (Botão Concluído):** O fluxo principal de encerramento exige que o usuário clique em "Concluído".
* **Pop-up de Decisão:** Ao concluir, o sistema abre um pop-up obrigatório questionando se o usuário deseja **Arquivar** ou **Excluir** a tarefa. (Os botões individuais soltos foram removidos para evitar confusão semântica).
* **Soft Delete (30 dias):** O sistema não possui exclusão imediata. Tarefas arquivadas ou excluídas não geram notificações e permanecem no banco de dados por 30 dias.
* **Cron Job de Limpeza:** Uma rotina automática no Back-end roda diariamente às 08:00h para limpar permanentemente arquivos excluídos há mais de 7 dias e atualizar os status de tarefas vencidas.

## 3. Sistema de Notificações Push (Alertas de Prazo)
A mecânica de notificações respeita limites para evitar o envio massivo (spam) ao usuário:
* O sistema envia no máximo **uma notificação por tarefa por dia**.
* O serviço ignora explicitamente tarefas arquivadas ou excluídas.
* As notificações não são persistidas no banco caso o usuário não possua um *PushToken* válido.

**Lógica de Prazos (Sistema de Semáforo):**
* 🟢 **Em dia (Verde):** Restam entre 15 e 7 dias. (Mensagem gerada: *"Faltam X dias para o prazo"*).
* 🟡 **Atenção (Amarelo):** Restam entre 6 e 1 dia. (Mensagem gerada: *"O prazo vence hoje / Prazo próximo do limite"*).
* 🔴 **Atrasado (Vermelho):** 0 dias ou menos. (Mensagem gerada: *"A tarefa está atrasada há X dias"*).