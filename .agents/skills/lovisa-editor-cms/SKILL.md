# Skill: Lovisa Editor CMS

Use esta skill quando o pedido envolver painel admin, editor visual, rodape, imagens, pacotes ou `content.json`.

## Admin correto

Abrir sempre:

```text
https://www.lovisadestinos.com.br/admin/login.html
```

Email:

```text
admin@lovisadestinos.com.br
```

A senha vem de `ADMIN_SECRET` na Vercel.

## Arquivos envolvidos

- `editor.js`: interface do editor e fluxo de publicacao.
- `content.json`: conteudo salvo pelo painel.
- `api/content.js`: entrega o conteudo salvo.
- `api/publish.js`: grava o conteudo no GitHub.
- `api/upload.js`: sobe imagens para `imagens/uploads`.
- `pacote.html`: banco base dos pacotes e pagina dinamica.

## Publicacao pelo painel

O fluxo correto:

1. Admin abre `index.html?editor=1`.
2. `editor.js` carrega `/api/content`.
3. O usuario altera textos/imagens/pacotes.
4. `publishNow()` envia o CMS para `/api/publish`.
5. `/api/publish` commita `content.json` no GitHub.
6. Se houver `_packages`, gera `pacote-ID.html`.

## Pacotes

Ao adicionar pacote:

- Usar botao `Criar e publicar pacote`.
- Salvar pacote em `_packages`.
- Usar upload de imagem ou URL direta.
- Bloquear caminho local `C:\...`.
- Evitar link de post Instagram.

Comportamento esperado no `editor.js`:

- Existe `uploadImageFile`.
- Existe `publishNow`.
- `pAddPacote()` chama `publishNow()`.
- Apos sucesso, limpa `localStorage.removeItem(CMS_KEY)`.

## Regra sobre imagens antigas

Nao filtrar `data:image` automaticamente. Algumas imagens da cliente foram recuperadas nesse formato.

Se for otimizar, primeiro migrar a imagem para `imagens/uploads` e atualizar o campo no `content.json`.

## Depoimentos Google

Nos cards de depoimentos/avaliacoes:

- Usar somente fotos reais das avaliacoes do Google Maps da Lovisa.
- A fonte oficial das avaliacoes e o perfil Google Maps da Lovisa Destinos.
- Os avatares corretos estao hospedados localmente como `av-1.jpg`, `av-2.jpg`, `av-3.jpg`, `av-4.jpg`, `av-5.jpg`, `av-6.jpg`.
- Esses arquivos vieram dos links reais do Google e foram salvos localmente para nao quebrar por hotlink/bloqueio.
- Nunca substituir por fotos de banco, Unsplash, IA ou novas imagens "parecidas".
- Commits de referencia: `3d15201`, `09d063b`, `18fa128`.

## Rodape e contato

Campos corretos conhecidos:

- Email: `vendas@lovisadestinos.com.br`
- Atendimento comercial: `Atendimento das 09h00 às 17h00 seg a sex`
- Atendimento em destino: `Atendimento para clientes no destino 24hrs`

## Recuperacao de conteudo perdido

Se algo sumir:

```powershell
git log --stat -- content.json
git show <commit>:content.json
git diff <commit>..HEAD -- content.json
```

Commit de referencia com muitas edicoes recuperadas:

```text
d4b54ee Editor: atualiza conteúdo do site (11/05/2026, 10:20:26)
```

Commit de recuperacao:

```text
4b92bc0 Recupera conteudo salvo pelo painel Lovisa
```
