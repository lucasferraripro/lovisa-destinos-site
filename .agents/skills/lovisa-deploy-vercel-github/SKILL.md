# Skill: Lovisa Deploy Vercel GitHub

Use esta skill quando for publicar, restaurar, conferir dominios ou mexer em Vercel/GitHub da Lovisa.

## Fonte oficial

- GitHub: `lucasferraripro/lovisa-destinos-site`
- Branch: `master`
- Projeto Vercel do dominio oficial: `lovisa-destinos-site`
- Dominio oficial: `www.lovisadestinos.com.br`

## Alerta de projeto duplicado

Existe projeto `lovisa-destinos`. Nao confundir com `lovisa-destinos-site`.

Se usar `npx vercel --prod` dentro desta pasta, pode publicar no projeto errado porque `.vercel/project.json` ja apontou para `lovisa-destinos`.

## Checklist antes de publicar

1. Confirmar diff:

```powershell
git status --short
git diff --stat
git diff --cached --stat
```

2. Confirmar projeto do dominio oficial:

```powershell
cmd /c "set NODE_OPTIONS=--use-system-ca && npx --yes vercel inspect www.lovisadestinos.com.br"
```

3. Se mexeu em `content.json`, verificar que nao perdeu conteudo:

```powershell
git diff --stat -- content.json
```

4. Fazer commit e push para `master`.

```powershell
git add <arquivos>
git commit -m "mensagem"
git push origin master
```

5. Preferir deploy automatico do Vercel pelo GitHub no projeto `lovisa-destinos-site`.

## Restaurar dominio oficial para deployment anterior

Se precisar restaurar rapidamente:

```powershell
cmd /c "set NODE_OPTIONS=--use-system-ca && npx --yes vercel ls lovisa-destinos-site"
cmd /c "set NODE_OPTIONS=--use-system-ca && npx --yes vercel inspect www.lovisadestinos.com.br"
cmd /c "set NODE_OPTIONS=--use-system-ca && npx --yes vercel alias set <deployment>.vercel.app www.lovisadestinos.com.br"
cmd /c "set NODE_OPTIONS=--use-system-ca && npx --yes vercel alias set <deployment>.vercel.app lovisadestinos.com.br"
```

Deployment de referencia que salvou a operacao em 2026-05-12:

```text
lovisa-destinos-site-by9ki7t9v-lucasferraris-projects-65d9de34.vercel.app
```

## Validacao pos-publicacao

```powershell
cmd /c "set NODE_OPTIONS=--use-system-ca && npx --yes vercel inspect www.lovisadestinos.com.br"
cmd /c "set NODE_OPTIONS=--use-system-ca && node -e ""(async()=>{const h=await (await fetch('https://www.lovisadestinos.com.br/?_='+Date.now())).text(); const c=await (await fetch('https://www.lovisadestinos.com.br/api/content?_='+Date.now())).json(); console.log(h.length,Object.keys(c).length,c.whatsapp,c['info-email']&&c['info-email'].html)})()"""
```

