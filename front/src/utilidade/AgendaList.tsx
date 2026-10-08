import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AgendaItem } from './AgendaForm';

type AgendaListProps = {
    agendas: AgendaItem[];
    onDetails: (agenda: AgendaItem) => void;
    compact?: boolean;
    status?: 'ativa' | 'arquivo' | 'excluidos';
};

export function AgendaList({
    agendas,
    onDetails,
    compact = false,
    status = 'ativa',
}: AgendaListProps) {
    const ordemPrioridade ={
        urgente: 0,
        importante: 1,
        media: 2,
    } as const;

    const agendasOrdenadas = [...agendas].sort ((a, b) => 
        ordemPrioridade[a.prioridade] - ordemPrioridade[b.prioridade]
    );

    return (
        <ScrollView contentContainerStyle={styles.list}>
        {agendasOrdenadas.map((item) => {
            const color = item.prioridade === 'urgente'
                ? '#F51B25'
                : item.prioridade === 'importante'
                    ? '#E2C000'
                    : '#559492';

            return (
                <View
                    key={item.id}
                    style={[
                        styles.card,
                        compact && styles.compactCard,
                        status === 'arquivo' && styles.archivedCard,
                        status === 'excluidos' && styles.deletedCard,
                    ]}
                >
                    <View style={[styles.priorityStripe, { backgroundColor: color }]} />
                    <View style={[styles.details, compact && styles.compactDetails]}>
                        <Text style={[styles.title, compact && styles.compactTitle]}>{item.titulo}</Text>
                        <Text style={styles.date}>Data de Início: {item.inicio}</Text>
                        <Text style={styles.date}>Data Final: <Text style={styles.dateValue}>{item.fim}</Text></Text>
                    </View>
                    <Pressable
                        style={({ pressed }) => [
                            styles.detailsButton,
                            compact && styles.compactDetailsButton,
                            pressed && styles.detailsButtonPressed,
                        ]}
                        onPress={() => onDetails(item)}
                    >
                        <Text style={styles.detailsButtonText}>Detalhes</Text>
                    </Pressable>
                </View>
            );
        })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    list: {
        paddingBottom: 24,
        paddingTop: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderColor: 'rgba(39, 35, 31, 0.10)',
        borderRadius: 16,
        borderWidth: 1,
        elevation: 3,
        flexDirection: 'row',
        marginBottom: 12,
        minHeight: 86,
        overflow: 'hidden',
        shadowColor: '#27231F',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.10,
        shadowRadius: 5,
    },
    compactCard: {
        minHeight: 68,
    },
    archivedCard: {
        backgroundColor: '#EEF6FC',
        borderColor: '#C7DCEB',
    },
    deletedCard: {
        backgroundColor: '#d7d7da',
        borderColor: '#D5D9DE',
    },
    priorityStripe: {
        width: 6,
    },
    details: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 14,
        paddingVertical: 13,
    },
    compactDetails: {
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    title: {
        color: '#191919',
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 7,
    },
    compactTitle: {
        fontSize: 13,
        marginBottom: 3,
    },
    date: {
        color: '#6B6B6B',
        fontSize: 11,
        lineHeight: 17,
    },
    dateValue: {
        color: '#3E3E3E',
        fontWeight: '600',
    },
    detailsButton: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: '#F2F3F5',
        borderColor: '#D9DDE2',
        borderRadius: 10,
        borderWidth: 1,
        marginRight: 12,
        minHeight: 38,
        paddingHorizontal: 11,
    },
    compactDetailsButton: {
        minHeight: 32,
        marginRight: 8,
        paddingHorizontal: 8,
    },
    detailsButtonText: {
        color: '#3E444B',
        fontSize: 11,
        fontWeight: '700',
    },
    detailsButtonPressed: {
        backgroundColor: '#E5E7EB',
    },
});