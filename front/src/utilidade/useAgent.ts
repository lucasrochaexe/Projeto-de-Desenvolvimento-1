import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import {
    enviarAudioAoAgente,
    enviarMensagemAoAgente,
    reiniciarConversaComAgente,
    RespostaAgente,
    TarefaDoAgente,
    salvarTarefaDoAgente,
} from '../services/api';

export type MensagemChat = {
    id: number;
    autor: 'usuario' | 'agente';
    texto: string;
};

/*
 * Conversa com o agente Dexter (texto ou áudio).
 * Quando o agente devolve a tarefa confirmada, ela é salva na agenda.
 */
export function useAgente(token: string | null) {
    const [mensagens, setMensagens] = useState<MensagemChat[]>([]);
    const [enviando, setEnviando] = useState(false);
    const [tarefaPendente, setTarefaPendente] =
    useState<TarefaDoAgente | null>(null);
    const ocupadoRef = useRef(false);
    const proximoIdRef = useRef(0);
    const tokenRef = useRef(token);
    tokenRef.current = token;

    const adicionar = useCallback(
        (autor: MensagemChat['autor'], texto: string) => {
            const id = proximoIdRef.current++;
            setMensagens((atuais) => [...atuais, { id, autor, texto }]);
        },
        []
    );

    // Ao sair da tela, descarta no servidor a conversa que ficou pela metade.
    useEffect(() => {
        return () => {
            if (tokenRef.current) {
                reiniciarConversaComAgente(tokenRef.current).catch(() => {});
            }
        };
    }, []);

    const processar = useCallback(
        async (enviar: (tokenAtual: string) => Promise<RespostaAgente>) => {
            const tokenAtual = tokenRef.current;

            if (!tokenAtual) {
                Alert.alert('Sessão expirada', 'Faça login novamente.');
                return;
            }

            ocupadoRef.current = true;
            setEnviando(true);

            try {
                const resposta = await enviar(tokenAtual);

                if (resposta.transcricao) {
                    adicionar('usuario', resposta.transcricao);
                }

                if (resposta.tipo === 'tarefa') {
                    setTarefaPendente(resposta.tarefa);
                    adicionar('agente', resposta.texto);
                } else {
                    adicionar('agente', resposta.texto);
                }
            } catch (erro) {
                Alert.alert(
                    'Erro',
                    erro instanceof Error
                        ? erro.message
                        : 'Não foi possível falar com o Dexter.'
                );
            } finally {
                ocupadoRef.current = false;
                setEnviando(false);
            }
        },
        [adicionar]
    );
        /**
         * Confirma a tarefa pendente e a salva no servidor.
         */
        const confirmarTarefa = useCallback(async () => {
        const tokenAtual = tokenRef.current;

        if (!tokenAtual || !tarefaPendente || ocupadoRef.current) {
            return;
        }

        ocupadoRef.current = true;
        setEnviando(true);

        try {
            await salvarTarefaDoAgente(tokenAtual, tarefaPendente);

            adicionar(
                'agente',
                `Pronto! A tarefa "${tarefaPendente.titulo}" foi salva na sua agenda. Deseja fazer uma nova solicitação?`
            );

            setTarefaPendente(null);
        } catch (erro) {
            Alert.alert(
                'Erro',
                erro instanceof Error
                    ? erro.message
                    : 'Não foi possível salvar a tarefa.'
            );
        } finally {
            ocupadoRef.current = false;
            setEnviando(false);
        }
        }, [adicionar, tarefaPendente]);

    const enviarTexto = useCallback(
        async (texto: string) => {
            const limpo = texto.trim();

            if (!limpo || ocupadoRef.current) {
                return;
            }

            adicionar('usuario', limpo);
            await processar((tokenAtual) =>
                enviarMensagemAoAgente(tokenAtual, limpo)
            );
        },
        [adicionar, processar]
    );

    const enviarAudio = useCallback(
        async (uri: string) => {
            if (ocupadoRef.current) {
                return;
            }

            await processar((tokenAtual) => enviarAudioAoAgente(tokenAtual, uri));
        },
        [processar]
    );

    return {
    mensagens,
    enviando,
    enviarTexto,
    enviarAudio,
    tarefaPendente,
    confirmarTarefa,
    };
}