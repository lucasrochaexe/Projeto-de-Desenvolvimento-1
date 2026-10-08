import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { MenuBar } from '../utilidade/MenuBar';
import { AgendaItem } from '../utilidade/AgendaForm';
import { AgendaList } from '../utilidade/AgendaList';
import { buscarTarefasExcluidas, restaurarTarefa } from '../services/api';
import { AgendaDetalheScreen } from './AgendaDetalheScreen';
import { ScreenBackground } from './ScreenBackground';
import {Text} from 'react-native';

type ExcluidosScreenProps = {
  onBack: () => void;
  token: string | null;
};

export function ExcluidosScreen({ onBack, token }: ExcluidosScreenProps) {
  const [agendas, setAgendas] = useState<AgendaItem[]>([]);
  const [agendaSelecionada, setAgendaSelecionada] = useState<AgendaItem | null>(null);

  async function carregarAgendas() {
    if (!token) {
      return;
    }

    try {
      const tarefas = await buscarTarefasExcluidas(token);

      setAgendas(tarefas.map((tarefa: any) => ({
        id: tarefa.id,
        titulo: tarefa.titulo,
        inicio: tarefa.prazoInic
          ? new Date(tarefa.prazoInic).toLocaleDateString('pt-BR')
          : '',
        fim: tarefa.prazoFim
          ? new Date(tarefa.prazoFim).toLocaleDateString('pt-BR')
          : '',
        obs: tarefa.descricao || '',
        prioridade: tarefa.prioridade === 'ALTA'
          ? 'urgente'
          : tarefa.prioridade === 'MEDIA'
            ? 'importante'
            : 'media',
      })));
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar as agendas excluídas.');
    }
  }

  useEffect(() => {
    carregarAgendas();
  }, [token]);

  async function restaurarAgenda() {
    if (!token || !agendaSelecionada) {
      return;
    }

    try {
      await restaurarTarefa(token, agendaSelecionada.id);
      setAgendas((agendasAtuais) =>
        agendasAtuais.filter(
          (agenda) => agenda.id !== agendaSelecionada.id
        )
      );
      setAgendaSelecionada(null);
      Alert.alert('Sucesso', 'Agenda restaurada.');
    } catch {
      Alert.alert('Erro', 'Não foi possível restaurar a agenda.');
    }
  }

  if (agendaSelecionada) {
    return (
      <AgendaDetalheScreen
        agenda={agendaSelecionada}
        modo="excluidos"
        onBack={() => setAgendaSelecionada(null)}
        onRestaurar={restaurarAgenda}
        onExcluir={() => {}}
      />
    );
  }

  return (
    <ScreenBackground>
      <MenuBar onBack={onBack} title="Itens Excluídos" />
      <Text style={{ textAlign: 'center', marginBottom: 16, marginTop: 16, marginRight: 16, marginLeft: 16, color: '#858383', width: '90%' }}>Lista de tarefas excluídas - permanentemente após 7 dias</Text>
      <AgendaList
        agendas={agendas}
        compact
        status="excluidos"
        onDetails={(agenda) => setAgendaSelecionada(agenda)}
      />
    </ScreenBackground>
  );
}