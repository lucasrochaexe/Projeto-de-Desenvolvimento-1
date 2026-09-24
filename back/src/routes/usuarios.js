import { prisma } from "../../lib/prisma";
import { Router } from 'express';
import { z } from 'zod';
import { verificaToken, verificaAdmin } from "./verificaToken";
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
const router = Router();
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAILTRAP_EMAIL,
        pass: process.env.MAILTRAP_SENHA
    },
});
const usuarioSchema = z.object({
    nome: z.string().min(3, { message: "Nome deve possuir, no mínimo, 3 caracteres" }),
    email: z.email().min(10, { message: "E-mail, no mínimo, 10 caracteres" }),
    senha: z.string().min(8, { message: "Senha deve possuir, no mínimo, 8 caracteres" }),
});
router.get("/", verificaToken, verificaAdmin, async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany();
        res.status(200).json(usuarios);
    }
    catch (error) {
        res.status(500).json({ erro: "Erro ao buscar usuários" });
    }
});
function validaSenha(senha) {
    const mensa = [];
    if (senha.length < 8) {
        mensa.push("Erro... senha deve possuir, no mínimo, 8 caracteres");
    }
    let pequenas = 0;
    let grandes = 0;
    let numeros = 0;
    let simbolos = 0;
    for (const letra of senha) {
        if ((/[a-z]/).test(letra)) {
            pequenas++;
        }
        else if ((/[A-Z]/).test(letra)) {
            grandes++;
        }
        else if ((/[0-9]/).test(letra)) {
            numeros++;
        }
        else {
            simbolos++;
        }
    }
    if (pequenas == 0) {
        mensa.push("Erro... senha deve possuir letra(s) minúscula(s)");
    }
    if (grandes == 0) {
        mensa.push("Erro... senha deve possuir letra(s) maiúscula(s)");
    }
    if (numeros == 0) {
        mensa.push("Erro... senha deve possuir número(s)");
    }
    if (simbolos == 0) {
        mensa.push("Erro... senha deve possuir símbolo(s)");
    }
    return mensa;
}
router.post("/", async (req, res) => {
    const valida = usuarioSchema.safeParse(req.body);
    if (!valida.success) {
        res.status(400).json({ erro: valida.error });
        return;
    }
    const { nome, email, senha } = valida.data;
    const mensaErros = validaSenha(senha);
    if (mensaErros.length > 0) {
        res.status(400).json({ erro: mensaErros });
        return;
    }
    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync(senha, salt);
    try {
        const usuario = await prisma.usuario.create({
            data: { nome, email, senha: hash }
        });
        const tokenAtivacao = crypto.randomBytes(32).toString('hex');
        const validadeToken = new Date();
        validadeToken.setHours(validadeToken.getHours() + 24);
        await prisma.token.create({
            data: {
                usuarioId: usuario.id,
                token: tokenAtivacao,
                tipoToken: "VALIDACAO_EMAIL",
                expira: validadeToken
            }
        });
        const apiPublica = process.env.API_PUBLIC_URL || "http://localhost:3000";
        const linkAtivacao = `${apiPublica}/usuarios/ativar?token=${tokenAtivacao}`;
        transporter.sendMail({
            from: '"Dexter App" <support@dexterapp.com>',
            to: email,
            subject: "Bem-vindo ao Dexter | Simplificando sua rotina",
            text: `Bem-vindo ao Dexter!\n\nSimplificando sua rotina, um dia de cada vez.\n\nAtive sua conta pelo link:\n${linkAtivacao}\n\nEste link expira em 24 horas.`,
            html: `
                        <!DOCTYPE html>
                        <html lang="pt-BR">
                            <body style="margin:0; padding:0; background-color:#f4f1eb; font-family:Arial, Helvetica, sans-serif; color:#242424;">
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f1eb; padding:32px 16px;">
                                    <tr>
                                        <td align="center">
                                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px; background-color:#ffffff; border-radius:16px; overflow:hidden;">
                                                <tr>
                                                    <td style="background-color:#171717; padding:32px 40px; text-align:center;">
                                                        <div style="font-size:30px; font-weight:bold; letter-spacing:1px; color:#d5a23a;">DEXTER</div>
                                                        <div style="margin-top:8px; font-size:14px; color:#eeeeee;">Simplificando sua rotina</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:40px;">
                                                        <h1 style="margin:0 0 20px; font-size:26px; line-height:1.25; color:#242424;">Bem-vindo ao Dexter!</h1>
                                                        <p style="margin:0 0 16px; font-size:16px; line-height:1.6;">Sua conta foi criada com sucesso. Agora falta apenas confirmar seu e-mail para começar.</p>
                                                        <p style="margin:0 0 28px; font-size:16px; line-height:1.6;">Organize suas tarefas, acompanhe seus prazos e deixe sua rotina mais leve.</p>
                                                        <table role="presentation" cellspacing="0" cellpadding="0">
                                                            <tr>
                                                                <td style="border-radius:8px; background-color:#d5a23a;">
                                                                    <a href="${linkAtivacao}" style="display:inline-block; padding:15px 24px; font-size:16px; font-weight:bold; color:#171717; text-decoration:none;">Ativar minha conta</a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <p style="margin:28px 0 0; font-size:13px; line-height:1.5; color:#6b6b6b;">Este link expira em 24 horas. Se você não solicitou este cadastro, ignore esta mensagem.</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="border-top:1px solid #eeeeee; padding:22px 40px; text-align:center;">
                                                        <p style="margin:0; font-size:13px; color:#777777;">Dexter | Simplificando sua rotina</p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </body>
                        </html>`
        }).catch(err => console.error("Erro ao enviar email de ativação:", err));
        res.status(201).json({ mensagem: "Verifique seu e-mail para ativar sua conta." });
    }
    catch (error) {
        res.status(400).json({ erro: "Erro ao criar usuário" });
    }
});
async function ativarConta(token) {
    const tokenValido = await prisma.token.findFirst({
        where: {
            token,
            tipoToken: "VALIDACAO_EMAIL",
            revogado: false,
            expira: { gt: new Date() },
        }
    });
    if (!tokenValido) {
        throw new Error("Link de ativação inválido ou expirado");
    }
    await prisma.usuario.update({
        where: { id: tokenValido.usuarioId },
        data: { statusConta: "ATIVA" }
    });
    await prisma.token.update({
        where: { id: tokenValido.id },
        data: { revogado: true }
    });
}
function paginaAtivacao(titulo, mensagem, sucesso) {
    const cor = sucesso ? "#d5a23a" : "#c75c5c";
    const simbolo = sucesso ? "✓" : "!";
    return `<!DOCTYPE html>
<html lang="pt-BR">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${titulo} | Dexter</title>
        <style>
            * { box-sizing: border-box; }
            body {
                align-items: center;
                background: #171717;
                color: #ffffff;
                display: flex;
                font-family: Arial, Helvetica, sans-serif;
                justify-content: center;
                margin: 0;
                min-height: 100vh;
                padding: 24px;
            }
            .page {
                background: #242424;
                border: 1px solid #3b3b3b;
                border-radius: 18px;
                max-width: 520px;
                overflow: hidden;
                text-align: center;
                width: 100%;
            }
            .header {
                background: #101010;
                border-bottom: 1px solid #3b3b3b;
                padding: 28px 24px;
            }
            .brand { color: #d5a23a; font-size: 28px; font-weight: 700; letter-spacing: 2px; }
            .motto { color: #cfcfcf; font-size: 14px; margin-top: 8px; }
            .content { padding: 42px 32px 38px; }
            .symbol {
                align-items: center;
                background: ${cor};
                border-radius: 50%;
                color: #171717;
                display: flex;
                font-size: 30px;
                font-weight: 700;
                height: 68px;
                justify-content: center;
                margin: 0 auto 24px;
                width: 68px;
            }
            h1 { font-size: 28px; margin: 0 0 14px; }
            p { color: #d2d2d2; font-size: 16px; line-height: 1.6; margin: 0 auto; max-width: 400px; }
            .hint { color: #929292; font-size: 13px; margin-top: 24px; }
            .footer { border-top: 1px solid #3b3b3b; color: #858585; font-size: 13px; padding: 20px 24px; }
            @media (max-width: 420px) {
                .content { padding: 34px 22px 30px; }
                h1 { font-size: 24px; }
            }
        </style>
    </head>
    <body>
        <main class="page">
            <header class="header">
                <div class="brand">DEXTER</div>
                <div class="motto">Simplificando sua rotina</div>
            </header>
            <section class="content">
                <div class="symbol">${simbolo}</div>
                <h1>${titulo}</h1>
                <p>${mensagem}</p>
                <p class="hint">Você já pode fechar esta página.</p>
            </section>
            <footer class="footer">Dexter | Organização para o seu dia</footer>
        </main>
    </body>
</html>`;
}
router.get("/ativar", async (req, res) => {
    const token = String(req.query.token || "");
    if (!token) {
        res.status(400).send(paginaAtivacao("Não foi possível ativar", "O token de ativação não foi fornecido.", false));
        return;
    }
    try {
        await ativarConta(token);
        res.status(200).send(paginaAtivacao("Conta ativada!", "Sua conta Dexter está pronta. Volte ao aplicativo e faça login para começar.", true));
    }
    catch (error) {
        const mensagem = error instanceof Error ? error.message : "Erro ao ativar a conta.";
        res.status(400).send(paginaAtivacao("Link indisponível", mensagem, false));
    }
});
router.post("/ativar", async (req, res) => {
    const { token } = req.body;
    if (!token) {
        res.status(400).json({ erro: "Token de ativação não fornecido." });
        return;
    }
    try {
        await ativarConta(token);
        res.status(200).json({ mensagem: "Conta ativada com sucesso! Você já pode fazer login." });
    }
    catch (error) {
        const mensagem = error instanceof Error ? error.message : "Erro ao ativar a conta.";
        res.status(400).json({ erro: mensagem });
    }
});
router.delete("/:id", verificaToken, verificaAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await prisma.usuario.delete({
            where: { id: String(id) }
        });
        res.status(200).json(usuario);
    }
    catch (error) {
        res.status(400).json({ erro: "Erro no servidor" });
    }
});
router.post("/esqueceu-senha", async (req, res) => {
    const { email } = req.body;
    try {
        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) {
            res.status(400).json({ erro: "E-mail não encontrado na base de dados" });
            return;
        }
        const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let codigo = "";
        for (let i = 0; i < 4; i++) {
            codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        const validadeToken = new Date();
        validadeToken.setMinutes(validadeToken.getMinutes() + 15);
        await prisma.token.create({
            data: {
                usuarioId: usuario.id,
                token: codigo,
                tipoToken: "REDEFINIR_SENHA",
                expira: validadeToken
            }
        });
        transporter.sendMail({
            from: '"Dexter App" <support@dexterapp.com>',
            to: email,
            subject: "Código de Recuperação de Senha",
            text: `Seu código de recuperação é: ${codigo}`,
            html: `<h3>Recuperação de Senha</h3><p>Seu código de recuperação é: <b>${codigo}</b></p>`
        }).catch(err => console.error("Erro ao enviar email:", err));
        res.status(200).json({ mensagem: "Um código de recuperação foi enviado para o seu e-mail" });
    }
    catch (error) {
        console.error("Erro na validação do esqueceu senha:", error);
        res.status(500).json({ erro: "Erro no servidor" });
    }
});
router.post("/recupera-senha", async (req, res) => {
    const { email, codigo, novaSenha } = req.body;
    if (!email || !codigo || !novaSenha) {
        res.status(400).json({ erro: "Por favor, informe o e-mail, o código e a nova senha" });
        return;
    }
    const mensaErros = validaSenha(novaSenha);
    if (mensaErros.length > 0) {
        res.status(400).json({ erro: mensaErros });
        return;
    }
    try {
        const tokenValido = await prisma.token.findFirst({
            where: {
                token: codigo.trim().toUpperCase(),
                tipoToken: "REDEFINIR_SENHA",
                revogado: false,
                expira: { gt: new Date() },
                usuario: { email: email }
            }
        });
        if (!tokenValido) {
            res.status(400).json({ erro: "Código de recuperação inválido ou expirado" });
            return;
        }
        const salt = bcrypt.genSaltSync(12);
        const hash = bcrypt.hashSync(novaSenha, salt);
        await prisma.usuario.update({
            where: { email },
            data: { senha: hash }
        });
        await prisma.token.update({
            where: { id: tokenValido.id },
            data: { revogado: true }
        });
        res.status(200).json({ mensagem: "Senha alterada com sucesso! Você já pode fazer login." });
    }
    catch (error) {
        res.status(500).json({ erro: "Erro ao redefinir senha" });
    }
});
router.post("/reenviar-ativacao", async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ erro: "E-mail é obrigatório." });
        return;
    }
    try {
        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) {
            res.status(400).json({ erro: "E-mail não encontrado." });
            return;
        }
        if (usuario.statusConta === "ATIVA") {
            res.status(400).json({ erro: "Esta conta já está ativada." });
            return;
        }
        await prisma.token.updateMany({
            where: {
                usuarioId: usuario.id,
                tipoToken: "VALIDACAO_EMAIL",
                revogado: false
            },
            data: { revogado: true }
        });
        const tokenAtivacao = crypto.randomBytes(32).toString('hex');
        const validadeToken = new Date();
        validadeToken.setHours(validadeToken.getHours() + 24);
        await prisma.token.create({
            data: {
                usuarioId: usuario.id,
                token: tokenAtivacao,
                tipoToken: "VALIDACAO_EMAIL",
                expira: validadeToken
            }
        });
        const apiPublica = process.env.API_PUBLIC_URL || "http://localhost:3000";
        const linkAtivacao = `${apiPublica}/usuarios/ativar?token=${tokenAtivacao}`;
        transporter.sendMail({
            from: '"Dexter App" <support@dexterapp.com>',
            to: email,
            subject: "Ative sua conta no Dexter App",
            text: `Bem-vindo! Clique no link para ativar sua conta: ${linkAtivacao}`,
            html: `<h3>Bem-vindo ao Dexter!</h3>
            <p>Para começar a usar o aplicativo, ative sua conta clicando no link abaixo:</p>
            <a href="${linkAtivacao}">Ativar Minha Conta</a>
            <p>Este link expira em 24 horas.</p>`
        }).catch(err => console.error("Erro ao reenviar email:", err));
        res.status(200).json({ mensagem: "Um novo link de ativação foi enviado para seu e-mail." });
    }
    catch (error) {
        console.error("ERRO NO REENVIO:", error);
        res.status(500).json({ erro: "Erro ao reenviar o e-mail de ativação." });
    }
});
export default router;
