import jwt from 'jsonwebtoken';
export function verificaToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ erro: "Acesso negado. Token não fornecido." });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuarioId = payload.id;
        req.nivelAcesso = payload.nivelAcesso;
        next();
    }
    catch (error) {
        res.status(403).json({ erro: "Token inválido ou expirado." });
    }
}
export function verificaAdmin(req, res, next) {
    if (req.nivelAcesso !== "ADMIN") {
        res.status(403).json({ erro: "Permissão negada." });
        return;
    }
    next();
}
