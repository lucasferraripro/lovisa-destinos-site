# PROMPT PARA IA — REPLICAR SITE DE AGÊNCIA DE VIAGENS

> Cole este prompt (ou adapte) ao iniciar uma nova conversa com Claude Code ou outra IA.
> Junto com este prompt, anexe o arquivo `DADOS-NOVA-EMPRESA.md` preenchido.

---

## PROMPT PRINCIPAL

```
Você vai replicar um site completo de agência de viagens para uma nova empresa.

Tenho um projeto base já funcionando (Lovisa Destinos) com:
- Site estático em HTML/CSS/JS
- Editor visual CMS (editor.js) — a dona edita o site sem saber programar
- API Vercel serverless (publish, content, upload de imagens)
- Deploy no Vercel + GitHub

Os arquivos base estão em: [CAMINHO LOCAL ou REPOSITÓRIO GITHUB]

Os dados da nova empresa estão no arquivo DADOS-NOVA-EMPRESA.md (em anexo).

TAREFAS EM ORDEM:
1. Leia REPLICAR-PARA-NOVA-EMPRESA.md completo
2. Leia DADOS-NOVA-EMPRESA.md completo
3. Crie uma cópia do projeto na pasta: [PASTA DESTINO]
4. Personalize todos os arquivos conforme o guia (Passo 3 do REPLICAR)
5. Atualize owner/repo nos 3 arquivos da pasta /api
6. Atualize credenciais em admin/login.html
7. Substitua o DB de pacotes em pacote.html com os pacotes da nova empresa
8. Redefina content.json para {}
9. Me dê o checklist do que ainda preciso fazer manualmente (GitHub, Vercel, domínio)

NÃO mexa em:
- editor.js (funciona igual para todas as empresas)
- vercel.json
- api/publish.js (só precisa mudar owner/repo)
- api/content.js (só precisa mudar owner/repo)
- api/upload.js (só precisa mudar owner/repo)
```

---

## CONTEXTO TÉCNICO PARA A IA

Cole também este bloco se a IA não tiver contexto do projeto:

```
ARQUITETURA DO PROJETO:
- index.html: home page com seções hero, destinos, diferenciais, depoimentos, contato, footer
- sobre.html: página sobre a empresa
- pacote.html: template dinâmico — lê ?id=PACOTE_ID da URL e renderiza o pacote do objeto DB
- editor.js: editor visual — qualquer elemento com data-eid="nome" fica editável ao entrar no modo editor
- content.json: CMS — chave=data-eid, valor={html, src, href, style}
- /api/content: GET — busca content.json do GitHub sem cache CDN
- /api/publish: POST — recebe {content, secret}, commita content.json no GitHub
- /api/upload: POST — recebe {filename, base64, secret}, salva imagem em imagens/uploads/ no GitHub

VARIÁVEIS VERCEL (env vars):
- GITHUB_TOKEN: token com permissão repo (leitura e escrita)
- ADMIN_SECRET: senha usada para validar publicações (deve ser igual à do admin/login.html)

O repositório PRECISA ser público (imagens servidas via raw.githubusercontent.com).

CSS VARS usadas pelo editor (atenção ao replicar):
- index.html/pacote.html usam: --navy, --navy-dark, --accent, --text, --wa
- sobre.html usa: --primary, --primary-dark, --accent, --text-dark, --wa
- editor.js já trata isso automaticamente (seta ambos os nomes ao aplicar cores)
```

---

## CHECKLIST MANUAL (O QUE A IA NÃO FAZ — VOCÊ PRECISA FAZER)

Após a IA personalizar os arquivos, você ainda precisa:

- [ ] Criar repositório no GitHub com o nome correto
- [ ] Fazer push dos arquivos personalizados
- [ ] Gerar GitHub Personal Access Token (escopo: repo)
- [ ] Criar projeto no Vercel importando o repositório
- [ ] Adicionar variáveis de ambiente no Vercel (GITHUB_TOKEN, ADMIN_SECRET)
- [ ] Fazer o primeiro deploy
- [ ] Testar login no /admin/login.html
- [ ] Configurar domínio personalizado (se tiver)
- [ ] Entregar URL + credenciais para o cliente

---

## MODELO DE ENTREGA PARA O CLIENTE

```
Olá [NOME]! Seu site está pronto 🎉

🌐 Site: https://DOMINIO.com.br
🔐 Editor: https://DOMINIO.com.br/admin/login.html
📧 Email: admin@EMPRESA.com.br
🔑 Senha: SENHA

Para editar o site:
1. Acesse o link do editor
2. Faça login com email e senha
3. Clique em qualquer texto ou imagem com borda laranja
4. Edite e clique em "Publicar"
5. Pronto — as mudanças aparecem em segundos!

Qualquer dúvida, é só chamar.
```

---

*Template criado a partir do projeto Lovisa Destinos — Abril 2026*
