# Skill: Fazer Deploy (Publicar Atualizações)

## O que esta skill faz
Publica as alterações feitas nos arquivos HTML para que fiquem visíveis no site ao vivo.

---

## Plataformas de Deploy

| Plataforma | URL do site | Status |
|------------|-------------|--------|
| **Vercel** | https://lovisa-destinos.vercel.app | ativo (produção) |
| **GitHub** | https://github.com/lucasferraripro/lovisa-destinos-site | repositório fonte |

---

## Método 1 — Via GitHub (recomendado)

O Vercel está conectado ao GitHub. Ao fazer push no GitHub, o Vercel atualiza automaticamente.

### Passo a passo no terminal:

```bash
# 1. Navegar para a pasta do projeto
cd "C:/Users/win 10/Desktop/lovisa-destinos-site"

# 2. Ver o que foi alterado
git status

# 3. Adicionar todos os arquivos modificados
git add .

# 4. Criar o commit com descrição da mudança
git commit -m "Descrição do que foi alterado"

# 5. Enviar para o GitHub
git push

# O Vercel detecta o push e faz o deploy automaticamente em ~30 segundos
```

---

## Método 2 — Via Vercel CLI (direto)

```bash
cd "C:/Users/win 10/Desktop/lovisa-destinos-site"
vercel --prod --yes --scope lucasferraris-projects-65d9de34
```

---

## Método 3 — Via Netlify (alternativa)

1. Acesse https://netlify.com e faça login
2. Clique em "Add new site" → "Import from Git"
3. Selecione o repositório `lucasferraripro/lovisa-destinos-site`
4. Branch: `master`, sem build command, publish dir: `.` (raiz)
5. Deploy!

---

## Método 4 — Via GitHub Pages (gratuito)

1. Acesse https://github.com/lucasferraripro/lovisa-destinos-site
2. Clique em "Settings" → "Pages"
3. Source: "Deploy from a branch"
4. Branch: `master`, folder: `/ (root)`
5. Save — URL gerada: `https://lucasferraripro.github.io/lovisa-destinos-site`

---

## Verificar se o deploy funcionou

Após o push, acessar: https://lovisa-destinos.vercel.app
Aguardar 30-60 segundos para o Vercel atualizar.

Para ver o log do deploy: https://vercel.com/lucasferraris-projects-65d9de34/lovisa-destinos

---

## Estrutura de commits recomendada

```bash
git commit -m "Adiciona pacote: Cancún"
git commit -m "Atualiza telefone WhatsApp"
git commit -m "Troca cor principal para verde"
git commit -m "Corrige texto da seção hero"
git commit -m "Adiciona depoimento novo"
```
