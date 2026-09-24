import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { MenuBar } from '../utilidade/MenuBar';
import { AgendaList } from '../utilidade/AgendaList';
import { AgendaItem } from '../utilidade/AgendaForm';
import { AgendaDetalheScreen } from './AgendaDetalheScreen';
import { ScreenBackground } from './ScreenBackground';
import {
    buscarTarefasArquivadas,
    excluirTarefa,
    restaurarTarefa,
} from '../services/api';

type ArquivoScreenProps = {
    onBack: () => void;
    token: string | null;
};

export function ArquivoScreen({
    onBack,
    token,
}: ArquivoScreenProps) {
    const [agendas, setAgendas] = useState<AgendaItem[]>([]);
    const [agendaSelecionada, setAgendaSelecionada] =
        useState<AgendaItem | null>(null);

    async function carregarAgendas() {
        if (!token) {
            return;
        }

        try {
            const tarefas = await buscarTarefasArquivadas(token);

            const agendasArquivadas: AgendaItem[] = tarefas.map(
                (tarefa: any) => ({
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
                })
            );

            setAgendas(agendasArquivadas);
        } catch {
            Alert.alert(
                'Erro',
                'Não foi possível carregar as agendas arquivadas.'
            );
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

            setAgendaSelecionada(null);
            await carregarAgendas();

            Alert.alert('Sucesso', 'Agenda restaurada.');
        } catch {
            Alert.alert('Erro', 'Não foi possível restaurar a agenda.');
        }
    }

    async function excluirAgenda() {
        if (!token || !agendaSelecionada) {
            return;
        }

        try {
            await excluirTarefa(token, agendaSelecionada.id);

            setAgendaSelecionada(null);
            await carregarAgendas();

            Alert.alert(
                'Sucesso',
                'Agenda movida para os itens excluídos.'
            );
        } catch {
            Alert.alert('Erro', 'Não foi possível excluir a agenda.');
        }
    }

    /*
     * Este retorno precisa ficar depois dos hooks e das funções.
     * Ele substitui temporariamente a lista pela tela de detalhes.
     */
    if (agendaSelecionada) {
        return (
            <AgendaDetalheScreen
                agenda={agendaSelecionada}
                modo="arquivo"
                onBack={() => setAgendaSelecionada(null)}
                onRestaurar={restaurarAgenda}
                onExcluir={excluirAgenda}
            />
        );
    }

    return (
        <ScreenBackground>
            <MenuBar
                onBack={onBack}
                title="Arquivo"
            />

            <AgendaList
                agendas={agendas}
                onDetails={(agenda) => {
                    setAgendaSelecionada(agenda);
                }}
            />
        </ScreenBackground>
    );
}