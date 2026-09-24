import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AgendaItem } from './AgendaForm';

type AgendaListProps = {
    agendas: AgendaItem[];
    onDetails: (agenda: AgendaItem) => void;
};

export function AgendaList({ agendas, onDetails }: AgendaListProps) {
    return (
        <ScrollView contentContainerStyle={styles.list}>
        {agendas.map((item, index) => {
            const color = item.prioridade === 'urgente'
                ? '#F51B25'
                : item.prioridade === 'importante'
                    ? '#E2C000'
                    : '#559492';

            return (
                <View key={item.id} style={styles.card}>
                    <View style={[styles.priorityStripe, { backgroundColor: color }]} />
                    <View style={styles.details}>
                        <Text style={styles.title}>{item.titulo}</Text>
                        <Text style={styles.date}>Data de Início: {item.inicio}</Text>
                        <Text style={styles.date}>Data Final: <Text style={styles.dateValue}>{item.fim}</Text></Text>
                    </View>
                        <Pressable
                            style={[styles.detailsButton, { backgroundColor: color }]}
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
        backgroundColor: '#D9D9D9',
        flexDirection: 'row',
        height: 76,
        marginBottom: 7,
        overflow: 'hidden',
    },
    priorityStripe: {
        width: 9,
    },
    details: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 9,
    },
    title: {
        color: '#191919',
        fontSize: 12,
        marginBottom: 5,
    },
    date: {
        color: '#191919',
        fontSize: 8,
        lineHeight: 12,
    },
    dateValue: {
        color: '#D5232B',
    },
    detailsButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 51,
    },
    detailsButtonText: {
        color: '#FFFFFF',
        fontFamily: 'serif',
        fontSize: 10,
    },
});