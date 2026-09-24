import { useEffect, useState } from 'react';
import { MenuBar } from '../utilidade/MenuBar';
import { AgendaForm, AgendaItem } from '../utilidade/AgendaForm';
import { AgendaList } from '../utilidade/AgendaList';
import { ScreenBackground } from './ScreenBackground';
import { criarTarefa, buscarTarefas } from '../services/api';
import { Alert } from 'react-native';

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
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar suas tarefas.');
    }
  }

  carregarAgendas();
  }, [token]);
  const handleAdd = () => setShowForm(true);

  const handleConfirmAdd = async (newAgenda: AgendaItem) => {
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
    const mensagem =
      error instanceof Error
        ? error.message
        : 'Não foi possível salvar a tarefa.';

    Alert.alert('Erro ao salvar', mensagem);
  }
};

  return (
    <ScreenBackground>
      <MenuBar onBack={onBack} title="Agenda" showAdd={true} onAdd={handleAdd} />
      {showForm ? (
        <AgendaForm onConfirm={handleConfirmAdd} onCancel={() => setShowForm(false)} />
      ) : (
        <AgendaList agendas={agendas} />
      )}
    </ScreenBackground>
  );
}
