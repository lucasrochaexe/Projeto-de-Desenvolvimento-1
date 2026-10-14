import { prisma } from "../../../lib/prisma"
import { Router } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import nodemailer from "nodemailer"

const router = Router()
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    requireTLS: process.env.SMTP_REQUIRE_TLS !== "false",
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
        user: process.env.SMTP_USER || process.env.MAILTRAP_EMAIL,
        pass: process.env.SMTP_PASSWORD || process.env.MAILTRAP_SENHA,
    },
})

function paginaRedefinicao(mensagem: string, sucesso = false) {
    return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>${sucesso ? "Senha alterada" : "Recuperar senha"} | Dexter</title>
<style>body{margin:0;background:#f4f1eb;font-family:Arial,sans-serif;color:#242424}main{max-width:440px;margin:48px auto;padding:32px;background:#fff;border-radius:16px;text-align:center}.brand{color:#d5a23a;font-size:28px;font-weight:bold;letter-spacing:2px}h1{font-size:24px;margin:24px 0 12px}p{line-height:1.5;color:#666}input{box-sizing:border-box;width:100%;padding:14px;margin:8px 0;border:1px solid #ddd;border-radius:8px;font-size:16px}button{width:100%;padding:14px;margin-top:12px;border:0;border-radius:8px;background:#d5a23a;font-weight:bold;font-size:16px}.orb{margin:20px auto 0;width:56px;height:56px;border:2px solid #d5a23a;border-radius:50%;position:relative}.orb:after{content:"";position:absolute;top:-5px;left:23px;width:10px;height:10px;border-radius:50%;background:#d5a23a}</style></head>
<body><main><div class="brand">DEXTER</div><div class="orb"></div><h1>${sucesso ? "Senha alterada com sucesso" : "Crie uma nova senha"}</h1><p>${mensagem}</p>${sucesso ? "" : `<form method="post"><input type="hidden" name="token" value="{{TOKEN}}"><input type="password" name="novaSenha" placeholder="Nova senha" minlength="8" required><button type="submit">Salvar nova senha</button></form>`}</main></body></html>`
}

router.get("/logo.svg", (_req, res) => {
    res.type("image/svg+xml").send(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 100"><rect width="240" height="100" rx="18" fill="#171717"/><circle cx="52" cy="50" r="28" fill="none" stroke="#d5a23a" stroke-width="3"/><circle cx="52" cy="22" r="6" fill="#d5a23a"/><text x="92" y="60" fill="#fff" font-family="Arial" font-size="30" font-weight="bold">DEXTER</text></svg>`)
})

router.post("/login", async (req, res) => {
    const { email, senha } = req.body
    if (!email || !senha) {
        res.status(400).json({ erro: "E-mail e senha obrigatórios" })
        return
    }
    try {
        const usuario = await prisma.usuario.findUnique({ where: { email } })
        if (!usuario) {
            res.status(400).json({ erro: "E-mail ou senha incorretos" })
            return
        }
        if (usuario.statusConta === "PENDENTE") {
            res.status(403).json({ erro: "Conta não ativa. Verifique a caixa de entrada de seu e-mail." })
            return
        }
        if (usuario.statusConta === "BANIDA") {
            res.status(403).json({ erro: "Conta suspensa, entre em contato com o suporte." })
            return
        }
        if (!bcrypt.compareSync(senha, usuario.senha)) {
            res.status(400).json({ erro: "E-mail ou senha incorretos" })
            return
        }
        const token = jwt.sign({ id: usuario.id, email: usuario.email, nivelAcesso: usuario.nivelAcesso }, process.env.JWT_SECRET as string, { expiresIn: "7d" })
        res.status(200).json({ mensagem: "Login bem-sucedido", token })
    } catch (error) {
        console.error("Erro no login:", error)
        res.status(500).json({ erro: "Erro no servidor" })
    }
})

router.post("/recuperar-senha", async (req, res) => {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : ""
    if (!email) {
        res.status(400).json({ erro: "Informe um e-mail válido." })
        return
    }
    try {
        const usuario = await prisma.usuario.findUnique({ where: { email } })
        if (usuario) {
            await prisma.token.updateMany({ where: { usuarioId: usuario.id, tipoToken: "REDEFINIR_SENHA", revogado: false }, data: { revogado: true } })
            const token = crypto.randomBytes(32).toString("hex")
            await prisma.token.create({ data: { usuarioId: usuario.id, token, tipoToken: "REDEFINIR_SENHA", expira: new Date(Date.now() + 15 * 60 * 1000) } })
            const apiPublica = process.env.API_PUBLIC_URL || "http://localhost:3000"
            const link = `${apiPublica}/auth/redefinir-senha?token=${token}`
            const logoUrl = process.env.EMAIL_LOGO_URL || `${apiPublica}/auth/logo.svg`
            const resultado = await transporter.sendMail({
                from: '"Dexter App" <support@dexterapp.com>',
                to: email,
                subject: "Redefina sua senha | Dexter",
                text: `Olá ${usuario.nome},\n\nClique no link para criar uma nova senha: ${link}\n\nO link expira em 15 minutos.`,
                html: `<!doctype html><html lang="pt-BR"><body style="margin:0;background:#f4f1eb;font-family:Arial,sans-serif;padding:32px 16px"><table role="presentation" width="100%" style="max-width:600px;margin:auto;background:#fff;border-radius:16px;overflow:hidden"><tr><td style="background:#171717;padding:24px;text-align:center"><img src="${logoUrl}" alt="Dexter" width="180"></td></tr><tr><td style="padding:36px"><h1>Recuperação de senha</h1><p style="font-size:16px;line-height:1.6">Olá, ${usuario.nome}. Recebemos uma solicitação para criar uma nova senha.</p><p><a href="${link}" style="display:inline-block;padding:15px 24px;border-radius:8px;background:#d5a23a;color:#171717;font-weight:bold;text-decoration:none">Criar nova senha</a></p><p style="font-size:13px;color:#777">Este link expira em 15 minutos. Se você não solicitou a recuperação, ignore esta mensagem.</p></td></tr><tr><td style="border-top:1px solid #eee;padding:20px;text-align:center;color:#777;font-size:13px">Dexter | Simplificando sua rotina</td></tr></table></body></html>`,
            })
            console.log(`E-mail de recuperação enviado para ${email}: ${resultado.messageId}`)
        }
        res.status(200).json({ mensagem: "Se o e-mail estiver cadastrado, enviaremos um link de recuperação." })
    } catch (error) {
        console.error("Erro ao enviar e-mail de recuperação:", error)
        res.status(500).json({ erro: "Não foi possível enviar o e-mail de recuperação." })
    }
})

router.get("/redefinir-senha", async (req, res) => {
    const token = typeof req.query.token === "string" ? req.query.token : ""
    const valido = token ? await prisma.token.findFirst({ where: { token, tipoToken: "REDEFINIR_SENHA", revogado: false, expira: { gt: new Date() } } }) : null
    if (!valido) {
        res.status(400).send(paginaRedefinicao("Este link é inválido ou expirou. Solicite uma nova recuperação."))
        return
    }
    res.send(paginaRedefinicao("Escolha uma senha com pelo menos 8 caracteres.").replace("{{TOKEN}}", token))
})

router.post("/redefinir-senha", async (req, res) => {
    const body = req.body ?? {}
    const token = typeof body.token === "string" ? body.token : ""
    const novaSenha = typeof body.novaSenha === "string" ? body.novaSenha : ""
    if (!token || novaSenha.length < 8) {
        res.status(400).send(paginaRedefinicao("A senha precisa ter pelo menos 8 caracteres.").replace("{{TOKEN}}", token))
        return
    }
    try {
        const tokenValido = await prisma.token.findFirst({ where: { token, tipoToken: "REDEFINIR_SENHA", revogado: false, expira: { gt: new Date() } } })
        if (!tokenValido) {
            res.status(400).send(paginaRedefinicao("Este link é inválido ou expirou."))
            return
        }
        const senha = await bcrypt.hash(novaSenha, 12)
        await prisma.$transaction([
            prisma.usuario.update({ where: { id: tokenValido.usuarioId }, data: { senha } }),
            prisma.token.update({ where: { id: tokenValido.id }, data: { revogado: true } }),
        ])
        res.send(paginaRedefinicao("Sua senha foi atualizada. Você já pode voltar ao aplicativo e fazer login.", true))
    } catch (error) {
        console.error("Erro ao redefinir senha:", error)
        res.status(500).send(paginaRedefinicao("Não foi possível atualizar a senha.", true))
    }
})

export default router
