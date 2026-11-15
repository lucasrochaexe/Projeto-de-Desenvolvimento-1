# 🐛 Registro de Bugs e Soluções (Troubleshooting)

Histórico de problemas técnicos de alta severidade encontrados durante o desenvolvimento e os caminhos adotados para resolução.

### 1. Erro de Push Notifications (ExpoNullPointer)
* **Sintoma:** O app disparava o erro `Call to function 'ExpoNotificationChannelManager.setNotificationChannelAsync' has been rejected. Caused by: java.lang.NullPointerException`.
* **Causa:** Falha no módulo Android do Expo (em `App.tsx:108`), que não encontrava a referência nula de canais.
* **Status:** Monitorado através dos logs estruturados do *Pino*.

### 2. Conflito de Versionamento do Expo (v57 -> v58)
* **Sintoma:** Aplicativo parou de compilar e invalidou toda a estrutura local.
* **Causa:** Atualização forçada da versão 57 para a 58 do Expo, quebrando dependências da `node_modules` e `package.json`.
* **Solução:** Reinstalação de dependências e configuração dos dispositivos de teste com a desativação expressa de "Atualizações Automáticas" para o aplicativo do Expo Go.

### 3. Instabilidade de Timeout no Áudio (IA)
* **Sintoma:** Disparo de 4 erros seguidos quase simultâneos ao tentar processar o áudio no Front-end.
* **Causa:** Incompatibilidade entre o tempo de resposta da API hospedada (Render) com a requisição do aplicativo. O aplicativo entrava em *timeout* e lançava o erro instantes antes de o Back-end devolver a resposta processada (transcrição/áudio).
* **Solução Proposta:** Implementação de um atraso (*delay* de ~5 segundos) no *timeout* da requisição no lado do Front-end para compensar a latência do servidor e processamento de IA.

### 4. Loop no Fluxo de Arquivamento (Resolvido)
* **Sintoma:** Impossibilidade de devolver uma tarefa para a tela principal (Agenda).
* **Causa:** Havia dois botões "restaurar" duplicados no CRUD que causavam conflito de estado.
* **Solução:** Otimização da tela de detalhes da tarefa, centralizando a lógica em um botão único.