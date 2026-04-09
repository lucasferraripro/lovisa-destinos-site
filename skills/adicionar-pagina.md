# Skill: Criar Nova Página

## O que esta skill faz
Cria uma nova página HTML no site mantendo o mesmo visual (header, footer, cores, logo).

---

## Template base para nova página

Copie este HTML completo e edite o conteúdo dentro de `<main>`:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TITULO DA PAGINA — Lovisa Destinos</title>
    <link rel="icon" href="logo.png" type="image/png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --navy:      #1565C0;
            --navy-dark: #0D47A1;
            --accent:    #F97316;
            --accent-d:  #EA6C0A;
            --text:      #1A1F2E;
            --muted:     #6B7280;
            --bg:        #F8F9FC;
            --white:     #FFFFFF;
            --border:    #E5E9F2;
            --wa:        #25D366;
        }
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: var(--text); background: var(--bg); }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

        /* HEADER */
        header { height: 70px; background: white; border-bottom: 1px solid var(--border); display: flex; align-items: center; position: sticky; top: 0; z-index: 100; }
        header .container { display: flex; justify-content: space-between; align-items: center; width: 100%; }
        .logo { text-decoration: none; }
        .logo img { height: 46px; width: auto; object-fit: contain; }
        .btn-wa { background: var(--accent); color: white; padding: 10px 20px; border-radius: 10px; text-decoration: none; font-weight: 700; display: flex; align-items: center; gap: 8px; }

        /* HERO DA PÁGINA */
        .page-hero { background: linear-gradient(135deg, var(--navy-dark), var(--navy)); color: white; padding: 70px 0; text-align: center; }
        .page-hero h1 { font-family: 'Playfair Display', serif; font-size: 2.8rem; margin-bottom: 12px; }
        .page-hero p { opacity: 0.8; font-size: 1.1rem; }

        /* CONTEÚDO */
        main { padding: 80px 0; }

        /* FOOTER */
        footer { background: var(--navy-dark); color: white; padding: 40px 0; text-align: center; font-size: .9rem; }
        footer a { color: rgba(255,255,255,0.7); text-decoration: none; margin: 0 8px; }
        footer a:hover { color: var(--accent); }

        /* BOTÃO FLUTUANTE */
        .wa-float { position: fixed; bottom: 24px; right: 24px; width: 56px; height: 56px; background: var(--wa); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; z-index: 888; box-shadow: 0 6px 18px rgba(37,211,102,.4); text-decoration: none; transition: transform .2s; }
        .wa-float:hover { transform: scale(1.1); }
    </style>
</head>
<body>

<header>
    <div class="container">
        <a href="index.html" class="logo"><img src="logo.png" alt="Lovisa Destinos"></a>
        <a href="https://wa.me/5519995396281" class="btn-wa"><i class="fab fa-whatsapp"></i> WhatsApp</a>
    </div>
</header>

<div class="page-hero">
    <div class="container">
        <h1>Título da Página</h1>
        <p>Subtítulo opcional</p>
    </div>
</div>

<main>
    <div class="container">
        <!-- CONTEÚDO DA PÁGINA AQUI -->
        <p>Edite este conteúdo.</p>
    </div>
</main>

<footer>
    <div class="container">
        <p>&copy; 2025 Lovisa Destinos — Viagens de lazer &amp; corporativas</p>
        <p style="margin-top:10px;">
            <a href="index.html">Início</a>
            <a href="sobre.html">Sobre</a>
            <a href="https://wa.me/5519995396281">WhatsApp</a>
            <a href="https://chat.whatsapp.com/H2DpRM8lAtnGrNjwWWcFVj" target="_blank">Grupo VIP</a>
        </p>
    </div>
</footer>

<a href="https://wa.me/5519995396281" class="wa-float" aria-label="WhatsApp">
    <i class="fab fa-whatsapp"></i>
</a>

</body>
</html>
```

---

## Passos para criar a nova página

1. Copie o template acima e salve como `nome-da-pagina.html` na raiz do projeto
2. Edite o `<title>`, o hero e o `<main>` com o conteúdo desejado
3. Adicione o link para a nova página no `<nav>` do `index.html`, `sobre.html` e `pacote.html`
4. Faça deploy (ver `fazer-deploy.md`)

---

## Exemplos de páginas que podem ser criadas

- `promocoes.html` — página de promoções e ofertas especiais
- `corporativo.html` — página dedicada a viagens empresariais
- `cruzeiros.html` — página focada em pacotes de cruzeiros
- `contato.html` — página de contato dedicada
- `obrigado.html` — página de confirmação após envio de formulário
