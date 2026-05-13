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

## Depoimentos Google

Fonte oficial:

```text
https://www.google.com/maps/place/Lovisa+Destinos/@-13.3722091,-73.1397804,4z/data=!4m8!3m7!1s0x496312acd36d9057:0xbe12502a7a172777!8m2!3d-14.4095262!4d-51.31668!9m1!1b1!16s%2Fg%2F11wtlj2xps
```

Regra critica:

- As fotos dos depoimentos devem ser as fotos reais das avaliacoes do Google.
- Nao trocar por fotos genericas, Unsplash, IA ou banco de imagem.
- Usar os arquivos locais `av-1.jpg` ate `av-6.jpg`, que foram salvos para evitar bloqueio dos links do Google.
- Referencias no historico: `3d15201` mostra links originais do Google; `09d063b` salva os avatares localmente; `18fa128` usa `av-1.jpg` a `av-6.jpg`.
- Se precisar corrigir depoimentos, restaurar essas imagens locais e preservar nomes/textos das avaliacoes.

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
