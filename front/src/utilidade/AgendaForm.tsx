import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export type AgendaItem = {
    id: string;
    titulo: string;
    inicio: string;
    fim: string;
    obs: string;
    dicas?: string | null;
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
        <Text style={styles.formHeading}>{initialAgenda ? 'Alterar agenda' : 'Nova agenda'}</Text>
        <Text style={styles.fieldLabel}>Título</Text>
        <TextInput style={styles.input} placeholder="Digite o título da agenda" value={titulo} onChangeText={setTitulo} />
        <View style={styles.dateRow}>
            <View style={styles.dateField}>
            <Text style={styles.fieldLabel}>Início</Text>
            <Pressable style={[styles.input, styles.dateInput]} onPress={() => abrirCalendario('inicio')}>
                <TextInput pointerEvents="none" style={styles.dateText} placeholder="Data - início" value={inicio} editable={false} />
            </Pressable>
            </View>
            <View style={styles.dateField}>
            <Text style={styles.fieldLabel}>Término</Text>
            <Pressable style={[styles.input, styles.dateInput]} onPress={() => abrirCalendario('fim')}>
                <TextInput pointerEvents="none" style={styles.dateText} placeholder="Data - final" value={fim} editable={false} />
            </Pressable>
            </View>
        </View>
        {dataSelecionada && <DateTimePicker value={dataDoCalendario} mode="date" onChange={selecionarData} />}
        <Text style={styles.fieldLabel}>Observações</Text>
        <TextInput
            style={[styles.input, styles.observation, { height: Math.max(100, obsHeight) }]}
            multiline
            value={obs}
            onChangeText={setObs}
            onContentSizeChange={(event) => {
                setObsHeight(event.nativeEvent.contentSize.height);
            }}
        />

        <Text style={styles.fieldLabel}>Prioridade</Text>
        <View style={styles.prioridade}>
            <PriorityButton label="Urgente" color="#F51B25" selected={prioridade === 'urgente'} onPress={() => setPrioridade('urgente')} />
            <PriorityButton label="Importante" color="#E2C000" selected={prioridade === 'importante'} onPress={() => setPrioridade('importante')} />
            <PriorityButton label="Média" color="#559492" selected={prioridade === 'media'} onPress={() => setPrioridade('media')} />
        </View>

        <View style={styles.actions}>
            <Pressable style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelText}>Cancelar</Text>
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
        backgroundColor: '#FFFFFF',
        borderColor: 'rgba(39, 35, 31, 0.10)',
        borderRadius: 18,
        borderWidth: 1,
        elevation: 3,
        marginTop: 16,
        padding: 20,
        shadowColor: '#27231F',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 6,
    },
    formHeading: {
        color: '#27231F',
        fontSize: 21,
        fontWeight: '700',
        marginBottom: 20,
    },
    fieldLabel: {
        color: '#555B61',
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#F5F6F7',
        borderColor: '#D9DDE2',
        borderRadius: 10,
        borderWidth: 1,
        color: '#222222',
        fontSize: 14,
        height: 48,
        marginBottom: 12,
        paddingHorizontal: 13,
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateField: {
        width: '48%',
    },
    dateInput: {
        width: '100%',
    },
    dateText: {
        color: '#222222',
        flex: 1,
        fontSize: 14,
        height: 46,
        paddingHorizontal: 0,
    },
    observation: {
        textAlignVertical: 'top',
    },
    prioridade: {
        backgroundColor: '#F5F6F7',
        borderColor: '#D9DDE2',
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 22,
        padding: 10,
    },
    priorityOption: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 34,
    },
    swatch: {
        borderRadius: 5,
        height: 10,
        marginRight: 8,
        width: 10,
    },
    selectedSwatch: {
        borderColor: '#222222',
        borderWidth: 1,
    },
    priorityText: {
        color: '#222222',
        fontSize: 14,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        alignItems: 'center',
        backgroundColor: '#F2F3F5',
        borderColor: '#D9DDE2',
        borderRadius: 10,
        borderWidth: 1,
        justifyContent: 'center',
        minHeight: 46,
        paddingHorizontal: 20,
    },
    cancelText: {
        color: '#222222',
        fontSize: 13,
        fontWeight: '700',
    },
    confirmButton: {
        alignItems: 'center',
        backgroundColor: '#3F7774',
        borderRadius: 10,
        justifyContent: 'center',
        minHeight: 46,
        paddingHorizontal: 20,
    },
    confirmText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },
});

function formatarData(data: Date) {
    return `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;
}

function converterData(data: string) {
    const [dia, mes, ano] = data.split('/').map(Number);
    return new Date(ano, mes - 1, dia);
}