# Lovisa Destinos - memoria operacional oficial

Atualizado em: 2026-05-12

## Identidade do projeto

- Cliente/site: Lovisa Destinos
- Dominio oficial: https://www.lovisadestinos.com.br/
- Dominio sem www: https://lovisadestinos.com.br/
- Admin correto: https://www.lovisadestinos.com.br/admin/login.html
- Repositorio GitHub oficial: https://github.com/lucasferraripro/lovisa-destinos-site
- Branch de producao: master
- Projeto Vercel oficial em producao: lovisa-destinos-site

## Cuidado critico

Existe outro projeto Vercel chamado `lovisa-destinos`.

A pasta local `.vercel/project.json` pode apontar para:

```json
{"projectName":"lovisa-destinos"}
```

Esse NAO deve ser tratado como o projeto oficial do dominio `www.lovisadestinos.com.br`.

Antes de qualquer deploy manual, confirmar:

```powershell
cmd /c "set NODE_OPTIONS=--use-system-ca && npx --yes vercel inspect www.lovisadestinos.com.br"
```

O retorno correto deve mostrar:

- `name lovisa-destinos-site`
- alias `https://www.lovisadestinos.com.br`
- alias `https://lovisadestinos.com.br`

## Estado recuperado apos incidente

Em 2026-05-12 houve confusao entre dois projetos Vercel. O dominio oficial chegou a apontar para conteudo que parecia antigo porque o `content.json` atual tinha perdido varias edicoes feitas pelo painel.

Recuperacao feita:

- Deployment oficial restaurado inicialmente para `lovisa-destinos-site-by9ki7t9v...`, criado em 2026-05-11 19:44.
- Conteudo salvo pelo painel recuperado do commit `d4b54ee`, de 2026-05-11 10:20:26.
- Commit de recuperacao: `4b92bc0 Recupera conteudo salvo pelo painel Lovisa`.
- Fotos Disney restauradas no commit: `effa6bf Restaura fotos do pacote Disney`.

Validacao feita em producao:

- `/api/content` voltou com 66 campos.
- `dif-img` voltou com `data:image`.
- `vania-foto` voltou apontando para upload em `imagens/uploads/1777664566310_img_2346.jpg.jpeg`.
- WhatsApp recuperado: `5519995396281`.
- Email recuperado: `vendas@lovisadestinos.com.br`.
- Cor primaria recuperada no CMS: `#000000`.

## Como o site funciona

O site e estatico, com algumas APIs serverless na Vercel.

Arquivos principais:

- `index.html`: home.
- `pacote.html`: pagina dinamica de pacotes via query `?id=...`.
- `sobre.html`: pagina sobre.
- `clientes.html`: pagina de clientes/depoimentos.
- `editor.js`: editor visual/admin.
- `content.json`: conteudo salvo pelo painel.
- `admin/login.html`: login do painel.
- `api/auth.js`: valida senha do admin.
- `api/content.js`: busca `content.json` no GitHub.
- `api/publish.js`: grava alteracoes no GitHub e gera paginas de pacote.
- `api/upload.js`: envia imagens para `imagens/uploads`.

## Fluxo correto do painel

1. Entrar em `https://www.lovisadestinos.com.br/admin/login.html`.
2. Usar email `admin@lovisadestinos.com.br`.
3. Usar a senha configurada em `ADMIN_SECRET` no Vercel.
4. O login abre `../index.html?editor=1`.
5. O editor carrega `/api/content`.
6. Ao publicar, `/api/publish` grava `content.json` no GitHub.
7. A Vercel faz deploy automatico do projeto `lovisa-destinos-site`.

## Regra de ouro para preservar edicoes da cliente

Nunca substituir `content.json` por uma versao menor sem comparar com o historico.

Antes de mexer em `content.json`, rodar:

```powershell
git log --stat -- content.json
git diff --stat HEAD~1..HEAD -- content.json
```

Se uma mudanca remover dezenas/centenas de linhas do `content.json`, parar e investigar. Pode estar apagando edicoes feitas pela cliente no painel.

## Imagens no CMS

O projeto historicamente salvou algumas imagens como `data:image` dentro do `content.json`. Isso nao e ideal para performance, mas faz parte do conteudo recuperado da cliente.

Nao filtrar `data:image` em `/api/content`, senao fotos antigas somem da pagina.

Para novos pacotes, preferir upload por `/api/upload`, que salva em `imagens/uploads`.

## Depoimentos e avaliacoes do Google

Fonte oficial das avaliacoes da Lovisa:

```text
https://www.google.com/maps/place/Lovisa+Destinos/@-13.3722091,-73.1397804,4z/data=!4m8!3m7!1s0x496312acd36d9057:0xbe12502a7a172777!8m2!3d-14.4095262!4d-51.31668!9m1!1b1!16s%2Fg%2F11wtlj2xps
```

Regra obrigatoria:

- Nao usar fotos genericas, Unsplash, IA ou banco de imagem nos depoimentos.
- As fotos corretas dos depoimentos sao as fotos reais das avaliacoes do Google, hospedadas localmente para evitar bloqueio/expiracao dos links do Google.
- Arquivos corretos no projeto: `av-1.jpg`, `av-2.jpg`, `av-3.jpg`, `av-4.jpg`, `av-5.jpg`, `av-6.jpg`.
- O commit `09d063b fix: hospedagem local de avatares para evitar bloqueio do Google` adicionou esses arquivos locais.
- O commit `3d15201 fix: fotos reais nos depoimentos via tags img para maxima compatibilidade` mostra os links originais `lh3.googleusercontent.com`.
- O commit `18fa128 fix: adiciona foto da Kenia corretamente` ja usava `av-1.jpg` a `av-6.jpg`.

Se as fotos dos depoimentos sumirem ou forem trocadas, restaurar somente para `av-1.jpg` a `av-6.jpg`, mantendo os nomes/textos das avaliacoes reais. Nunca substituir por novas fotos.

## Pacotes

O pacote Disney usa imagens oficiais restauradas no `pacote.html`.

Para criar novo pacote pelo painel:

1. Entrar pelo admin oficial.
2. Clicar em `Pacotes`.
3. Preencher ID, titulo, preco e demais campos.
4. Usar upload de imagens ou URLs diretas de imagens.
5. Nao colar caminho local tipo `C:\Users\...\foto.jpg`.
6. Clicar em `Criar e publicar pacote`.

O editor deve:

- Enviar imagens via `/api/upload`.
- Salvar o pacote em `_packages` dentro do `content.json`.
- Chamar `publishNow()`.
- Gravar no GitHub.
- Criar `pacote-ID.html` quando aplicavel.

## Restauracao rapida

Se o site oficial ficar errado, primeiro nao fazer novo deploy.

Investigar:

```powershell
cmd /c "set NODE_OPTIONS=--use-system-ca && npx --yes vercel inspect www.lovisadestinos.com.br"
git log --oneline -20
git log --stat -- content.json
```

Para restaurar alias do dominio oficial para um deployment conhecido:

```powershell
cmd /c "set NODE_OPTIONS=--use-system-ca && npx --yes vercel alias set <deployment>.vercel.app www.lovisadestinos.com.br"
cmd /c "set NODE_OPTIONS=--use-system-ca && npx --yes vercel alias set <deployment>.vercel.app lovisadestinos.com.br"
```

Deployment bom usado na recuperacao:

```text
lovisa-destinos-site-by9ki7t9v-lucasferraris-projects-65d9de34.vercel.app
```

Conteudo bom recuperado:

```text
d4b54ee Editor: atualiza conteúdo do site (11/05/2026, 10:20:26)
```
