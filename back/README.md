# Projeto-de-Desenvolvimento-1

Hmmm coquinha gelada...

## Recuperação de senha

O fluxo de recuperação usa um link único com validade de 15 minutos. Configure no
arquivo `.env`:

- `API_PUBLIC_URL`: URL pública do backend, acessível pelo dispositivo e pelo
  navegador que abrirá o link.
- `MAILTRAP_EMAIL` e `MAILTRAP_SENHA`: credenciais do SMTP usado para enviar os
  e-mails.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` e `SMTP_REQUIRE_TLS`: configuração
  opcional do transporte SMTP. Para o Mailtrap Sandbox, use
  `sandbox.smtp.mailtrap.io`, porta `587`, `SMTP_SECURE=false` e
  `SMTP_REQUIRE_TLS=true`.
- `EMAIL_LOGO_URL` (opcional): URL pública da logo para clientes de e-mail.
  Quando omitida, o backend usa `/auth/logo.svg`.
