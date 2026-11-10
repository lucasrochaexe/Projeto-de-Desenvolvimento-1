import { Router, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { verificaToken, TokenInterface } from './verificaToken';

const router = Router();

router.use(verificaToken);

router.post('/', async (req: TokenInterface, res: Response) => {
    const { token, plataforma } = req.body;

    if (!token || typeof token !== 'string') {
        res.status(400).json({ erro: 'Token de push inválido.' });
        return;
    }

    if (!req.usuarioId) {
        res.status(401).json({ erro: 'Usuário não autenticado.' });
        return;
    }

    try {
        const pushToken = await prisma.pushToken.upsert({
            where: { token },
            update: {
                usuarioId: req.usuarioId,
                plataforma: plataforma || 'expo',
                ativo: true,
            },
            create: {
                usuarioId: req.usuarioId,
                token,
                plataforma: plataforma || 'expo',
            },
        });

        res.status(201).json(pushToken);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao registrar token de push.' });
    }
});

export default router;