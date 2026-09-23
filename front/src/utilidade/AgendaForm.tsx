import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export type AgendaItem = {
    titulo: string;
    inicio: string;
    fim: string;
    obs: string;
    prioridade: 'urgente' | 'importante' | 'media';
};

type AgendaFormProps = {
    onConfirm: (agenda: AgendaItem) => void;
    onCancel: () => void;
};

export function AgendaForm({ onConfirm, onCancel }: AgendaFormProps) {
    const [titulo, setTitulo] = useState('');
    const [inicio, setInicio] = useState('');
    const [fim, setFim] = useState('');
    const [obs, setObs] = useState('');
    const [prioridade, setPrioridade] = useState<AgendaItem['prioridade']>('media');

    const confirmar = () => {
        onConfirm({ titulo, inicio, fim, obs, prioridade });
    };

    return (
        <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Título" value={titulo} onChangeText={setTitulo} />
        <View style={styles.dateRow}>
            <TextInput style={[styles.input, styles.dateInput]} placeholder="Data - início" value={inicio} onChangeText={setInicio} />
            <TextInput style={[styles.input, styles.dateInput]} placeholder="Data - final" value={fim} onChangeText={setFim} />
        </View>
        <Text style={styles.label}>Obs:</Text>
        <TextInput style={[styles.input, styles.observation]} multiline value={obs} onChangeText={setObs} />

        <View style={styles.prioridade}>
            <PriorityButton label="Urgente" color="#F51B25" selected={prioridade === 'urgente'} onPress={() => setPrioridade('urgente')} />
            <PriorityButton label="Importante" color="#E2C000" selected={prioridade === 'importante'} onPress={() => setPrioridade('importante')} />
            <PriorityButton label="Média" color="#559492" selected={prioridade === 'media'} onPress={() => setPrioridade('media')} />
        </View>

        <View style={styles.actions}>
            <Pressable style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelText}>Limpar</Text>
            </Pressable>
            <Pressable style={styles.confirmButton} onPress={confirmar}>
                <Text style={styles.confirmText}>Confirmar</Text>
            </Pressable>
        </View>
        </View>
    );
}

type PriorityButtonProps = {
    label: string;
    color: string;
    selected: boolean;
    onPress: () => void;
};

function PriorityButton({ label, color, selected, onPress }: PriorityButtonProps) {
    return (
        <Pressable style={styles.priorityOption} onPress={onPress}>
            <View style={[styles.swatch, { backgroundColor: color }, selected && styles.selectedSwatch]} />
            <Text style={styles.priorityText}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    form: {
        backgroundColor: '#D9D9D9',
        marginTop: 16,
        padding: 18,
    },
    input: {
        backgroundColor: '#F1F1F5',
        color: '#222222',
        fontSize: 10,
        height: 22,
        marginBottom: 12,
        paddingHorizontal: 5,
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateInput: {
        width: '43%',
    },
    label: {
        color: '#222222',
        fontSize: 10,
        marginBottom: 4,
    },
    observation: {
        height: 97,
        textAlignVertical: 'top',
    },
    prioridade: {
        marginBottom: 22,
    },
    priorityOption: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 15,
    },
    swatch: {
        height: 8,
        marginRight: 4,
        width: 8,
    },
    selectedSwatch: {
        borderColor: '#222222',
        borderWidth: 1,
    },
    priorityText: {
        color: '#222222',
        fontSize: 9,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        alignItems: 'center',
        backgroundColor: '#EEEEEE',
        justifyContent: 'center',
        paddingHorizontal: 18,
        paddingVertical: 5,
    },
    cancelText: {
        color: '#222222',
        fontSize: 9,
    },
    confirmButton: {
        alignItems: 'center',
        backgroundColor: '#559492',
        justifyContent: 'center',
        paddingHorizontal: 18,
        paddingVertical: 5,
    },
    confirmText: {
        color: '#FFFFFF',
        fontSize: 9,
    },
});