import { useEffect, useState } from 'react';
import { MenuBar } from '../utilidade/MenuBar';
import { AgendaForm, AgendaItem } from '../utilidade/AgendaForm';
import { AgendaList } from '../utilidade/AgendaList';
import { ScreenBackground } from './ScreenBackground';
import { Alert } from 'react-native';
import { AgendaDetalheScreen } from './AgendaDetalheScreen';
import {
    arquivarTarefa,
    atualizarTarefa,
    buscarTarefas,
    criarTarefa,
    excluirTarefa,
} from '../services/api';

type AgendaScreenProps = {
  onBack: () => void;
  token: string | null;
};

function converterPrioridade(
  prioridade: AgendaItem['prioridade']
): 'ALTA' | 'MEDIA' | 'BAIXA' {
  if (prioridade === 'urgente') {
    return 'ALTA';
  }

  if (prioridade === 'importante') {
    return 'MEDIA';
  }

  return 'BAIXA';
}

function converterParaISO(data: string): string | null {
  if (!data) {
    return null;
  }

  const [dia, mes, ano] = data.split('/').map(Number);
  const dataConvertida = new Date(ano, mes - 1, dia);

  return dataConvertida.toISOString();
}

export function AgendaScreen({ onBack, token }: AgendaScreenProps) {
  const [agendaSelecionada, setAgendaSelecionada] = useState<AgendaItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [agendas, setAgendas] = useState<AgendaItem[]>([]);

  useEffect(() => {
    async function carregarAgendas() {
      if (!token) {
        return;
      }

      try {
        const tarefas = await buscarTarefas(token);

        const agendasDoBanco: AgendaItem[] = tarefas.map((tarefa: any) => ({
          id: tarefa.id,
          titulo: tarefa.titulo,
          inicio: tarefa.prazoInic
            ? new Date(tarefa.prazoInic).toLocaleDateString('pt-BR')
            : '',
          fim: tarefa.prazoFim
            ? new Date(tarefa.prazoFim).toLocaleDateString('pt-BR')
            : '',
          obs: tarefa.descricao || '',
          prioridade:
            tarefa.prioridade === 'ALTA'
              ? 'urgente'
              : tarefa.prioridade === 'MEDIA'
                ? 'importante'
                : 'media',
        }));

        setAgendas(agendasDoBanco);
      } catch {
        Alert.alert('Erro', 'Não foi possível carregar suas tarefas.');
      }
    }

    carregarAgendas();
  }, [token]);

  const handleAdd = () => setShowForm(true);

  const handleConfirmAdd = async (newAgenda: Omit<AgendaItem, 'id'>) => {
    if (!token) {
      Alert.alert('Sessão expirada', 'Faça login novamente.');
      return;
    }

    try {
      const tarefaCriada = await criarTarefa(token, {
        titulo: newAgenda.titulo.trim(),
        descricao: newAgenda.obs.trim() || null,
        prioridade: converterPrioridade(newAgenda.prioridade),
        status: 'EM_ANDAMENTO',
        prazoInic: converterParaISO(newAgenda.inicio),
        prazoFim: converterParaISO(newAgenda.fim),
        dicas: null,
      });

      setAgendas((agendasAtuais) => [
        ...agendasAtuais,
        {
          id: tarefaCriada.id,
          titulo: tarefaCriada.titulo,
          inicio: newAgenda.inicio,
          fim: newAgenda.fim,
          obs: tarefaCriada.descricao || '',
          prioridade: newAgenda.prioridade,
        },
      ]);

      setShowForm(false);
      Alert.alert('Sucesso', 'Tarefa salva na agenda.');
    } catch (error) {
      const mensagem = error instanceof Error
        ? error.message
        : 'Não foi possível salvar a tarefa.';

      Alert.alert('Erro ao salvar', mensagem);
    }
  };

  const confirmarEdicao = async (dados: Omit<AgendaItem, 'id'>) => {
    if (!token || !agendaSelecionada) {
      return;
    }

    try {
      await atualizarTarefa(token, agendaSelecionada.id, {
        titulo: dados.titulo.trim(),
        descricao: dados.obs.trim() || null,
        prioridade: converterPrioridade(dados.prioridade),
        prazoInic: converterParaISO(dados.inicio),
        prazoFim: converterParaISO(dados.fim),
      });

      const agendaAtualizada: AgendaItem = {
        id: agendaSelecionada.id,
        ...dados,
      };

      setAgendas((agendasAtuais) =>
        agendasAtuais.map((agenda) =>
          agenda.id === agendaAtualizada.id ? agendaAtualizada : agenda
        )
      );
      setAgendaSelecionada(agendaAtualizada);
      setShowForm(false);
      Alert.alert('Sucesso', 'Agenda alterada.');
    } catch {
      Alert.alert('Erro', 'Não foi possível alterar a agenda.');
    }
  };

  const arquivarAgenda = async () => {
    if (!token || !agendaSelecionada) {
      return;
    }

    try {
      await arquivarTarefa(token, agendaSelecionada.id);
      setAgendas((agendasAtuais) =>
        agendasAtuais.filter((agenda) => agenda.id !== agendaSelecionada.id)
      );
      setAgendaSelecionada(null);
      Alert.alert('Sucesso', 'Agenda arquivada.');
    } catch {
      Alert.alert('Erro', 'Não foi possível arquivar a agenda.');
    }
  };

  const excluirAgenda = async () => {
    if (!token || !agendaSelecionada) {
      return;
    }

    try {
      await excluirTarefa(token, agendaSelecionada.id);
      setAgendas((agendasAtuais) =>
        agendasAtuais.filter((agenda) => agenda.id !== agendaSelecionada.id)
      );
      setAgendaSelecionada(null);
      Alert.alert('Sucesso', 'Agenda movida para os itens excluídos.');
    } catch {
      Alert.alert('Erro', 'Não foi possível excluir a agenda.');
    }
  };

  if (showForm) {
    return (
      <ScreenBackground>
        <MenuBar
          onBack={() => setShowForm(false)}
          title={agendaSelecionada ? 'Alterar agenda' : 'Nova agenda'}
        />
        <AgendaForm
          initialAgenda={agendaSelecionada ?? undefined}
          onConfirm={agendaSelecionada ? confirmarEdicao : handleConfirmAdd}
          onCancel={() => setShowForm(false)}
        />
      </ScreenBackground>
    );
  }

  if (agendaSelecionada) {
    return (
      <AgendaDetalheScreen
        agenda={agendaSelecionada}
        modo="ativa"
        onBack={() => setAgendaSelecionada(null)}
        onEditar={() => setShowForm(true)}
        onArquivar={arquivarAgenda}
        onExcluir={excluirAgenda}
      />
    );
  }

  return (
    <ScreenBackground>
      <MenuBar onBack={onBack} title="Agenda" showAdd={true} onAdd={handleAdd} />
      <AgendaList
        agendas={agendas}
        onDetails={(agenda) => setAgendaSelecionada(agenda)}
      />
    </ScreenBackground>
  );
}
