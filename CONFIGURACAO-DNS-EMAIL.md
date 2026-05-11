# Configuração DNS e E-mail — Lovisa Destinos

## Situação atual (atualizado em 06/05/2026)

### Site
- **Hospedagem**: Vercel
- **Domínio**: lovisadestinos.com.br (registrado no Registro.br)
- **DNS gerenciado pelo**: Registro.br (servidores próprios)

### Zona DNS no Registro.br — Configuração completa

| Tipo | Nome | Dados |
|------|------|-------|
| A | lovisadestinos.com.br | 76.76.21.21 (Vercel) |
| MX | lovisadestinos.com.br | 10 smtpin.terra.com.br |
| TXT | lovisadestinos.com.br | "v=spf1 include:terra.com.br ~all" |
| CNAME | www.lovisadestinos.com.br | lovisadestinos.com.br |

---

## E-mail

- **Provedor**: Terra Empresas (plano pago, 5 caixas)
- **Servidor de entrada (MX)**: `smtpin.terra.com.br` (prioridade 10)
- **Servidor de saída (SMTP)**: `smtp.terra.com.br`
- **Porta SMTP**: 587 (TLS) ou 465 (SSL)

### Caixas de e-mail ativas
- Gerenciadas no painel do Terra Empresas
- Acesso webmail: https://webmail.terra.com.br

---

## Histórico

- Domínio registrado no Registro.br em 16/08/2024
- Anteriormente apontava para o Terra (site + e-mail)
- Em 05/05/2026: site migrado para Vercel, e-mail mantido no Terra — registro MX adicionado
- Em 06/05/2026: erro `550 5.7.1 sender rejected` ao enviar email pelo webmail do Terra
  - Causa: falta do registro SPF (TXT) na zona DNS
  - Solução: adicionado registro TXT com `v=spf1 include:terra.com.br ~all` no Registro.br

---

## Observações importantes

- O Vercel **não oferece serviço de e-mail** — o e-mail fica no Terra separadamente
- Se precisar trocar o provedor de e-mail no futuro, basta alterar o registro MX no Registro.br
- Renovação do domínio: **16/08/2026**
- Se o email ainda não funcionar após 2 horas, verificar no painel do Terra Empresas:
  - Se a caixa de email está criada e ativa
  - Se o plano está vigente e não suspenso
  - Se a senha da conta está correta
