import { prisma } from '../../lib/prisma';
import { enviarPushParaUsuario } from './pushNotifications';

const TIME_ZONE = 'America/Sao_Paulo';

let verificacaoEmAndamento = false;

function obterDataLocalAtual() {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const valores = Object.fromEntries(
    partes
      .filter(({ type }) => type !== 'literal')
      .map(({ type, value }) => [type, value]),
  );

  return `${valores.year}-${valores.month}-${valores.day}`;
}

function obterIntervaloDoDia() {
  const dataLocal = obterDataLocalAtual();
  const inicio = new Date(`${dataLocal}T00:00:00-03:00`);
  const fim = new Date(inicio.getTime() + 24 * 60 * 60 * 1000);

  return { inicio, fim };
}

function obterChaveDeData(data: Date) {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(data);

  const valores = Object.fromEntries(
    partes
      .filter(({ type }) => type !== 'literal')
      .map(({ type, value }) => [type, value]),
  );

  return `${valores.year}-${valores.month}-${valores.day}`;
}

function calcularMensagemDoPrazo(prazoFim: Date) {
  const hoje = new Date(`${obterDataLocalAtual()}T00:00:00Z`);
  const prazo = new Date(`${obterChaveDeData(prazoFim)}T00:00:00Z`);
  const dias = Math.round((prazo.getTime() - hoje.getTime()) / (24 * 60 * 60 * 1000));

  if (dias > 1) {
    return `Faltam ${dias} dias para o prazo.`;
  }

  if (dias === 1) {
    return 'Falta 1 dia para o prazo.';
  }

  if (dias === 0) {
    return 'O prazo vence hoje.';
  }

  const diasEmAtraso = Math.abs(dias);
  return diasEmAtraso === 1
    ? 'A tarefa está atrasada há 1 dia.'
    : `A tarefa está atrasada há ${diasEmAtraso} dias.`;
}

export async function verificarNotificacoesDiarias(usuarioId?: string) {
  if (verificacaoEmAndamento) {
    return 0;
  }

  verificacaoEmAndamento = true;

  try {
    const { inicio, fim } = obterIntervaloDoDia();
    const tarefas = await prisma.tarefa.findMany({
      where: {
        ...(usuarioId ? { usuarioId } : {}),
        deletadoEm: null,
        arquivadoEm: null,
        status: { not: 'CONCLUIDA' },
        prazoFim: { not: null },
      },
      select: {
        id: true,
        usuarioId: true,
        titulo: true,
        prazoFim: true,
      },
    });

    if (tarefas.length === 0) {
      return 0;
    }

    const notificacoesDeHoje = await prisma.notificacao.findMany({
      where: {
        tarefaId: { in: tarefas.map((tarefa) => tarefa.id) },
        data: { gte: inicio, lt: fim },
      },
      select: { tarefaId: true },
    });
    const tarefasNotificadas = new Set(
      notificacoesDeHoje.map((notificacao) => notificacao.tarefaId),
    );

    let totalEnviado = 0;

    for (const tarefa of tarefas) {
      if (!tarefa.prazoFim || tarefasNotificadas.has(tarefa.id)) {
        continue;
      }

      const enviado = await enviarPushParaUsuario(
        tarefa.usuarioId,
        'Atualização da tarefa',
        `"${tarefa.titulo}": ${calcularMensagemDoPrazo(tarefa.prazoFim)}`,
        { tarefaId: tarefa.id },
      );

      if (!enviado) {
        continue;
      }

      await prisma.notificacao.create({
        data: {
          usuarioId: tarefa.usuarioId,
          tarefaId: tarefa.id,
          vencimento: tarefa.prazoFim,
        },
      });

      totalEnviado += 1;
    }

    return totalEnviado;
  } finally {
    verificacaoEmAndamento = false;
  }
}
