# Design System — Lovisa Destinos
*Atualizado: Abril 2026*

---

## Cores (CSS Variables)

O projeto usa **dois conjuntos de variáveis** por razões históricas. O `editor.js` aplica aliases automaticamente.

### index.html · pacote.html · clientes.html · 404.html
```css
:root {
    --navy:      #1565C0;  /* Azul principal */
    --navy-dark: #0D47A1;  /* Azul escuro — hover, backgrounds */
    --accent:    #F97316;  /* Laranja — botões CTA */
    --accent-d:  #EA6C0A;  /* Laranja escuro — hover */
    --text:      #1A1F2E;  /* Texto principal */
    --muted:     #6B7280;  /* Texto secundário */
    --bg:        #F8F9FC;  /* Background cinza claro */
    --white:     #FFFFFF;
    --border:    #E5E9F2;
    --wa:        #25D366;  /* Verde WhatsApp — nunca alterar */
    --hh:        68px;     /* Altura do header */
}
```

### sobre.html
```css
:root {
    --primary:      #1565C0;
    --primary-dark: #0D47A1;
    --accent:       #F97316;
    --text-dark:    #1A1F2E;
    --wa:           #25D366;
}
```

---

## Tipografia

| Uso | Fonte | Peso |
|-----|-------|------|
| Títulos principais | Playfair Display | 400, 600, 700 |
| Corpo, nav, botões | System font stack | 400, 500, 600 |
| sobre.html | Inter | 300, 400, 500, 600, 700 |

**Carregamento não-bloqueante** (padrão em todos os HTML):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap"></noscript>
```

> **NUNCA** usar `<link rel="stylesheet">` diretamente para fontes externas — bloqueia a renderização.

---

## Ícones

Font Awesome 6.4.0 — também carregado de forma não-bloqueante:
```html
<link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"></noscript>
```

Ícones mais usados:
- WhatsApp: `fab fa-whatsapp`
- Instagram: `fab fa-instagram`
- Avião: `fa-solid fa-plane`
- Local: `fa-solid fa-location-dot`
- Check: `fa-solid fa-circle-check`
- X (não incluso): `fa-solid fa-circle-xmark`
- Bússola: `fa-solid fa-compass`
- Câmera: `fa-solid fa-camera-retro`

---

## Logo

- **Arquivo:** `logo.png`
- **Fundo:** Transparente
- **Tamanho mínimo:** 200×200px

### Uso:
```html
<!-- Header (fundo escuro — logo em círculo branco) -->
<div style="width:52px;height:52px;border-radius:50%;overflow:hidden;background:#fff;
    border:2px solid rgba(255,255,255,0.4);display:flex;align-items:center;justify-content:center;">
    <img src="logo.png" alt="Nome da Empresa" style="width:48px;height:48px;object-fit:contain;">
</div>

<!-- Footer (fundo escuro — logo invertida em branco) -->
<img src="logo.png" alt="Nome" style="height:44px;width:auto;filter:brightness(0) invert(1);">

<!-- Favicon -->
<link rel="icon" href="logo.png" type="image/png">
```

---

## Componentes Principais

### Botão CTA (laranja)
```html
<a href="https://wa.me/NUMERO" class="btn btn-accent">
    <i class="fab fa-whatsapp"></i> Falar no WhatsApp
</a>
```

### Botão Secundário (azul escuro)
```html
<a href="#destinos" class="btn btn-navy">Ver Destinos</a>
```

### Botão WhatsApp Flutuante
```html
<a href="https://wa.me/NUMERO" class="wa" aria-label="WhatsApp">
    <i class="fab fa-whatsapp"></i>
</a>
```

### Card de Destino (index.html)
```html
<a class="card-link rv" href="pacote.html?id=ID">
    <div class="card-img">
        <img src="URL" alt="Destino" loading="lazy" decoding="async"
             data-eid="card1-img" data-elabel="Foto Destino">
        <div class="card-overlay">
            <span class="card-flag">🌊</span>
        </div>
    </div>
    <div class="card-body">
        <div class="card-loc"><i class="fa-solid fa-location-dot"></i> Cidade, Estado</div>
        <h3 class="card-title" data-eid="card1-title" data-elabel="Nome Destino 1">Nome do Destino</h3>
        <div class="card-price">A partir de <strong>R$ 3.890</strong></div>
        <div class="card-cta">Ver roteiro <i class="fa-solid fa-arrow-right"></i></div>
    </div>
</a>
```

---

## Layout e Responsividade

- **Mobile-first:** prioridade máxima — site é acessado principalmente pelo celular
- **Container:** max-width 1200px centrado, padding lateral 20px
- **Breakpoints:** 480px · 600px · 768px · 900px · 991px
- **Header height:** `--hh: 68px` (compensa com `padding-top` no body e `scroll-padding-top`)

### Regras mobile obrigatórias:
- Inputs e selects: `font-size: 16px` mínimo (evita zoom no iOS)
- Botões: altura mínima 44px (área de toque Apple HIG)
- Nenhum scroll horizontal
- Imagens: `width: 100%; height: auto; object-fit: cover`

---

## Imagens

### Padrão de URL (Unsplash):
```
https://images.unsplash.com/photo-XXXXXXXXXX?auto=format&fit=crop&w=700&q=80
```
- `w=700` para cards
- `w=1200` para hero e slides de carrossel

### Atributos obrigatórios:
```html
<!-- Cards (acima do fold — primeiros 3) -->
<img src="..." alt="..." loading="eager" decoding="async" data-eid="...">

<!-- Demais imagens -->
<img src="..." alt="..." loading="lazy" decoding="async" data-eid="...">
```

### Carrossel (pacote.html):
- Slides e miniaturas compartilham o **mesmo `data-eid`** (ex: `lencois-pkg-img-0`)
- Isso garante que ao editar pelo painel, slide + miniatura atualizam juntos

### Uploads pelo editor:
- Salvos em `imagens/uploads/` no GitHub
- URL permanente: `https://raw.githubusercontent.com/OWNER/REPO/master/imagens/uploads/ARQUIVO`

---

## data-eid — Convenção de Nomes

| Página | Padrão | Exemplo |
|--------|--------|---------|
| index.html — cards | `card{N}-img`, `card{N}-title` | `card1-img` |
| index.html — depoimentos | `dep-{N}-foto`, `dep-{N}-nome` | `dep-1-foto` |
| index.html — hero | `hero-title`, `hero-sub` | `hero-title` |
| pacote.html — imagens | `{id}-pkg-img-{N}` | `lencois-pkg-img-0` |
| pacote.html — textos | `{id}-pkg-title`, `{id}-pkg-desc` | `lencois-pkg-title` |
| sobre.html | `sobre-*` | `sobre-hero-title` |
| clientes.html | `insta-img-{N}`, `insta-txt-{N}` | `insta-img-1` |

> **Regra:** IDs únicos por página. Em pacote.html, prefixar com o ID do pacote para evitar conflito entre destinos.

---

*Criado para o projeto Lovisa Destinos — Atualizado Abril 2026*
