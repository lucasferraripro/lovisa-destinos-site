# Incidente 2026-05-12 - Lovisa Destinos

## O que aconteceu

Havia dois projetos Vercel com nomes parecidos:

- `lovisa-destinos-site`: projeto correto do dominio oficial.
- `lovisa-destinos`: projeto paralelo/ambiente confundidor.

Durante manutencao, houve mistura entre esses ambientes e commits que reduziram o `content.json`. Como `/api/content` busca o `content.json` direto do GitHub, parte das edicoes feitas pela cliente no painel deixou de aparecer mesmo apos voltar alias/deployment.

## Sintomas vistos

- Foto da Vania/area da equipe parecia antiga.
- Cores e imagens editadas no painel sumiram.
- Pagina Disney ficou sem fotos.
- `/api/content` chegou a retornar apenas 11 chaves, quando o estado recuperado tinha 66.

## Causa raiz

1. Confiar no projeto local `.vercel/project.json`, que apontava para `lovisa-destinos`, e nao no dominio oficial.
2. Alterar/publicar sem preservar integralmente `content.json`.
3. Filtro novo em API/editor bloqueava `data:image`, mas a cliente tinha imagem salva nesse formato.

## Correcoes feitas

- Dominio oficial confirmado no projeto Vercel `lovisa-destinos-site`.
- `content.json` recuperado do commit `d4b54ee`.
- `/api/content` voltou a entregar o JSON sem limpar campos salvos.
- `api/publish.js` e `editor.js` voltaram a aceitar `data:image` para nao apagar conteudo legado.
- Fotos Disney restauradas no `pacote.html`.

## Commits importantes

- `d4b54ee`: conteudo salvo pelo painel em 2026-05-11 10:20.
- `4b92bc0`: recupera conteudo salvo pelo painel Lovisa.
- `effa6bf`: restaura fotos do pacote Disney.

## Como evitar repetir

Antes de qualquer deploy:

1. Rodar `vercel inspect www.lovisadestinos.com.br`.
2. Confirmar que o projeto e `lovisa-destinos-site`.
3. Verificar `git diff --stat`.
4. Se `content.json` estiver perdendo muitas linhas, parar.
5. Nunca fazer deploy manual pelo projeto `lovisa-destinos` achando que e o oficial.

