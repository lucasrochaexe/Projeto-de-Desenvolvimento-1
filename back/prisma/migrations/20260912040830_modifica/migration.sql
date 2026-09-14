-- CreateEnum
CREATE TYPE "Plano" AS ENUM ('GRATUITO', 'MENSAL', 'ANUAL');

-- CreateEnum
CREATE TYPE "NivelAcesso" AS ENUM ('ADMIN', 'USUARIO');

-- CreateEnum
CREATE TYPE "Pagamento" AS ENUM ('PIX', 'CARTAO_DEBITO', 'CARTAO_CREDITO', 'GOOGLE_PLAY');

-- CreateEnum
CREATE TYPE "StatusConta" AS ENUM ('ATIVA', 'PENDENTE', 'BANIDA');

-- CreateEnum
CREATE TYPE "Prioridade" AS ENUM ('ALTA', 'MEDIA', 'BAIXA');

-- CreateEnum
CREATE TYPE "TipoToken" AS ENUM ('ATUALIZAR', 'REDEFINIR_SENHA', 'VALIDACAO_EMAIL');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "plano" "Plano" NOT NULL DEFAULT 'GRATUITO',
    "pagamento" "Pagamento",
    "statusConta" "StatusConta" NOT NULL DEFAULT 'PENDENTE',
    "nivelAcesso" "NivelAcesso" NOT NULL DEFAULT 'USUARIO',

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarefas" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "prazoInic" TIMESTAMP(3),
    "prazoFim" TIMESTAMP(3),
    "prioridade" "Prioridade" NOT NULL DEFAULT 'MEDIA',
    "dicas" TEXT,

    CONSTRAINT "tarefas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificacoes" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "tarefaId" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vencimento" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "tipoToken" "TipoToken" NOT NULL,
    "criado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expira" TIMESTAMP(3) NOT NULL,
    "revogado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs" (
    "id" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tarefa_id" TEXT,
    "notificacao_id" TEXT,
    "usuario_id" TEXT,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_token_key" ON "tokens"("token");

-- AddForeignKey
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_tarefaId_fkey" FOREIGN KEY ("tarefaId") REFERENCES "tarefas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_tarefa_id_fkey" FOREIGN KEY ("tarefa_id") REFERENCES "tarefas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_notificacao_id_fkey" FOREIGN KEY ("notificacao_id") REFERENCES "notificacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
