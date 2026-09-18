-- CreateEnum
CREATE TYPE "StatusTarefa" AS ENUM ('EM_ANDAMENTO', 'CONCLUIDA', 'EM_ATRASO');

-- AlterTable
ALTER TABLE "tarefas" ADD COLUMN     "status" "StatusTarefa" NOT NULL DEFAULT 'EM_ANDAMENTO';
