import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MenuBar } from '../utilidade/MenuBar';
import {
  buscarNotificacoes,
  limparNotificacoes,
  marcarNotificacaoComoVisualizada,
} from '../services/api';
import { ScreenBackground } from './ScreenBackground';

type Notificacao = {
  id: string;
  tarefaId: string;
  vencimento: string;
  tarefa: {
    id: string;
    titulo: string;
    descricao: string | null;
    prazoInic: string | null;
    prazoFim: string | null;
    prioridade: 'ALTA' | 'MEDIA' | 'BAIXA';
    status: string;
  };
};

type NotificaScreenProps = {
  onBack: () => void;
  onOpenAgenda: (agendaId: string) => void;
  token: string | null;
};

type StatusPrazo = {
  texto: string;
  cor: string;
  fundo: string;
};

export function NotificaScreen({
  onBack,
  onOpenAgenda,
  token,
}: NotificaScreenProps) {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarNotificacoes = useCallback(async () => {
    if (!token) {
      setCarregando(false);
      return;
    }

    try {
      const dados = await buscarNotificacoes(token);
      setNotificacoes(dados);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar as notificações.');
    } finally {
      setCarregando(false);
    }
  }, [token]);

  useEffect(() => {
    carregarNotificacoes();
  }, [carregarNotificacoes]);

  async function abrirDetalhes(notificacao: Notificacao) {
    if (!token) {
      return;
    }

    try {
      await marcarNotificacaoComoVisualizada(token, notificacao.id);
      setNotificacoes((atuais) =>
        atuais.filter((item) => item.id !== notificacao.id)
      );
      onOpenAgenda(notificacao.tarefaId);
    } catch {
      Alert.alert('Erro', 'Não foi possível abrir a agenda.');
    }
  }

  async function limparTodas() {
    if (!token) {
      return;
    }

    try {
      await limparNotificacoes(token);
      setNotificacoes([]);
    } catch {
      Alert.alert('Erro', 'Não foi possível limpar as notificações.');
    }
  }

  return (
    <ScreenBackground>
      <MenuBar onBack={onBack} title="Notificações" />

      <Text style={{ textAlign: 'center', marginBottom: 16, marginTop: 16, color: '#858383' }}>Notificações de tarefas diarias</Text>
      <View style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {!carregando && notificacoes.length === 0 && (
            <Text style={styles.emptyText}>
              Você não possui notificações no momento.
            </Text>
          )}

          {notificacoes.map((notificacao) => {
            const status = calcularStatusPrazo(notificacao.vencimento);

            return (
              <View
                key={notificacao.id}
                style={[
                  styles.card,
                  { borderLeftColor: status.cor },
                ]}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {notificacao.tarefa.titulo}
                  </Text>
                  <View
                    style={[
                      styles.status,
                      { backgroundColor: status.fundo },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: status.cor }]}>
                      {status.texto}
                    </Text>
                  </View>
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.detailsButton,
                    pressed && styles.detailsButtonPressed,
                  ]}
                  onPress={() => abrirDetalhes(notificacao)}
                >
                  <Text style={styles.detailsButtonText}>Detalhes</Text>
                </Pressable>
              </View>
            );
          })}
        </ScrollView>

        {notificacoes.length > 0 && (
          <Pressable
            style={({ pressed }) => [
              styles.clearButton,
              pressed && styles.clearButtonPressed,
            ]}
            onPress={limparTodas}
          >
            <Text style={styles.clearButtonText}>Limpar notificações</Text>
          </Pressable>
        )}
      </View>
    </ScreenBackground>
  );
}

function calcularStatusPrazo(data: string): StatusPrazo {
  const prazo = new Date(data);
  const hoje = new Date();

  prazo.setHours(0, 0, 0, 0);
  hoje.setHours(0, 0, 0, 0);

  const dias = Math.ceil(
    (prazo.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (dias <= 0) {
    return {
      texto: dias === 0
        ? 'Em atraso'
        : `Atrasada há ${Math.abs(dias)} ${Math.abs(dias) === 1 ? 'dia' : 'dias'}`,
      cor: '#B42318',
      fundo: '#FDE9E7',
    };
  }

  if (dias < 7) {
    return {
      texto: `Faltam ${dias} ${dias === 1 ? 'dia' : 'dias'}`,
      cor: '#8A6500',
      fundo: '#FFF6D9',
    };
  }

  return {
    texto: `Faltam ${dias} ${dias === 1 ? 'dia' : 'dias'}`,
    cor: '#237A43',
    fundo: '#E7F5EC',
  };
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  clearButton: {
    alignItems: 'center',
    backgroundColor: '#D5A23A',
    borderRadius: 11,
    marginBottom: 28,
    marginTop: 10,
    paddingVertical: 13,
  },
  clearButtonPressed: {
    backgroundColor: '#B98A2B',
  },
  clearButtonText: {
    color: '#2B2520',
    fontSize: 14,
    fontWeight: '700',
  },
  list: {
    paddingBottom: 8,
    paddingTop: 14,
  },
  card: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomRightRadius: 14,
    borderColor: 'rgba(39, 35, 31, 0.10)',
    borderLeftWidth: 6,
    borderRadius: 14,
    borderTopRightRadius: 14,
    borderWidth: 1,
    elevation: 2,
    flexDirection: 'row',
    marginBottom: 12,
    minHeight: 100,
    paddingHorizontal: 14,
    shadowColor: '#27231F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardContent: {
    flex: 1,
    paddingVertical: 14,
  },
  cardTitle: {
    color: '#27231F',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 9,
  },
  status: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  detailsButton: {
    backgroundColor: '#F7F8F9',
    borderColor: '#C9CED4',
    borderRadius: 11,
    borderWidth: 1,
    marginLeft: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  detailsButtonPressed: {
    backgroundColor: '#E5E7EB',
  },
  detailsButtonText: {
    color: '#3E444B',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyText: {
    color: '#6B6B6B',
    fontSize: 15,
    paddingHorizontal: 20,
    paddingTop: 150,
    textAlign: 'center',
  },
});
