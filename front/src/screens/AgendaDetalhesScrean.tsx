import {Alert, Pressable, StyleSheet, Text, View} from "react-native";
import { MenuBar } from "../utilidade/MenuBar";
import { AgendaItem } from "../utilidade/AgendaForm";
import { ScreenBackground } from "./ScreenBackground";

type AgendaDetalhesScreenProps = {
    agenda: AgendaItem;
    modo: 'ativa' | 'arquivo' | 'excluidos';
    onBack: () => void;
    onEditar?: () => void;
    onArquivar?: () => void;
    onRestaurar?: () => void;
    onExcluir: () => void;
};

export function AgendaDetalhesScreen
({ agenda, modo, onBack, onEditar, onArquivar, onRestaurar, onExcluir }: AgendaDetalhesScreenProps) {
    const excluir = () => {
        Alert.alert(
            'Excluir agendamento',
            'Tem certeza que deseja excluir este agendamento?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Excluir', style: 'destructive', onPress: onExcluir },
            ]
        );
    }

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
                <Text style={styles.description}>
                    {agenda.obs || 'Nenhum descritivo informado.'}
                </Text>

                {modo === 'ativa' && (
                    <>
                        <Pressable style={styles.editButton} onPress={onEditar}>
                            <Text style={styles.buttonText}>Alterar</Text>
                        </Pressable>

                        <Pressable style={styles.archiveButton} onPress={onArquivar}>
                            <Text style={styles.buttonText}>Arquivar</Text>
                        </Pressable>

                        <Pressable style={styles.deleteButton} onPress={excluir}>
                            <Text style={styles.buttonText}>Excluir</Text>
                        </Pressable>
                    </>
                )}

                {modo === 'arquivo' && (
                    <>
                        <Pressable style={styles.restoreButton} onPress={onRestaurar}>
                            <Text style={styles.buttonText}>Restaurar</Text>
                        </Pressable>

                        <Pressable style={styles.deleteButton} onPress={excluir}>
                            <Text style={styles.buttonText}>Excluir</Text>
                        </Pressable>
                    </>
                )}

                {modo === 'excluidos' && (
                    <Pressable style={styles.restoreButton} onPress={onRestaurar}>
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
    editButton: {
        backgroundColor: '#559492',
        padding: 12,
        marginTop: 12,
    },
    archiveButton: {
        backgroundColor: '#D5A23A',
        padding: 12,
        marginTop: 8,
    },
    deleteButton: {
        backgroundColor: '#D5232B',
        padding: 12,
        marginTop: 8,
    },
    restoreButton: {
        backgroundColor: '#559492',
        padding: 12,
        marginTop: 12,
    },
    buttonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 14,
    },
});