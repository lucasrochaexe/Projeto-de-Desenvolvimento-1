import { Expo } from 'expo-server-sdk';
import { prisma } from '../../lib/prisma';
const expo = new Expo();
export async function enviarPushParaUsuario(usuarioId, titulo, mensagem, data = {}) {
    const registros = await prisma.pushToken.findMany({
        where: {
            usuarioId,
            ativo: true,
        },
    });
    const mensagens = registros
        .filter((registro) => Expo.isExpoPushToken(registro.token))
        .map((registro) => ({
        to: registro.token,
        sound: 'default',
        title: titulo,
        body: mensagem,
        data,
        channelId: 'tarefas',
    }));
    if (mensagens.length === 0) {
        return;
    }
    const blocos = expo.chunkPushNotifications(mensagens);
    for (const bloco of blocos) {
        await expo.sendPushNotificationsAsync(bloco);
    }
}
