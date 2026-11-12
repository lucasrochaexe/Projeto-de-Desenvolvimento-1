import { useRef, type ComponentRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MensagemChat } from './useAgent';

type ChatMensagensProps = {
    mensagens: MensagemChat[];
    digitando?: boolean;
    espacoInferior?: number;
    mostrarConfirmar?: boolean;
    onConfirmar?: () => void;
};

export function ChatMensagens({
    mensagens,
    digitando = false,
    espacoInferior = 0,
    mostrarConfirmar = false,
    onConfirmar,
}: ChatMensagensProps) {
    const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);

    return (
        <ScrollView
            ref={scrollRef}
            contentContainerStyle={{ paddingBottom: espacoInferior }}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
                scrollRef.current?.scrollToEnd({ animated: true })
            }
            showsVerticalScrollIndicator={false}
        >
            {mensagens.map((mensagem) => {
                const doUsuario = mensagem.autor === 'usuario';

                return (
                    <View
                        key={mensagem.id}
                        style={[
                            styles.bolha,
                            doUsuario ? styles.bolhaUsuario : styles.bolhaAgente,
                        ]}
                    >
                        <Text
                            style={doUsuario ? styles.textoUsuario : styles.textoAgente}
                        >
                            {mensagem.texto}
                        </Text>
                    </View>
                );
            })}

            {mostrarConfirmar && onConfirmar && (
                <Pressable
                    disabled={digitando}
                    onPress={onConfirmar}
                    style={[styles.botaoConfirmar, digitando && styles.botaoDesabilitado]}
                >
                    <Text style={styles.textoConfirmar}>Confirmar</Text>
                </Pressable>
            )}

            {digitando && (
                <View style={[styles.bolha, styles.bolhaAgente]}>
                    <Text style={styles.textoAgente}>Dexter está pensando...</Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    bolha: {
        borderRadius: 16,
        marginVertical: 4,
        maxWidth: '80%',
        padding: 12,
    },
    bolhaUsuario: {
        alignSelf: 'flex-end',
        backgroundColor: '#D5A23A',
    },
    bolhaAgente: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
    },
    textoUsuario: {
        color: '#2B2520',
        fontSize: 16,
    },
    textoAgente: {
        color: '#27231F',
        fontSize: 16,
    },
    botaoConfirmar: {
        alignSelf: 'flex-start',
        backgroundColor: '#D5A23A',
        borderRadius: 12,
        marginVertical: 8,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    botaoDesabilitado: {
        opacity: 0.5,
    },
    textoConfirmar: {
        color: '#2B2520',
        fontSize: 16,
        fontWeight: 'bold',
    },
});