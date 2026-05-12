/**
 * Lovisa Destinos — API de Publicação
 * Recebe o content.json do editor, commita no GitHub,
 * e o Vercel faz deploy automático em ~30 segundos.
 * Também cria páginas de pacotes novos automaticamente.
 */
export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Parse body
    let body;
    try {
        body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        if (!body) {
            const chunks = [];
            for await (const chunk of req) chunks.push(chunk);
            body = JSON.parse(Buffer.concat(chunks).toString());
        }
    } catch {
        return res.status(400).json({ error: 'Body inválido' });
    }

    let { content, secret } = body;

    // Verifica senha admin
    const adminSecret = process.env.ADMIN_SECRET || 'Lovisa@2025';
    if (secret !== adminSecret) {
        return res.status(401).json({ error: 'Não autorizado' });
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        return res.status(500).json({ error: 'GITHUB_TOKEN nao configurado no Vercel' });
    }
    const owner = 'lucasferraripro';
    const repo  = 'lovisa-destinos-site';
    const headers = {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'lovisa-editor/1.0'
    };

    function isValidImageSrc(src) {
        const value = String(src || '').trim();
        if (!value) return false;
        if (/^[a-zA-Z]:\\/.test(value) || value.startsWith('\\\\')) return false;
        if (/instagram\.com\/p\//i.test(value)) return false;
        if (/cdninstagram|fbcdn|instagram\.[^/]+\/v\//i.test(value)) return false;
        return /^(data:image\/|https?:\/\/|imagens\/|\.\/imagens\/|\/imagens\/)/i.test(value);
    }

    function cleanContent(input) {
        const cms = JSON.parse(JSON.stringify(input || {}));
        Object.keys(cms).forEach(key => {
            const entry = cms[key];
            if (entry && typeof entry === 'object' && typeof entry.src === 'string' && !isValidImageSrc(entry.src)) {
                delete cms[key];
            }
        });
        if (cms._packages && typeof cms._packages === 'object') {
            Object.entries(cms._packages).forEach(([id, pkg]) => {
                if (!pkg || typeof pkg !== 'object') {
                    delete cms._packages[id];
                    return;
                }
                const fotos = Array.isArray(pkg.fotos) ? pkg.fotos.filter(isValidImageSrc) : [];
                if (isValidImageSrc(pkg.img)) fotos.unshift(pkg.img);
                pkg.id = String(pkg.id || id).replace(/[^a-z0-9-]/gi, '').toLowerCase();
                pkg.fotos = [...new Set(fotos)];
                pkg.img = pkg.fotos[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';
            });
        }
        return cms;
    }

    // Helper: commita um arquivo no GitHub
    async function commitFile(filePath, fileContent, message) {
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
        const getRes = await fetch(apiUrl, { headers });
        const getJson = await getRes.json();
        const sha = getJson.sha || null;
        const b64 = Buffer.from(fileContent).toString('base64');
        const putRes = await fetch(apiUrl, {
            method: 'PUT',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, content: b64, ...(sha ? { sha } : {}) })
        });
        if (!putRes.ok) {
            const err = await putRes.json();
            throw new Error(err.message || `Erro ao commitar ${filePath}`);
        }
        return putRes.json();
    }

    try {
        const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
        content = cleanContent(content);

        // 1. Salva content.json
        await commitFile('content.json', JSON.stringify(content, null, 2), `Editor: atualiza conteúdo (${now})`);

        // 2. Cria páginas de pacotes novos
        if (content._packages) {
            for (const [id, pkg] of Object.entries(content._packages)) {
                if (!pkg._new) continue;
                const incluso = Array.isArray(pkg.incluso) ? pkg.incluso : [];
                const inclusoHTML = incluso.map(i => `<li><i class="fa-solid fa-check" style="color:var(--accent);margin-right:8px"></i>${i}</li>`).join('\n                            ');
                const fotos = Array.isArray(pkg.fotos) ? pkg.fotos : (pkg.img ? [pkg.img] : []);
                const fotosHTML = fotos.map((f, idx) => `<img src="${f}" alt="${pkg.title}" style="width:100%;height:320px;object-fit:cover;border-radius:16px;${idx>0?'display:none':''}">` ).join('\n');

                const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pkg.title} — Lovisa Destinos</title>
    <meta name="description" content="${pkg.desc || pkg.subtitle || ''}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap"></noscript>
    <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"></noscript>
    <link rel="icon" href="logo.png" type="image/png">
    <style>
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :root{--navy:#1565C0;--navy-dark:#0D47A1;--accent:#F97316;--text:#1A1F2E;--muted:#6B7280;--bg:#F8F9FC;--white:#FFFFFF;--border:#E5E9F2;--wa:#25D366;--hh:68px;--r:18px}
        html{scroll-behavior:smooth;scroll-padding-top:var(--hh)}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:16px;line-height:1.5;color:var(--text);background:var(--white);overflow-x:hidden;-webkit-font-smoothing:antialiased}
        img{display:block;max-width:100%}
        a{text-decoration:none;color:inherit}
        .container{width:100%;max-width:1180px;margin:0 auto;padding:0 20px}
        #header{position:fixed;top:0;left:0;right:0;height:var(--hh);z-index:900;transition:background .3s,box-shadow .3s}
        #header.solid{background:var(--white);box-shadow:0 1px 16px rgba(0,0,0,.09)}
        .hdr-inner{height:var(--hh);display:flex;align-items:center;justify-content:space-between;gap:24px}
        .logo{display:flex;align-items:center;gap:9px;font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:#fff;transition:color .3s}
        #header.solid .logo{color:var(--navy)}
        .hdr-nav{display:flex;align-items:center;gap:28px}
        .hdr-nav a{font-size:14px;font-weight:500;color:rgba(255,255,255,.88);transition:color .2s}
        .hdr-nav a:hover{color:var(--accent)}
        #header.solid .hdr-nav a{color:var(--text)}
        #header.solid .hdr-nav a:hover{color:var(--accent)}
        .btn{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:50px;font-size:15px;font-weight:600;border:none;cursor:pointer;transition:all .22s ease;font-family:inherit}
        .btn-accent{background:var(--accent);color:#fff}
        .btn-accent:hover{background:#EA6C0A;transform:translateY(-2px);box-shadow:0 8px 22px rgba(232,130,74,.33)}
        .btn-sm{padding:10px 20px;font-size:14px}
        .burger{display:none;flex-direction:column;gap:5px;padding:6px;background:none;border:none;cursor:pointer}
        .burger span{display:block;width:22px;height:2px;background:#fff;border-radius:2px;transition:all .3s}
        #header.solid .burger span{background:var(--navy)}
        #mobile-panel{display:none;position:fixed;top:var(--hh);left:0;right:0;background:var(--white);padding:16px 20px 28px;box-shadow:0 8px 32px rgba(0,0,0,.12);z-index:899;flex-direction:column;gap:2px}
        #mobile-panel.open{display:flex}
        #mobile-panel a{padding:13px 14px;font-size:15px;font-weight:600;color:var(--text);border-radius:12px;transition:background .2s}
        #mobile-panel a:hover{background:var(--bg);color:var(--accent)}
        #mobile-panel .mpanel-cta{margin-top:12px;background:var(--wa);color:#fff;border-radius:50px;text-align:center;padding:14px}
        .pkg-hero{padding-top:calc(var(--hh) + 40px);padding-bottom:40px;background:var(--bg)}
        .pkg-back{display:inline-flex;align-items:center;gap:7px;font-size:13px;color:var(--muted);margin-bottom:24px;transition:color .2s}
        .pkg-back:hover{color:var(--accent)}
        .pkg-grid{display:grid;grid-template-columns:1fr 380px;gap:48px;align-items:start}
        .pkg-img-main{width:100%;height:380px;object-fit:cover;border-radius:var(--r);box-shadow:0 12px 40px rgba(0,0,0,.12)}
        .pkg-flag-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(249,115,22,.1);color:var(--accent);border-radius:50px;padding:5px 14px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px}
        .pkg-title{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,4vw,2.8rem);font-weight:700;color:var(--navy);line-height:1.15;margin-bottom:10px}
        .pkg-subtitle{font-size:1.05rem;color:var(--muted);margin-bottom:20px}
        .pkg-meta{display:flex;flex-wrap:wrap;gap:16px;margin-bottom:28px}
        .pkg-meta-item{display:flex;align-items:center;gap:7px;font-size:13px;color:var(--muted)}
        .pkg-meta-item i{color:var(--accent);font-size:14px}
        .pkg-desc{font-size:15px;color:var(--text);line-height:1.75;margin-bottom:28px}
        .pkg-incluso h3{font-size:1rem;font-weight:700;color:var(--navy);margin-bottom:14px}
        .pkg-incluso ul{list-style:none;display:flex;flex-direction:column;gap:8px}
        .pkg-incluso li{font-size:14px;color:var(--text);display:flex;align-items:flex-start}
        .pkg-card{background:var(--white);border-radius:var(--r);padding:28px;box-shadow:0 10px 44px rgba(27,58,107,.1);position:sticky;top:calc(var(--hh) + 20px)}
        .pkg-price-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:4px}
        .pkg-price-val{font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:700;color:var(--accent);line-height:1;margin-bottom:4px}
        .pkg-price-parc{font-size:13px;color:var(--muted);margin-bottom:24px}
        .pkg-cta{width:100%;padding:16px;background:var(--accent);color:#fff;border:none;border-radius:50px;font-size:16px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:all .22s;font-family:inherit;text-decoration:none}
        .pkg-cta:hover{background:#EA6C0A;transform:translateY(-2px);box-shadow:0 8px 22px rgba(232,130,74,.33)}
        .pkg-cta-sec{width:100%;padding:13px;background:transparent;color:var(--navy);border:1.5px solid var(--border);border-radius:50px;font-size:14px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;margin-top:10px;transition:all .2s;font-family:inherit;text-decoration:none}
        .pkg-cta-sec:hover{border-color:var(--navy);background:var(--bg)}
        footer{background:var(--navy-dark);color:rgba(255,255,255,.5);padding:48px 0 0}
        .ft-bottom{border-top:1px solid rgba(255,255,255,.07);padding:22px 0;display:flex;justify-content:space-between;align-items:center;font-size:12px;gap:12px}
        .wa{position:fixed;bottom:24px;right:24px;width:56px;height:56px;background:var(--wa);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.5rem;z-index:888;box-shadow:0 6px 18px rgba(37,211,102,.42);transition:transform .25s,box-shadow .25s}
        .wa:hover{transform:scale(1.12)}
        @media(max-width:768px){
            :root{--hh:60px}
            .hdr-nav,.hdr-cta{display:none}
            .burger{display:flex}
            .pkg-grid{grid-template-columns:1fr}
            .pkg-card{position:static}
            .pkg-img-main{height:240px}
        }
    </style>
</head>
<body>
<header id="header">
    <div class="container">
        <div class="hdr-inner">
            <a href="index.html" class="logo">
                <div style="width:52px;height:52px;border-radius:50%;overflow:hidden;background:#fff;border:2px solid rgba(255,255,255,0.4);flex-shrink:0;display:flex;align-items:center;justify-content:center;"><img src="logo.png" alt="Lovisa Destinos" style="width:48px;height:48px;object-fit:contain;"></div>
            </a>
            <nav class="hdr-nav">
                <a href="index.html#destinos">Destinos</a>
                <a href="index.html#diferenciais">Por Que Nós</a>
                <a href="index.html#contato">Orçamento</a>
                <a href="sobre.html">Sobre</a>
            </nav>
            <div class="hdr-cta">
                <a href="https://wa.me/5519995396281" class="btn btn-accent btn-sm"><i class="fab fa-whatsapp"></i> WhatsApp</a>
            </div>
            <button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>
        </div>
    </div>
</header>
<nav id="mobile-panel">
    <a href="index.html#destinos">Destinos</a>
    <a href="index.html#diferenciais">Por Que Nós</a>
    <a href="index.html#contato">Orçamento</a>
    <a href="sobre.html">Sobre</a>
    <a href="https://wa.me/5519995396281" class="mpanel-cta"><i class="fab fa-whatsapp"></i> WhatsApp</a>
</nav>

<main class="pkg-hero">
    <div class="container">
        <a href="index.html#destinos" class="pkg-back"><i class="fa-solid fa-arrow-left"></i> Voltar aos destinos</a>
        <div class="pkg-grid">
            <div>
                <img src="${fotos[0] || pkg.img || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'}" alt="${pkg.title}" class="pkg-img-main">
                <br>
                <div class="pkg-flag-badge"><i class="fa-solid fa-location-dot"></i> ${pkg.flag || ''}</div>
                <h1 class="pkg-title">${pkg.title}</h1>
                <p class="pkg-subtitle">${pkg.subtitle || ''}</p>
                <div class="pkg-meta">
                    ${pkg.location ? `<div class="pkg-meta-item"><i class="fa-solid fa-location-dot"></i> ${pkg.location}</div>` : ''}
                    ${pkg.duration ? `<div class="pkg-meta-item"><i class="fa-solid fa-calendar"></i> ${pkg.duration}</div>` : ''}
                </div>
                ${pkg.desc ? `<p class="pkg-desc">${pkg.desc}</p>` : ''}
                ${incluso.length ? `<div class="pkg-incluso"><h3>O que está incluso</h3><ul>${inclusoHTML}</ul></div>` : ''}
            </div>
            <div>
                <div class="pkg-card">
                    <div class="pkg-price-label">A partir de</div>
                    <div class="pkg-price-val">R$ ${pkg.price}</div>
                    ${pkg.parcelas ? `<div class="pkg-price-parc">${pkg.parcelas}</div>` : ''}
                    <a href="https://wa.me/5519995396281?text=Olá! Tenho interesse no pacote ${encodeURIComponent(pkg.title)}" target="_blank" class="pkg-cta"><i class="fab fa-whatsapp"></i> Solicitar orçamento</a>
                    <a href="index.html#contato" class="pkg-cta-sec"><i class="fa-solid fa-envelope"></i> Enviar mensagem</a>
                </div>
            </div>
        </div>
    </div>
</main>

<footer>
    <div class="container">
        <div class="ft-bottom">
            <span>© 2025 Lovisa Destinos · Todos os direitos reservados</span>
            <a href="index.html" style="color:rgba(255,255,255,.4);font-size:13px">← Voltar ao site</a>
        </div>
    </div>
</footer>

<a href="https://wa.me/5519995396281" class="wa" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
<script>
    const hdr = document.getElementById('header');
    window.addEventListener('scroll', () => hdr.classList.toggle('solid', scrollY > 48), {passive:true});
    const burger = document.getElementById('burger');
    const panel = document.getElementById('mobile-panel');
    burger.addEventListener('click', () => { burger.classList.toggle('open'); panel.classList.toggle('open'); });
</script>
<script src="editor.js?v=20260512-standby" defer></script>
</body>
</html>`;
                await commitFile(`pacote-${id}.html`, html, `Novo pacote: ${pkg.title} (${now})`);
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Publicado! O site será atualizado em ~30 segundos.'
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
