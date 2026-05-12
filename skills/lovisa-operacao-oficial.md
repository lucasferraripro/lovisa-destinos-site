# Lovisa - operacao oficial para IA

Use este arquivo como resumo rapido antes de qualquer ajuste no site Lovisa.

## Site correto

- Site oficial: https://www.lovisadestinos.com.br/
- Admin correto: https://www.lovisadestinos.com.br/admin/login.html
- GitHub: https://github.com/lucasferraripro/lovisa-destinos-site
- Branch: master
- Vercel oficial: `lovisa-destinos-site`

## Nao confundir

Existe `lovisa-destinos` no Vercel. Ele nao e a referencia do dominio oficial.

Sempre confirmar com:

```powershell
cmd /c "set NODE_OPTIONS=--use-system-ca && npx --yes vercel inspect www.lovisadestinos.com.br"
```

## Regra de seguranca

Antes de mexer em `content.json`, leia:

- `.agents/project-memory/LOVISA_OPERACAO_OFICIAL.md`
- `.agents/project-memory/INCIDENTE_2026-05-12_RECUPERACAO.md`

Nunca apagar ou reduzir `content.json` sem comparar historico.

## Commits de recuperacao

- `4b92bc0`: recupera conteudo salvo pelo painel.
- `effa6bf`: restaura fotos do pacote Disney.

