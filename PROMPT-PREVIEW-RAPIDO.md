# PROMPT — GERAR PREVIEW RÁPIDO (5–10 MINUTOS)
*Cole este prompt + DADOS-PREVIEW.md preenchido para gerar um site preview instantâneo*

---

## QUANDO USAR

Use este prompt quando um cliente potencial disse "quero ver" e você quer
mostrar um site com o nome/logo dele em menos de 10 minutos.

**NÃO use** o PROMPT-PARA-IA.md completo neste momento — ele é para o site definitivo.

---

## PROMPT PARA COLAR NA IA

```
Você vai criar um PREVIEW RÁPIDO de site para agência de viagens.

BASE DO PROJETO: C:\Users\win 10\Desktop\lovisa-destinos-site
(ou repositório: https://github.com/lucasferraripro/lovisa-destinos-site)

DADOS DA NOVA AGÊNCIA: (ver arquivo DADOS-PREVIEW.md em anexo)

TAREFA — faça SOMENTE isso, nesta ordem:

1. Copie todos os arquivos do projeto base para uma nova pasta:
   C:\Users\win 10\Desktop\[NOME-AGENCIA]-preview

2. Nos 4 arquivos de /api (auth.js, content.js, publish.js, upload.js):
   - Substitua: owner = 'lucasferraripro'
   - Por:       owner = '[USUARIO-GITHUB-LUCAS]'
   - Substitua: repo  = 'lovisa-destinos-site'
   - Por:       repo  = '[NOME-AGENCIA]-preview'

3. Em TODOS os arquivos HTML (index.html, sobre.html, pacote.html, clientes.html, 404.html, admin/login.html):
   - Substitua "Lovisa Destinos" pelo nome da nova agência
   - Substitua "5519995396281" pelo WhatsApp novo (só números)
   - Substitua "lovisadestinos" pelo @ do Instagram novo (se tiver)
   - Substitua "Brasil" / "Campinas, SP" pela cidade nova
   - Substitua "contato@lovisadestinos.com.br" pelo email (se tiver, senão manter)

4. Substitua logo.png pelo logo da nova agência
   (se for URL, baixe e salve como logo.png na raiz)

5. Redefina content.json para: {}

6. NÃO mexa em mais nada — pacotes, cores, textos de conteúdo, depoimentos,
   diferenciais, hero, tudo fica igual ao modelo Lovisa.

7. Após concluir, me diga:
   - Lista dos arquivos modificados
   - O comando git para fazer push
   - O nome exato do repositório para criar no GitHub
   - Confirme que está pronto para deploy no Vercel

NÃO MODIFICAR:
- editor.js
- vercel.json
- CSS (cores ficam iguais)
- Textos de conteúdo (ficam iguais ao modelo)
- Pacotes, depoimentos, fotos (ficam iguais ao modelo)

PRIORIDADE: velocidade. Isso deve levar menos de 5 minutos.
```

---

## DEPOIS QUE A IA TERMINAR — CHECKLIST MANUAL (5 MINUTOS)

- [ ] Criar repositório **público** no GitHub com o nome: `[nome-agencia]-preview`
- [ ] Fazer push dos arquivos da pasta gerada pela IA
- [ ] No Vercel: Add New Project → Import Git Repository → selecionar o repositório
- [ ] Adicionar variável de ambiente:
  - `GITHUB_TOKEN` = (seu token pessoal — pode usar o mesmo do projeto Lovisa)
  - `ADMIN_SECRET` = preview2025 (qualquer senha simples, não importa para preview)
- [ ] Clicar em Deploy
- [ ] Copiar a URL gerada (ex: `[nome-agencia]-preview.vercel.app`)
- [ ] Testar no celular antes de enviar

**Tempo total: ~5–10 minutos** ✅

---

## MENSAGEM PARA ENVIAR AO CLIENTE

```
[NOME], olha como ficou! 🎉

👉 [URL DO PREVIEW]

Abre no celular — ficou lindo! 📱

Esse é o modelo base. No site completo, personalizamos tudo:
seus pacotes reais, suas fotos, suas cores, seu texto...

O que achou? 😊
```

---

## DEPOIS DO PREVIEW: SE O CLIENTE QUISER O SITE COMPLETO

Use o **PROMPT-PARA-IA.md** e **DADOS-NOVA-EMPRESA.md** preenchido completamente.
O site completo inclui o painel de edição visual.

---

*Sistema criado para o projeto Lovisa Destinos — Abril 2026*
