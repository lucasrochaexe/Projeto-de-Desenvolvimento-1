import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export type AgendaItem = {
    id: string;
    titulo: string;
    inicio: string;
    fim: string;
    obs: string;
    prioridade: 'urgente' | 'importante' | 'media';
};


type NovaAgenda = Omit<AgendaItem, 'id'>;

type AgendaFormProps = {
    initialAgenda?: AgendaItem;
    onConfirm: (agenda: NovaAgenda) => void;
    onCancel: () => void;
};

export function AgendaForm({ initialAgenda, onConfirm, onCancel }: AgendaFormProps) {
    const [titulo, setTitulo] = useState('');
    const [inicio, setInicio] = useState('');
    const [fim, setFim] = useState('');
    const [dataSelecionada, setDataSelecionada] = useState<'inicio' | 'fim' | null>(null);
    const [obs, setObs] = useState('');
    const [prioridade, setPrioridade] = useState<AgendaItem['prioridade']>('media');
    const [obsHeight, setObsHeight] = useState(100);

    useEffect(() => {
        if (initialAgenda) {
            setTitulo(initialAgenda.titulo);
            setInicio(initialAgenda.inicio);
            setFim(initialAgenda.fim);
            setObs(initialAgenda.obs);
            setPrioridade(initialAgenda.prioridade);
        }
    }, [initialAgenda]);

    const confirmar = () => {
        onConfirm({ titulo, inicio, fim, obs, prioridade });
    };

    const abrirCalendario = (campo: 'inicio' | 'fim') => setDataSelecionada(campo);

    const selecionarData = (_event: unknown, data?: Date) => {
        if (data && dataSelecionada === 'inicio') {
            setInicio(formatarData(data));
        }
        if (data && dataSelecionada === 'fim') {
            setFim(formatarData(data));
        }
        setDataSelecionada(null);
    };

    const dataDoCalendario = dataSelecionada === 'fim' && fim
        ? converterData(fim)
        : dataSelecionada === 'inicio' && inicio
            ? converterData(inicio)
            : new Date();
    
    return (
        <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Título" value={titulo} onChangeText={setTitulo} />
        <View style={styles.dateRow}>
            <Pressable style={[styles.input, styles.dateInput]} onPress={() => abrirCalendario('inicio')}>
                <TextInput pointerEvents="none" style={styles.dateText} placeholder="Data - início" value={inicio} editable={false} />
            </Pressable>
            <Pressable style={[styles.input, styles.dateInput]} onPress={() => abrirCalendario('fim')}>
                <TextInput pointerEvents="none" style={styles.dateText} placeholder="Data - final" value={fim} editable={false} />
            </Pressable>
        </View>
        {dataSelecionada && <DateTimePicker value={dataDoCalendario} mode="date" onChange={selecionarData} />}
        <Text style={styles.label}>Obs:</Text>
        <TextInput
            style={[styles.input, { height: Math.max(100, obsHeight) }]}
            multiline
            value={obs}
            onChangeText={setObs}
            onContentSizeChange={(event) => {
                setObsHeight(event.nativeEvent.contentSize.height);
            }}
        />

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
        fontSize: 14,
        height: 40,
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
    dateText: {
        color: '#222222',
        flex: 1,
        fontSize: 14,
        height: 40,
        paddingHorizontal: 0,
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
        height: 25,
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
        fontSize: 15,
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

function formatarData(data: Date) {
    return `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;
}

function converterData(data: string) {
    const [dia, mes, ano] = data.split('/').map(Number);
    return new Date(ano, mes - 1, dia);
}