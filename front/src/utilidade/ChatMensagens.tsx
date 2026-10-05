import { useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MensagemChat } from './useAgent';

type ChatMensagensProps = {
    mensagens: MensagemChat[];
    digitando?: boolean;
    espacoInferior?: number;
};

export function ChatMensagens({
    mensagens,
    digitando = false,
    espacoInferior = 0,
}: ChatMensagensProps) {
    const scrollRef = useRef<ScrollView>(null);

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
});