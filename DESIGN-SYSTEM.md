# Design System — Lovisa Destinos

## Cores (CSS Variables)

Definidas no `:root` de cada arquivo HTML. Para mudar uma cor, altere o valor em **todos os 3 arquivos**.

```css
:root {
    --navy:      #1565C0;  /* Azul principal — headers, textos de destaque */
    --navy-dark: #0D47A1;  /* Azul escuro — backgrounds de seções, footer */
    --accent:    #F97316;  /* Laranja — botões CTA, destaques, ícones */
    --accent-d:  #EA6C0A;  /* Laranja escuro — hover dos botões */
    --gold:      #F97316;  /* Mesmo laranja (unificado) */
    --text:      #1A1F2E;  /* Texto principal — quase preto */
    --muted:     #6B7280;  /* Texto secundário — cinza médio */
    --bg:        #F8F9FC;  /* Background geral — cinza muito claro */
    --white:     #FFFFFF;  /* Branco puro */
    --border:    #E5E9F2;  /* Bordas e divisores */
    --wa:        #25D366;  /* Verde WhatsApp — nunca mudar */
}
```

### Paleta Visual Resumida
- **Primário:** Azul `#1565C0`
- **Destaque:** Laranja `#F97316`
- **Neutro:** Branco + cinza claro
- **WhatsApp:** Verde `#25D366`

---

## Tipografia

| Uso | Fonte | Peso |
|-----|-------|------|
| Títulos principais (hero, section) | Playfair Display | 400, 600, 700 |
| Corpo, nav, botões | System font (-apple-system, Segoe UI, etc.) | 400, 500, 600 |

Fonte carregada via Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
```

---

## Ícones

Font Awesome 6.4.0 via CDN:
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

Ícones usados frequentemente:
- WhatsApp: `fa-brands fa-whatsapp`
- Instagram: `fa-brands fa-instagram`
- Avião: `fa-solid fa-plane`
- Mapa: `fa-solid fa-location-dot`
- Check: `fa-solid fa-check`
- Coração: `fa-solid fa-heart`
- Bússola: `fa-solid fa-compass`

---

## Logo

- **Arquivo:** `logo.png`
- **Fundo:** Transparente
- **Cor principal:** Azul + texto azul "LOVISA DESTINOS"
- **Subtítulo na logo:** "AGÊNCIA DE VIAGENS"

### Uso nos arquivos:

**Header (fundo transparente/claro):**
```html
<img src="logo.png" alt="Lovisa Destinos" style="height:46px;width:auto;object-fit:contain;">
```

**Footer (fundo azul escuro — logo branca):**
```html
<img src="logo.png" alt="Lovisa Destinos" style="height:44px;width:auto;object-fit:contain;filter:brightness(0) invert(1);">
```

**Favicon (aba do navegador):**
```html
<link rel="icon" href="logo.png" type="image/png">
```

---

## Componentes Principais

### Botão CTA Principal (laranja)
```html
<a href="https://wa.me/5519995396281" class="btn btn-accent">
    <i class="fab fa-whatsapp"></i> Falar no WhatsApp
</a>
```

### Botão Secundário (azul escuro)
```html
<a href="#destinos" class="btn btn-navy">Ver Destinos</a>
```

### Botão Flutuante WhatsApp
Já incluído ao final do `<body>` em todos os arquivos:
```html
<a href="https://wa.me/5519995396281" class="wa" aria-label="WhatsApp">
    <i class="fab fa-whatsapp"></i>
</a>
```

### Card de Destino (index.html)
```html
<article class="dest-card rv" data-id="NOME_ID">
    <div class="dest-img">
        <img src="URL_DA_IMAGEM" alt="Nome do Destino" loading="lazy">
        <div class="dest-badge">País/Região</div>
    </div>
    <div class="dest-body">
        <h3>Nome do Pacote</h3>
        <p class="dest-loc"><i class="fa-solid fa-location-dot"></i> Cidade, País</p>
        <div class="dest-meta">
            <span><i class="fa-solid fa-moon"></i> X dias / Y noites</span>
            <span class="dest-price">R$ X.XXX / pessoa</span>
        </div>
        <a href="pacote.html?id=NOME_ID" class="btn btn-accent" style="width:100%;text-align:center;">
            Ver Roteiro <i class="fa-solid fa-arrow-right"></i>
        </a>
    </div>
</article>
```

---

## Layout e Responsividade

- **Desktop:** max-width 1200px centrado
- **Tablet:** ajustes de grid (2 colunas)
- **Mobile:** grid de 1 coluna, menu hamburger
- **Breakpoints principais:** 991px, 768px, 480px

---

## Imagens

Todas as imagens de destinos são carregadas do **Unsplash** via URL direta — não há arquivos de imagem locais (exceto a logo).

Formato padrão das URLs:
```
https://images.unsplash.com/photo-XXXXXXXXXX?auto=format&fit=crop&w=700&q=80
```
- `w=700` para cards (menor)
- `w=1200` para galeria de pacotes (maior)
