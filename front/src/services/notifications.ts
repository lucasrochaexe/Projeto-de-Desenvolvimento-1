import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: true
    })
});

export async function obterExpoPushToken() {
    if (!Device.isDevice) {
        throw new Error('Push notifications existem apenas em dispositivos físicos.');
    }

    const permissoes = await Notifications.getPermissionsAsync();
    let status = permissoes.status;

    if (status !== 'granted') {
        const permissoesSolicitadas = await Notifications.requestPermissionsAsync();
        status = permissoesSolicitadas.status;
    }

    if (status !== 'granted') {
        throw new Error('Permissão para receber notificações não concedida.');
    }

    const isExpoGo = Constants.appOwnership === 'expo';

    if (Platform.OS === 'android' && !isExpoGo) {
        await Notifications.setNotificationChannelAsync('tarefas-v2', {
            name: 'Tarefas',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            sound: 'default',
        });
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

    if (!projectId) {
        throw new Error('Project ID não encontrado. Verifique se o arquivo app.json está configurado corretamente.');
    }

    const resposta = await Notifications.getExpoPushTokenAsync({
        projectId,
    });

    return resposta.data;
}

export function configurarToqueNaNotificacao(
    onTarefaSelecionada: (tarefaId: string) => void,
) {
    const processarResposta = (resposta: Notifications.NotificationResponse) => {
        const tarefaId = resposta.notification.request.content.data?.tarefaId;

        if (typeof tarefaId === 'string') {
            onTarefaSelecionada(tarefaId);
        }
    };

    const subscription =
        Notifications.addNotificationResponseReceivedListener(processarResposta);

    Notifications.getLastNotificationResponseAsync()
        .then((resposta) => {
            if (resposta) {
                processarResposta(resposta);
            }
        })
        .catch((error) => {
            console.error('Erro ao ler toque na notificação:', error);
        });

    return () => subscription.remove();
}