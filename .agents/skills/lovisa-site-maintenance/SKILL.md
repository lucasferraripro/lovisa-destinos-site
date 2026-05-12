# Skill: Lovisa Site Maintenance

Use esta skill sempre que for analisar, corrigir ou manter o site Lovisa Destinos.

## Regra principal

O site oficial e:

```text
https://www.lovisadestinos.com.br/
```

O admin correto e:

```text
https://www.lovisadestinos.com.br/admin/login.html
```

O projeto Vercel oficial e:

```text
lovisa-destinos-site
```

Nao assumir que `.vercel/project.json` esta correto. Ele pode apontar para `lovisa-destinos`, que nao deve ser usado como referencia do dominio oficial.

## Antes de mexer

1. Ler `.agents/project-memory/LOVISA_OPERACAO_OFICIAL.md`.
2. Rodar:

```powershell
git status --short
git log --oneline -8
cmd /c "set NODE_OPTIONS=--use-system-ca && npx --yes vercel inspect www.lovisadestinos.com.br"
```

3. Confirmar que `www.lovisadestinos.com.br` aponta para projeto `lovisa-destinos-site`.
4. Identificar se existem alteracoes locais fora do escopo, especialmente `graphify-out`.

## Conteudo editado pelo painel

As edicoes da cliente ficam em `content.json`.

Antes de alterar ou limpar esse arquivo:

```powershell
git log --stat -- content.json
git diff --stat -- content.json
```

Se a alteracao remove muitas linhas, interromper e investigar. Isso pode apagar edicoes do painel.

## Imagens

Nao remover imagens `data:image` do `content.json` sem migrar para arquivo real em `imagens/uploads` e atualizar a referencia.

O projeto tem conteudo legado recuperado com `data:image`, inclusive `dif-img`.

## Validacao minima

Apos ajuste, validar:

```powershell
cmd /c "set NODE_OPTIONS=--use-system-ca && node -e ""(async()=>{const r=await fetch('https://www.lovisadestinos.com.br/api/content?_='+Date.now());const j=await r.json();console.log(Object.keys(j).length,j['dif-img']&&!!j['dif-img'].src,j.whatsapp,j['info-email']&&j['info-email'].html)})()"""
```

Esperado apos recuperacao:

- Muitas chaves no JSON, por volta de 66 ou mais.
- `dif-img` presente.
- WhatsApp presente.
- Email `vendas@lovisadestinos.com.br`.

