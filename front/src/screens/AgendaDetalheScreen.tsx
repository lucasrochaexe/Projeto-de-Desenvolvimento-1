import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AgendaItem } from '../utilidade/AgendaForm';
import { MenuBar } from '../utilidade/MenuBar';
import { ScreenBackground } from './ScreenBackground';

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
  return (
    <ScreenBackground>
      <MenuBar onBack={onBack} title="Detalhes" />

      <View style={styles.container}>
        <Text style={styles.title}>{agenda.titulo}</Text>
        <Text style={styles.label}>Data de início</Text>
        <Text style={styles.value}>{agenda.inicio || 'Não informada'}</Text>
        <Text style={styles.label}>Data final</Text>
        <Text style={styles.value}>{agenda.fim || 'Não informada'}</Text>
        <Text style={styles.label}>Descritivo</Text>
        <Text style={styles.description}>{agenda.obs || 'Nenhum descritivo informado.'}</Text>

        {modo === 'ativa' && (
          <>
            <Pressable style={styles.button} onPress={onEditar}>
              <Text style={styles.buttonText}>Alterar</Text>
            </Pressable>
            <Pressable style={styles.archiveButton} onPress={onArquivar}>
              <Text style={styles.buttonText}>Arquivar</Text>
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={onExcluir}>
              <Text style={styles.buttonText}>Excluir</Text>
            </Pressable>
          </>
        )}

        {modo === 'arquivo' && (
          <>
            <Pressable style={styles.button} onPress={onRestaurar}>
              <Text style={styles.buttonText}>Restaurar</Text>
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={onExcluir}>
              <Text style={styles.buttonText}>Excluir</Text>
            </Pressable>
          </>
        )}

        {modo === 'excluidos' && (
          <Pressable style={styles.button} onPress={onRestaurar}>
            <Text style={styles.buttonText}>Restaurar</Text>
          </Pressable>
        )}
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D9D9D9',
    marginTop: 16,
    padding: 18,
  },
  title: {
    color: '#191919',
    fontSize: 22,
    marginBottom: 24,
  },
  label: {
    color: '#555555',
    fontSize: 12,
    marginTop: 12,
  },
  value: {
    color: '#191919',
    fontSize: 16,
  },
  description: {
    color: '#191919',
    fontSize: 15,
    minHeight: 100,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#559492',
    marginTop: 12,
    padding: 12,
  },
  archiveButton: {
    backgroundColor: '#D5A23A',
    marginTop: 8,
    padding: 12,
  },
  deleteButton: {
    backgroundColor: '#D5232B',
    marginTop: 8,
    padding: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
});