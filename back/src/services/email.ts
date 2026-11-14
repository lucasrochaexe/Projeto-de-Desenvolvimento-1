type Email = { to: string; subject: string; text: string; html: string }

export async function enviarEmail({ to, subject, text, html }: Email) {
    const resposta = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "api-key": process.env.BREVO_API_KEY as string,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            sender: {
                name: process.env.EMAIL_FROM_NAME || "Dexter App",
                email: process.env.EMAIL_FROM_ADDRESS,
            },
            to: [{ email: to }],
            subject,
            textContent: text,
            htmlContent: html,
        }),
        signal: AbortSignal.timeout(10_000),
    })

    if (!resposta.ok) {
        throw new Error(`Falha ao enviar e-mail (${resposta.status}): ${await resposta.text()}`)
    }
    return (await resposta.json()) as { messageId: string }
}