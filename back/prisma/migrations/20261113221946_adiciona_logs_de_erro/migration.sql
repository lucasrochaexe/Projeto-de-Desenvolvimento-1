/*
  Warnings:

  - Added the required column `onde` to the `logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "logs" ADD COLUMN     "erro" TEXT,
ADD COLUMN     "metodo" TEXT,
ADD COLUMN     "nivel" TEXT NOT NULL DEFAULT 'error',
ADD COLUMN     "onde" TEXT NOT NULL,
ADD COLUMN     "rota" TEXT,
ADD COLUMN     "sessao" TEXT,
ADD COLUMN     "stack" TEXT,
ADD COLUMN     "usuarioNome" TEXT;

-- CreateIndex
CREATE INDEX "logs_criadoEm_idx" ON "logs"("criadoEm");

-- CreateIndex
CREATE INDEX "logs_usuario_id_idx" ON "logs"("usuario_id");
