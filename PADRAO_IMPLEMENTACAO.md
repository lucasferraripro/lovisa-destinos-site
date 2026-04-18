# 🏆 Lovisa Standard: Guia de Implementação Premium
Este documento define o padrão de qualidade e implementação técnica para sites de vendas e agências, garantindo estética premium e robustez técnica.

---

## ⭐️ 1. Componente: Google Reviews Authentic
Transforma depoimentos simples em provas sociais de alta autoridade.

### CSS (Design System)
Adicione ao seu arquivo CSS/Style:
```css
/* Fundo da seção: Cinza claro Google */
.dep-bg { background: #F1F3F4; }

/* Card de Depoimento */
.dep-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,.12), 0 2px 8px rgba(0,0,0,.06);
    transition: all .25s;
    display: flex; flex-direction: column; gap: 12px;
}
.dep-card:hover { box-shadow: 0 4px 18px rgba(0,0,0,.16); transform: translateY(-3px); }

/* Header do Card */
.dep-header { display: flex; align-items: center; justify-content: space-between; }
.dep-user { display: flex; align-items: center; gap: 10px; }
.dep-av {
    width: 40px; height: 40px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; font-weight: 700; color: #fff;
}
.dep-name { font-size: 14px; font-weight: 600; color: #202124; }
.dep-dest { font-size: 12px; color: #70757A; }

/* Estrela Amarela Google (#FBBC04) */
.dep-stars i { color: #FBBC04; font-size: 14px; }

/* Link "Ver no Google" */
.dep-link { font-size: 12px; color: #1A73E8; font-weight: 600; text-decoration: none; }
```

---

## 📸 2. Estratégia: Imagens do Instagram Persistence
**REGRA DE OURO:** NUNCA use links diretos do CDN do Instagram (`instagram.fna.fbcdn.net`). Eles expiram em 24h.

**Passo a passo:**
1. Acesse o post do Instagram.
2. Baixe a imagem original.
3. Salve na pasta raiz do projeto (ex: `img-insta-1.jpg`).
4. Aponte o `<img src="img-insta-1.jpg">` localmente.
5. Isso garante que o site nunca apresente "imagem quebrada".

---

## 🏜 3. Hero Section & Performance
- **Evite GIFs no fundo do Hero:** Eles tornam o site amador e pesado (2MB+).
- **Use Imagens Estáticas com Overlay:** Uma foto de alta resolução (Unsplash) com um gradiente escuro (`linear-gradient`) garante legibilidade do texto e carregamento instantâneo.
- **Padrão de Gradiente:** `rgba(0,0,0,0.4)` a `rgba(0,0,0,0.7)`.

---

## 🔠 4. Manutenção de Encoding (Acentos)
Para evitar que "Início" vire "InÃ-cio":
1. **Sempre salve em UTF-8 SEM BOM.**
2. **Meta Tag:** Certifique-se que `<meta charset="UTF-8">` é a primeira tag no `<head>`.
3. **Aviso Técnico:** Evite usar o comando `Set-Content` do PowerShell padrão; use scripts Python ou editores modernos (VS Code) para manipulação de arquivos.

---

## 🛠 5. Painel Admin (editor.js)
Para manter o site editável:
1. Identifique cada elemento com `data-eid="id-unico"`.
2. Adicione `data-elabel="Nome do Campo"` para o usuário saber o que está editando.
3. Use o `editor.js` para capturar essas IDs e salvar no `content.json`.

---

## 🚀 6. Fluxo de Deploy
- **Git Flow:** Sempre faça `git add .`, `git commit -m "update"`, `git push`.
- **Vercel:** O deploy deve ser automático via GitHub para garantir que o cliente veja a mudança em segundos.

---

## 🔑 7. Variáveis de Ambiente (Vercel API)
Para que o botão **Publicar** funcione ao trocar de projeto ou repositório, você DEVE configurar estas chaves nas "Environment Variables" da Vercel:

1. `GITHUB_REPO`: O nome do repositório (ex: `lovisa-destinos-site`).
2. `GITHUB_OWNER`: O seu usuário do GitHub (ex: `lucasferraripro`).
3. `GITHUB_TOKEN`: O token de acesso pessoal do GitHub para permitir o commit via API.
4. `ADMIN_SECRET`: A senha do painel admin (ex: `Lovisa@2025`).

**Dica técnica:** O arquivo `api/publish.js` deve sempre ler `process.env.GITHUB_REPO` para nunca ficar "travado" em um projeto antigo.

---
*Gerado por Antigravity AI - Padrão de Excelência Lovisa Destinos 2025*
