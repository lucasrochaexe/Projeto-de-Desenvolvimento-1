import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AgendaItem } from '../utilidade/AgendaForm';
import { MenuBar } from '../utilidade/MenuBar';
import { ScreenBackground } from './ScreenBackground';
import { Alert } from 'react-native';

type AgendaDetalheScreenProps = {
  agenda: AgendaItem;
  modo: 'ativa' | 'arquivo' | 'excluidos';
  onBack: () => void;
  onEditar?: () => void;
  onArquivar?: () => void;
  onExcluir: () => void;
  onRestaurar?: () => void;
};

export function AgendaDetalheScreen({
  agenda,
  modo,
  onBack,
  onEditar,
  onArquivar,
  onExcluir,
  onRestaurar,
}: AgendaDetalheScreenProps) {
  const status = modo === 'arquivo'
  ? {
      label: 'Arquivada',
      style: styles.statusUnknown,
    }
  : modo === 'excluidos'
    ? {
        label: 'Excluída',
        style: styles.statusLate,
      }
    : getStatusPrazo(agenda.fim);

    /* define cor do card de acordo com o status */
  const cardStatusStyle = modo === 'arquivo'
    ? styles.containerArchived
    : modo === 'excluidos'
      ? styles.containerDeleted
      : null;

  const arquivar = () => {
    Alert.alert(
      'Arquivar agendamento',
      'Tem certeza que deseja arquivar este agendamento?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Arquivar',
          style: 'destructive',
          onPress: () => {
            onArquivar && onArquivar();
          },
        },
      ]
    );
  };

  const excluir = () => {
    Alert.alert(
      'Excluir Tarefa',
      'Tem certeza que deseja excluir esta tarefa?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            onExcluir && onExcluir();
          },
        },
      ]
    );
  };

  return (
    <ScreenBackground>
      <MenuBar onBack={onBack} title="Detalhes da Tarefa" />

      <View style={[styles.container, cardStatusStyle]}>
        <Text style={styles.title}>{agenda.titulo}</Text>
        <Text style={[styles.status, status.style]}>
          {status.label}
        </Text>
        <Text style={styles.label}>Data de início</Text>
        <Text style={styles.value}>{agenda.inicio || 'Não informada'}</Text>
        <Text style={styles.label}>Data final</Text>
        <Text style={styles.value}>{agenda.fim || 'Não informada'}</Text>
        <Text style={styles.label}>Descritivo</Text>
        <Text style={styles.description}>{agenda.obs || 'Nenhum descritivo informado.'}</Text>

        {modo === 'ativa' && (
          <>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={onEditar}
            >
              <Text style={styles.buttonText}>Alterar</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={arquivar}   // chama a função com confirmação
            >
              <Text style={styles.buttonText}>Arquivar</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.deleteButton,
                pressed && styles.deleteButtonPressed,
              ]}
              onPress={excluir}   // agora chama a função que mostra o Alert
            >
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </Pressable>
          </>
        )}

        {modo === 'arquivo' && (
          <>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={onRestaurar}
            >
              <Text style={styles.buttonText}>Restaurar</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.deleteButton,
                pressed && styles.deleteButtonPressed,
              ]}
              onPress={excluir}   // agora chama a função que mostra o Alert
            >
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </Pressable>
          </>
        )}

        {modo === 'excluidos' && (
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={onRestaurar}
          >
            <Text style={styles.buttonText}>Restaurar</Text>
          </Pressable>
        )}
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(39, 35, 31, 0.10)',
    borderRadius: 18,
    borderWidth: 1,
    elevation: 3,
    marginHorizontal: 2,
    marginTop: 16,
    padding: 20,
    shadowColor: '#27231F',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.10,
    shadowRadius: 6,
  },
  containerArchived: {
    backgroundColor: '#EEF6FC',
    borderColor: '#C7DCEB',
  },
  containerDeleted: {
    backgroundColor: '#e1e0e0',
    borderColor: '#D5D9DE',
  },
  title: {
    color: '#191919',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
  },
  status: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusOnTime: {
    backgroundColor: '#E7F5EC',
    color: '#237A43',
  },
  statusSoon: {
    backgroundColor: '#FFF6D9',
    color: '#8A6500',
  },
  statusLate: {
    backgroundColor: '#FDE9E7',
    color: '#B42318',
  },
  statusUnknown: {
    backgroundColor: '#F2F3F5',
    color: '#5F666D',
  },
  label: {
    color: '#555555',
    fontSize: 12,
    marginTop: 12,
  },
  value: {
    color: '#4B4B4B',
    fontSize: 16,
  },
  description: {
    color: '#191919',
    fontSize: 15,
    minHeight: 100,
    marginTop: 4,
    lineHeight: 22,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#F2F3F5',
    borderColor: '#D9DDE2',
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 12,
    minHeight: 46,
    paddingHorizontal: 16,
  },
  buttonPressed: {
    backgroundColor: '#E5E7EB',
  },
  deleteButton: {
    alignItems: 'center',
    backgroundColor: '#FFF1F0',
    borderColor: '#E7A8A3',
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 12,
    minHeight: 46,
    paddingHorizontal: 16,
  },
  deleteButtonPressed: {
    backgroundColor: '#FADBD8',
  },
  buttonText: {
    color: '#3E444B',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  deleteButtonText: {
    color: '#B42318',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});

function getStatusPrazo(data: string): {
  label: string;
  style: typeof styles.statusOnTime;
} {
  if (!data) {
    return { label: 'Prazo não informado', style: styles.statusUnknown };
  }

  const [dia, mes, ano] = data.split('/').map(Number);
  const prazo = new Date(ano, mes - 1, dia);
  prazo.setHours(23, 59, 59, 999);

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const diferencaEmDias = Math.ceil(
    (prazo.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diferencaEmDias < 0) {
    return { label: 'Em atraso', style: styles.statusLate };
  }

  if (diferencaEmDias <= 7) {
    return { label: 'Prazo próximo', style: styles.statusSoon };
  }

  return { label: 'Em dia', style: styles.statusOnTime };
}