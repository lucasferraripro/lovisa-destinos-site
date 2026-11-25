/**
 * LOVISA DESTINOS — EDITOR VISUAL v3
 * Clique em qualquer elemento destacado para editar.
 * Sem necessidade de selecionar modo antes.
 */
(function () {
    'use strict';

    const CMS_KEY     = 'lovisa_cms_v3';
    const AUTH_KEY    = 'lovisa_auth';
    const CONTENT_URL = '/api/content';

    /* ─── AUTH ─────────────────────────────────────────────── */
    const auth     = JSON.parse(sessionStorage.getItem(AUTH_KEY) || 'null');
    const isAdmin  = auth && auth.expires > Date.now();
    const params   = new URLSearchParams(location.search);
    const editMode = isAdmin && (params.get('editor') === '1' || sessionStorage.getItem('editor_active') === '1');
    const FALLBACK_PACKAGE_IMG = 'imagens/destinos/hero-palmeiras-sm.webp';

    function escapeHTML(value) {
        return String(value || '').replace(/[&<>"']/g, ch => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[ch]));
    }

    function isValidImageSrc(src) {
        const value = String(src || '').trim();
        if (!value) return false;
        if (/^[a-zA-Z]:\\/.test(value) || value.startsWith('\\\\')) return false;
        if (/instagram\.com\/p\//i.test(value)) return false;
        if (/cdninstagram|fbcdn|instagram\.[^/]+\/v\//i.test(value)) return false;
        return /^(data:image\/|https?:\/\/|imagens\/|\.\/imagens\/|\/imagens\/)/i.test(value);
    }

    function cleanPackageId(value) {
        return String(value || '')
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .toLowerCase().replace(/[^a-z0-9-]/g, '');
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
                const uniqueFotos = [...new Set(fotos)];
                pkg.fotos = uniqueFotos.length ? uniqueFotos : [FALLBACK_PACKAGE_IMG];
                pkg.img = pkg.fotos[0];
            });
        }
        return cms;
    }

    const FOOTER_DEFAULTS = {
        email: 'vendas@lovisadestinos.com.br',
        infoHours: 'Atendimento das 09h00 às 17h00 seg a sex · Clientes no destino 24hrs',
        hours: 'Atendimento das 09h00 às 17h00 seg a sex',
        hours2: 'Atendimento para clientes no destino 24hrs',
        copyright: '© 2026 Lovisa Destinos · Todos os direitos reservados'
    };

    function htmlToText(value) {
        const tmp = document.createElement('div');
        tmp.innerHTML = String(value || '');
        return tmp.textContent.trim();
    }

    function entryText(cms, key, fallback) {
        const entry = cms && cms[key];
        if (!entry || entry.html == null) return fallback;
        return htmlToText(entry.html) || fallback;
    }

    function setTextPreserveIcon(el, value) {
        const icon = el.querySelector('i');
        el.textContent = value;
        if (icon) el.prepend(icon.cloneNode(true));
    }

    function syncContactFooter(cms) {
        const email = entryText(cms, 'info-email', FOOTER_DEFAULTS.email);
        const infoHours = entryText(cms, 'info-horario', FOOTER_DEFAULTS.infoHours);
        const hours = entryText(cms, 'ft-hours', FOOTER_DEFAULTS.hours);
        const hours2 = entryText(cms, 'ft-hours2', FOOTER_DEFAULTS.hours2);
        const copyright = entryText(cms, 'ft-copyright', FOOTER_DEFAULTS.copyright);

        ['info-email', 'ft-email', 'ft-email-pacote'].forEach(eid => {
            document.querySelectorAll(`[data-eid="${eid}"]`).forEach(el => {
                if (el.tagName === 'A') el.href = 'mailto:' + email;
                setTextPreserveIcon(el, email);
            });
        });
        document.querySelectorAll('[data-eid="info-horario"]').forEach(el => setTextPreserveIcon(el, infoHours));
        ['ft-hours', 'ft-hours-pacote'].forEach(eid => {
            document.querySelectorAll(`[data-eid="${eid}"]`).forEach(el => setTextPreserveIcon(el, hours));
        });
        ['ft-hours2', 'ft-hours2-pacote'].forEach(eid => {
            document.querySelectorAll(`[data-eid="${eid}"]`).forEach(el => setTextPreserveIcon(el, hours2));
        });
        document.querySelectorAll('[data-eid="ft-copyright"]').forEach(el => setTextPreserveIcon(el, copyright));
    }

    function packageUrl(pkg) {
        return `pacote.html?id=${encodeURIComponent(pkg.id)}`;
    }

    function renderPackageCard(pkg) {
        const grid = document.querySelector('#destinos .cards-grid');
        if (!grid || !pkg || !pkg.id) return;
        if (grid.querySelector(`[data-dynamic-pkg="${CSS.escape(pkg.id)}"]`)) return;
        const img = isValidImageSrc(pkg.img) ? pkg.img : FALLBACK_PACKAGE_IMG;
        const wrap = document.createElement('div');
        wrap.style.position = 'relative';
        wrap.className = 'card-link-wrap ld-dynamic-pkg';
        wrap.dataset.dynamicPkg = pkg.id;
        wrap.innerHTML = `
            ${editMode ? `<button class="ld-remove-pkg" data-pkg-id="${escapeHTML(pkg.id)}" title="Remover pacote">Remover</button>` : ''}
            <a href="${packageUrl(pkg)}" class="card-link rv on">
                <div class="card-img">
                    <img src="${escapeHTML(img)}" alt="${escapeHTML(pkg.title)}" loading="lazy">
                    <div class="card-flag">${escapeHTML(pkg.flag || '')}</div>
                    <div class="card-overlay"><span>Ver pacote <i class="fa-solid fa-arrow-right"></i></span></div>
                </div>
                <div class="card-body">
                    <div class="card-loc"><i class="fa-solid fa-location-dot"></i> ${escapeHTML(pkg.location || '')}</div>
                    <h3>${escapeHTML(pkg.title)}</h3>
                    <div class="card-foot">
                        <div class="card-price">${/^\d/.test(String(pkg.price || '').trim()) ? ('R$ ' + escapeHTML(pkg.price)) : escapeHTML(pkg.price || 'Consulte')} <small>${/^\d/.test(String(pkg.price || '').trim()) ? '/ pessoa' : ''}</small></div>
                        <span class="card-arrow">Saiba mais <i class="fa-solid fa-arrow-right"></i></span>
                    </div>
                </div>
            </a>`;
        grid.appendChild(wrap);
        if (editMode) {
            const btn = wrap.querySelector('.ld-remove-pkg');
            if (btn && window._LD) {
                btn.addEventListener('click', e => {
                    e.preventDefault();
                    e.stopPropagation();
                    window._LD._confirmRemovePkg(pkg.id, wrap);
                });
            }
        }
    }

    function applyPackages(cms) {
        document.querySelectorAll('.ld-dynamic-pkg').forEach(el => el.remove());
        if (!cms || !cms._packages || typeof cms._packages !== 'object') return;
        const removed = Array.isArray(cms._removedPackages) ? cms._removedPackages : [];
        Object.entries(cms._packages).forEach(([id, pkg]) => {
            if (removed.includes(id)) return;
            renderPackageCard({ ...pkg, id: pkg.id || id });
        });
    }

    let _bannerTimer = null;
    function applyBanners(cms) {
        const sec   = document.getElementById('promo-banners');
        const track = document.getElementById('promo-track');
        const dots  = document.getElementById('promo-dots');
        const prev  = document.getElementById('promo-prev');
        const next  = document.getElementById('promo-next');
        const wrap  = document.getElementById('promo-wrap');
        if (!sec || !track) return;
        if (_bannerTimer) { clearTimeout(_bannerTimer); _bannerTimer = null; }

        const list = (Array.isArray(cms && cms._banners) ? cms._banners : [])
            .filter(b => b && b.active !== false && isValidImageSrc(b.img));
        const secs = Math.min(60, Math.max(3, parseInt(cms && cms._bannerInterval, 10) || 7));

        document.body.classList.toggle('has-banners', list.length > 0);
        if (!list.length) {
            sec.style.display = 'none';
            track.innerHTML = '';
            if (dots) dots.innerHTML = '';
            return;
        }

        sec.style.display = 'block';
        sec.style.setProperty('--bn-secs', secs + 's');
        track.innerHTML = list.map((b, i) => {
            const alt = escapeHTML(b.title || ('Promoção ' + (i + 1)));
            const lazy = i === 0 ? 'eager' : 'lazy';
            const mob = isValidImageSrc(b.imgMobile) ? `<source media="(max-width: 768px)" srcset="${escapeHTML(b.imgMobile)}">` : '';
            const pic = `<picture>${mob}<img src="${escapeHTML(b.img)}" alt="${alt}" loading="${lazy}" decoding="async" draggable="false"></picture>`;
            const link = (b.link || '').trim();
            if (link && (/^https?:\/\//i.test(link) || link.startsWith('#') || /\.html/.test(link))) {
                const ext = /^https?:\/\//i.test(link) && !link.includes('lovisadestinos.com.br');
                return `<a class="promo-slide${mob ? ' has-mobile' : ''}" href="${escapeHTML(link)}" aria-label="${alt}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}>${pic}</a>`;
            }
            return `<div class="promo-slide${mob ? ' has-mobile' : ''}">${pic}</div>`;
        }).join('');

        let cur = 0, paused = false;
        const many = list.length > 1;
        const schedule = () => {
            if (_bannerTimer) clearTimeout(_bannerTimer);
            if (many && !paused && !document.hidden) _bannerTimer = setTimeout(() => go(cur + 1), secs * 1000);
        };
        const go = (idx) => {
            cur = (idx + list.length) % list.length;
            track.style.transform = `translateX(-${cur * 100}%)`;
            sec.style.setProperty('--bn-bg', 'url("' + String(list[cur].imgMobile || list[cur].img).replace(/["\\]/g, '') + '")');
            track.querySelectorAll('.promo-slide').forEach((s, i) => s.setAttribute('aria-hidden', i === cur ? 'false' : 'true'));
            if (dots) {
                dots.querySelectorAll('.promo-dot').forEach((d, i) => {
                    d.classList.remove('active');
                    if (i === cur) { void d.offsetWidth; d.classList.add('active'); }
                });
            }
            schedule();
        };

        if (dots) {
            dots.innerHTML = many
                ? list.map((_, i) => `<button type="button" class="promo-dot" aria-label="Ver promoção ${i + 1}"><span></span></button>`).join('')
                : '';
            dots.querySelectorAll('.promo-dot').forEach((d, i) => { d.onclick = () => go(i); });
        }
        if (prev) { prev.style.display = many ? 'flex' : 'none'; prev.onclick = () => go(cur - 1); }
        if (next) { next.style.display = many ? 'flex' : 'none'; next.onclick = () => go(cur + 1); }

        if (wrap && !wrap._ldBannerInit) {
            wrap._ldBannerInit = true;
            wrap.addEventListener('mouseenter', () => { paused = true; wrap.classList.add('paused'); if (_bannerTimer) clearTimeout(_bannerTimer); });
            wrap.addEventListener('mouseleave', () => { paused = false; wrap.classList.remove('paused'); go(cur); });
            document.addEventListener('visibilitychange', () => go(cur));
            // deslizar com o dedo
            let x0 = null, moved = false;
            wrap.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; moved = false; }, { passive: true });
            wrap.addEventListener('touchmove', e => { if (x0 !== null && Math.abs(e.touches[0].clientX - x0) > 10) moved = true; }, { passive: true });
            wrap.addEventListener('touchend', e => {
                if (x0 === null) return;
                const dx = e.changedTouches[0].clientX - x0; x0 = null;
                if (Math.abs(dx) > 40 && wrap._ldGo) wrap._ldGo(dx < 0 ? 1 : -1);
            });
            wrap.addEventListener('click', e => { if (moved) { e.preventDefault(); moved = false; } }, true);
            wrap.addEventListener('keydown', e => {
                if (e.key === 'ArrowLeft' && wrap._ldGo) wrap._ldGo(-1);
                if (e.key === 'ArrowRight' && wrap._ldGo) wrap._ldGo(1);
            });
        }
        wrap && (wrap._ldGo = (d) => go(cur + d));
        go(0);
    }

    function fileToDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = ev => resolve(ev.target.result);
            reader.onerror = () => reject(new Error('Nao foi possivel ler a imagem.'));
            reader.readAsDataURL(file);
        });
    }

    /* Reduz e converte para WebP no navegador (PNG do ChatGPT de 2-4MB vira ~200KB) */
    function compressImage(file, maxW, quality, maxH) {
        return new Promise((resolve) => {
            if (!file || /gif|svg/i.test(file.type)) return resolve(file);
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => {
                try {
                    const scale = Math.min(1, maxW / img.naturalWidth, (maxH || maxW) / img.naturalHeight);
                    const c = document.createElement('canvas');
                    c.width = Math.round(img.naturalWidth * scale);
                    c.height = Math.round(img.naturalHeight * scale);
                    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
                    c.toBlob(b => {
                        URL.revokeObjectURL(url);
                        if (!b || (b.size >= file.size && scale === 1 && /webp/i.test(file.type))) return resolve(file);
                        const base = (file.name || 'imagem').replace(/\.[a-z0-9]+$/i, '');
                        resolve(new File([b], base + (maxW <= 900 ? '-celular' : '') + '.webp', { type: 'image/webp' }));
                    }, 'image/webp', quality);
                } catch (_) { URL.revokeObjectURL(url); resolve(file); }
            };
            img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
            img.src = url;
        });
    }

    async function uploadImageFile(file, opts) {
        if (!file) return null;
        if (!/^image\//i.test(file.type)) throw new Error('Selecione apenas arquivos de imagem.');
        const o = opts || {};
        file = await compressImage(file, o.maxW || 1920, o.quality || 0.82, o.maxH);
        if (file.size > 3 * 1024 * 1024) throw new Error('Imagem muito grande. Use ate 3MB.');
        const secret = sessionStorage.getItem('lovisa_secret') || '';
        const dataUrl = await fileToDataUrl(file);
        const base64 = dataUrl.split(',')[1];
        const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: file.name, base64, secret })
        });
        const data = await res.json();
        if (!res.ok || !data.url) throw new Error(data.error || 'Erro ao enviar imagem.');
        return data.url;
    }

    /* Fotos de fundo do topo (até 3, passam sozinhas) */
    const HERO_DEFAULTS = ['imagens/destinos/hero-maragogi.webp', 'imagens/destinos/lencois-1.webp', 'imagens/destinos/rio-1.webp'];
    function applyHero(cms) {
        const slides = document.querySelectorAll('.hero-bg .hero-slide');
        if (!slides.length) return;
        const list = (Array.isArray(cms && cms._heroSlides) ? cms._heroSlides : []).filter(isValidImageSrc).slice(0, 3);
        slides.forEach((el, i) => {
            if (list.length) el.style.backgroundImage = 'url("' + String(list[i % list.length]).replace(/["\\]/g, '') + '")';
            else el.style.removeProperty('background-image');
        });
    }

    /* Depoimentos adicionados ou removidos pelo painel */
    function depCardHTML(d, n) {
        const colors = ['#1565C0', '#F97316', '#16A34A', '#7C3AED', '#EA6C0A'];
        const nome = escapeHTML(d.nome || '');
        const initials = escapeHTML(String(d.nome || '?').split(/\s+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase());
        return `<div class="dep-header"><div class="dep-user">
                <div class="dep-av" style="background:${colors[n % colors.length]};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;">${initials}</div>
                <div><div class="dep-name">${nome}</div><div class="dep-dest">${escapeHTML(d.dest || 'via Google')}</div></div>
            </div><div class="dep-g-logo"><img loading="lazy" decoding="async" src="https://www.gstatic.com/images/branding/product/1x/googleg_32dp.png" alt="Google"></div></div>
            <div class="dep-stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
            <p class="dep-text">"${escapeHTML(String(d.texto || '').replace(/^"|"$/g, ''))}"</p>`;
    }
    function applyDeps(cms) {
        const grid = document.getElementById('dep-grid');
        if (!grid) return;
        const hidden = Array.isArray(cms && cms._hiddenDeps) ? cms._hiddenDeps.map(String) : [];
        grid.querySelectorAll('.dep-card[data-dep-id]').forEach(c => {
            if (!c.dataset.depExtra) c.style.display = hidden.includes(c.dataset.depId) ? 'none' : '';
        });
        grid.querySelectorAll('.dep-card[data-dep-extra]').forEach(c => c.remove());
        const extras = Array.isArray(cms && cms._extraDeps) ? cms._extraDeps : [];
        extras.forEach((d, i) => {
            if (!d || !d.nome || !d.texto) return;
            const card = document.createElement('div');
            card.className = 'dep-card rv on';
            card.dataset.depId = d.id;
            card.dataset.depExtra = '1';
            card.innerHTML = depCardHTML(d, i + 6);
            grid.appendChild(card);
        });
    }

    /* ─── APLICAR CONTEÚDO ──────────────────────────────────── */
    function applyContent(cms) {
        if (!cms || !Object.keys(cms).length) return;
        cms = cleanContent(cms);
        if (cms.colors) {
            // Aliases: index.html/pacote.html usam --navy/--navy-dark/--text
            const aliases = { '--primary': '--navy', '--primary-dark': '--navy-dark', '--text-dark': '--text' };
            Object.entries(cms.colors).forEach(([k, v]) => {
                document.documentElement.style.setProperty(k, v);
                if (aliases[k]) document.documentElement.style.setProperty(aliases[k], v);
            });
        }
        // Atualiza todos os links de WhatsApp se número foi editado
        if (cms.whatsapp) {
            document.querySelectorAll('a[href*="wa.me/"]').forEach(a => {
                a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + cms.whatsapp);
            });
        }
        document.querySelectorAll('[data-eid]').forEach(el => {
            const d = cms[el.dataset.eid];
            if (!d) return;
            if (d.hidden === true) {
                el.style.display = 'none';
                el.dataset.ldHidden = '1';
                return;
            }
            if (d.hidden === false && el.dataset.ldHidden === '1') {
                el.style.removeProperty('display');
                delete el.dataset.ldHidden;
            }
            if (d.html  != null) el.innerHTML = d.html;
            if (d.src   != null && el.tagName === 'IMG') el.src = d.src;
            if (d.href  != null) el.setAttribute('href', d.href);
            if (d.target!= null) el.setAttribute('target', d.target);
            if (d.style)         Object.assign(el.style, d.style);
        });
        syncContactFooter(cms);
        applyPackages(cms);
        applyBanners(cms);
        applyHero(cms);
        applyDeps(cms);
    }

    /* ─── RASCUNHO ────────────────────────────────────────────
       Guarda só as alterações feitas no painel (não uma cópia do site).
       Assim, o que for publicado depois (em outro computador ou por nós)
       nunca é sobrescrito por um rascunho velho. */
    const DRAFT_VER = 2;
    function draftDiff(cms, base) {
        const diff = {};
        const b = base || {};
        Object.keys(cms || {}).forEach(k => {
            if (JSON.stringify(cms[k]) !== JSON.stringify(b[k])) diff[k] = cms[k];
        });
        Object.keys(b).forEach(k => { if (!(k in (cms || {}))) diff[k] = null; });
        return diff;
    }
    function applyDiff(base, diff) {
        const out = JSON.parse(JSON.stringify(base || {}));
        Object.entries(diff || {}).forEach(([k, v]) => {
            if (v === null) delete out[k]; else out[k] = v;
        });
        return out;
    }
    function readDraft() {
        try {
            const raw = JSON.parse(localStorage.getItem(CMS_KEY) || 'null');
            if (raw && raw.__v === DRAFT_VER && raw.diff && typeof raw.diff === 'object') return raw.diff;
            if (raw && Object.keys(raw).length) {
                // rascunho antigo (cópia do site inteiro): descarta para não voltar conteúdo velho
                localStorage.removeItem(CMS_KEY);
                window.__LOVISA_OLD_DRAFT_DROPPED = true;
            }
        } catch (_) { localStorage.removeItem(CMS_KEY); }
        return {};
    }
    function saveDraft(cms) {
        const diff = draftDiff(cms, window.__LOVISA_SRV_CMS || {});
        if (Object.keys(diff).length) localStorage.setItem(CMS_KEY, JSON.stringify({ __v: DRAFT_VER, diff }));
        else localStorage.removeItem(CMS_KEY);
        return diff;
    }
    function hasDraft() { return Object.keys(readDraft()).length > 0; }

    async function fetchContent() {
        try {
            const r = await fetch(CONTENT_URL + '?_=' + Date.now());
            return r.ok ? await r.json() : {};
        } catch (_) { return {}; }
    }

    async function loadAndApply(srv) {
        let merged = (srv && typeof srv === 'object') ? { ...srv } : {};
        window.__LOVISA_SRV_CMS = merged;
        if (editMode) merged = applyDiff(merged, readDraft());
        applyContent(merged);
        return merged;
    }

    /* ─── CSS ───────────────────────────────────────────────── */
    function injectCSS() {
        if (document.getElementById('ld-css')) return;
        const s = document.createElement('style');
        s.id = 'ld-css';
        s.textContent = `
        #ld-bar{position:fixed;top:0;left:0;right:0;z-index:99999;height:52px;background:#111827;display:flex;align-items:center;gap:6px;padding:0 14px;box-shadow:0 2px 16px rgba(0,0,0,.5);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;}
        #ld-bar *{box-sizing:border-box;}
        .ld-brand{color:#fff;font-weight:700;display:flex;align-items:center;gap:7px;padding-right:14px;border-right:1px solid rgba(255,255,255,.12);white-space:nowrap;margin-right:4px;font-size:13px;}
        .ld-dot{width:8px;height:8px;border-radius:50%;background:#22C55E;flex-shrink:0;animation:ldpulse 1.5s infinite;}
        @keyframes ldpulse{0%,100%{opacity:1}50%{opacity:.3}}
        .ld-hint-text{color:rgba(255,255,255,.55);font-size:12px;white-space:nowrap;}
        .ld-btn{padding:7px 14px;border:none;border-radius:8px;background:transparent;color:rgba(255,255,255,.75);cursor:pointer;font-size:12.5px;font-weight:600;display:inline-flex;align-items:center;gap:5px;transition:all .15s;white-space:nowrap;outline:none;}
        .ld-btn:hover{background:rgba(255,255,255,.12);color:#fff;}
        .ld-btn.blue{background:#1565C0;color:#fff;}
        .ld-btn.blue:hover{background:#0D47A1;}
        .ld-btn.green{background:#16A34A;color:#fff;}
        .ld-btn.green:hover{background:#15803D;}
        .ld-btn.orange{background:#F97316;color:#fff;}
        .ld-btn.orange:hover{background:#EA6C0A;}
        .ld-btn.red{color:rgba(255,255,255,.45);font-size:12px;}
        .ld-btn.red:hover{color:#F87171;background:rgba(248,113,113,.1);}
        .ld-sep{width:1px;height:28px;background:rgba(255,255,255,.12);margin:0 4px;flex-shrink:0;}
        .ld-spacer{flex:1;}

        body.ld-on{padding-top:52px!important;}
        body.ld-on [data-eid]{cursor:pointer!important;position:relative;transition:outline .1s;}
        body.ld-on [data-eid]:hover{outline:2px dashed #F97316!important;outline-offset:3px;}
        body.ld-on [data-eid]:hover::after{content:attr(data-elabel);position:absolute;top:-26px;left:0;background:#F97316;color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;white-space:nowrap;z-index:99997;pointer-events:none;font-family:-apple-system,sans-serif;}
        body.ld-on [data-eid].ld-sel{outline:2px solid #1565C0!important;outline-offset:3px;}
        body.ld-on .card-overlay,body.ld-on .card-flag{pointer-events:none!important;}

        .ld-panel{position:fixed;top:62px;right:18px;width:320px;background:#fff;border-radius:16px;z-index:99998;box-shadow:0 20px 60px rgba(0,0,0,.25);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;overflow:hidden;}
        .ld-ph{background:#111827;color:#fff;padding:13px 16px;display:flex;align-items:center;justify-content:space-between;cursor:move;user-select:none;}
        .ld-ph h3{font-size:13px;font-weight:700;margin:0;}
        .ld-px{background:none;border:none;color:rgba(255,255,255,.55);font-size:18px;cursor:pointer;padding:0 2px;line-height:1;}
        .ld-px:hover{color:#fff;}
        .ld-pb{padding:16px;max-height:calc(100vh - 130px);overflow-y:auto;}
        .ld-f{margin-bottom:13px;}
        .ld-f label{display:block;font-size:11px;font-weight:700;color:#374151;margin-bottom:5px;text-transform:uppercase;letter-spacing:.06em;}
        .ld-f input[type=text],.ld-f input[type=url],.ld-f textarea,.ld-f select{width:100%;padding:8px 11px;border:1.5px solid #E5E7EB;border-radius:8px;font-size:13px;outline:none;font-family:inherit;resize:vertical;transition:border .15s;}
        .ld-f input:focus,.ld-f textarea:focus,.ld-f select:focus{border-color:#1565C0;}
        .ld-rich{min-height:70px;padding:9px 11px;border:1.5px solid #E5E7EB;border-radius:8px;font-size:13px;outline:none;transition:border .15s;line-height:1.5;}
        .ld-rich:focus{border-color:#1565C0;}
        .ld-fmts{display:flex;gap:5px;margin-top:6px;}
        .ld-fmts button{padding:4px 11px;border:1.5px solid #E5E7EB;border-radius:6px;background:#fff;cursor:pointer;font-size:13px;font-weight:700;transition:background .1s;}
        .ld-fmts button:hover{background:#F3F4F6;}
        .ld-cr{display:flex;align-items:center;gap:10px;margin-bottom:9px;}
        .ld-cr label{flex:1;font-size:12.5px;color:#374151;}
        .ld-cr input[type=color]{width:40px;height:32px;padding:2px;border:1.5px solid #E5E7EB;border-radius:6px;cursor:pointer;}
        .ld-prev{width:100%;height:110px;object-fit:cover;border-radius:9px;margin-bottom:10px;background:#F3F4F6;display:block;}
        .ld-acts{display:flex;gap:8px;margin-top:14px;}
        .ld-ok{flex:1;padding:9px;background:#1565C0;color:#fff;border:none;border-radius:8px;font-weight:700;font-size:13px;cursor:pointer;transition:background .15s;}
        .ld-ok:hover{background:#0D47A1;}
        .ld-ko{padding:9px 14px;background:#F3F4F6;color:#374151;border:none;border-radius:8px;font-size:13px;cursor:pointer;}
        .ld-ko:hover{background:#E5E7EB;}
        .ld-danger{width:100%;margin-top:10px;padding:9px 12px;background:#fff;border:1.5px solid #FCA5A5;color:#B91C1C;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;}
        .ld-danger:hover{background:#FEF2F2;border-color:#EF4444;}
        .ld-hint{font-size:11px;color:#9CA3AF;margin-top:4px;line-height:1.5;}
        .ld-hr{border:none;border-top:1px solid #F3F4F6;margin:12px 0;}
        .ld-g2{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
        .ld-info{font-size:12px;color:#6B7280;background:#F9FAFB;border-radius:8px;padding:10px;margin-bottom:12px;line-height:1.5;}

        .ld-toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(16px);background:#111827;color:#fff;padding:11px 22px;border-radius:50px;font-size:13px;font-weight:600;z-index:999999;opacity:0;transition:all .28s;white-space:nowrap;box-shadow:0 8px 24px rgba(0,0,0,.3);font-family:-apple-system,sans-serif;}
        .ld-toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
        .ld-toast.ok{background:#16A34A;}
        .ld-toast.err{background:#DC2626;}

        .ld-pub-box{background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:14px;font-size:13px;color:#166534;line-height:1.6;}
        .ld-pub-err{background:#FEF2F2;border:1px solid #FCA5A5;border-radius:10px;padding:14px;font-size:13px;color:#991B1B;line-height:1.6;}
        .ld-spin{font-size:26px;animation:ldspin 1s linear infinite;display:block;margin-bottom:8px;}
        @keyframes ldspin{to{transform:rotate(360deg)}}
        .ld-loading{text-align:center;padding:24px 16px;color:#6B7280;font-size:13px;}
        .ld-dirty-dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#FCD34D;margin-right:4px;flex-shrink:0;}
        .ld-last-pub{color:rgba(255,255,255,.35);font-size:11px;white-space:nowrap;}

        @media(max-width:600px){
            #ld-bar{padding:0 8px;gap:2px;height:52px;}
            .ld-hint-text,.ld-sep,.ld-last-pub{display:none;}
            .ld-brand{padding-right:8px;font-size:12px;}
            .ld-btn{padding:7px 10px;font-size:14px;}
            .ld-btn-label{display:none;}
            .ld-panel{left:6px;right:6px;width:auto;top:58px;max-height:calc(100dvh - 66px);overflow-y:auto;}
            .ld-pb{max-height:none;padding:14px;}
            .ld-ph{cursor:default;}
            .ld-f input[type=text],.ld-f input[type=url],.ld-f textarea,.ld-f select,.ld-f input[type=password],.ld-rich{font-size:16px;}
            .ld-cr input[type=color]{width:44px;height:38px;}
            .ld-ok,.ld-ko{font-size:15px;padding:11px;}
        }
        `;
        document.head.appendChild(s);
    }

    /* ─── EDITOR ─────────────────────────────────────────────── */
    const ED = {
        cms: {},
        panel: null,

        async start(srv) {
            injectCSS();
            // Reutiliza conteúdo já carregado pelo loadAndApply (sem fetch extra)
            this.cms = applyDiff(window.__LOVISA_SRV_CMS || srv || {}, readDraft());

            document.body.classList.add('ld-on');
            sessionStorage.setItem('editor_active', '1');
            this.buildBar();
            this.bindAll();
            // Se há rascunho não publicado, mostrar indicador
            if (hasDraft()) this.markDirty();
            if (window.__LOVISA_OLD_DRAFT_DROPPED) setTimeout(() => this.toast('Painel atualizado com o conteúdo publicado do site.', 'ok'), 800);
        },

        buildBar() {
            const bar = document.createElement('div');
            bar.id = 'ld-bar';
            const lastPub = localStorage.getItem('lovisa_last_pub') || '';
            bar.innerHTML = `
            <div class="ld-brand"><span class="ld-dot"></span>Editor</div>
            <span class="ld-hint-text">👆 Clique em qualquer elemento laranja para editar</span>
            <div class="ld-spacer"></div>
            ${lastPub ? `<span class="ld-last-pub">Publicado: ${lastPub}</span><div class="ld-sep"></div>` : ''}
            <button class="ld-btn blue" id="ld-add-pkg">➕ <span class="ld-btn-label">Novo Pacote</span></button>
            <button class="ld-btn" id="ld-buy-links">🛒 <span class="ld-btn-label">Links Compra</span></button>
            <button class="ld-btn" id="ld-hero">🏞️ <span class="ld-btn-label">Fotos do Topo</span></button>
            <button class="ld-btn" id="ld-banners">🖼️ <span class="ld-btn-label">Banners</span></button>
            <button class="ld-btn" id="ld-leads" style="background:#059669;color:#fff;font-weight:600;">📋 <span class="ld-btn-label">Cotações</span> <span class="ld-badge" id="ld-leads-badge" style="background:#fff;color:#059669;padding:1px 6px;border-radius:10px;font-size:11px;margin-left:4px;display:none;">0</span></button>
            <div class="ld-sep"></div>
            <button class="ld-btn" id="ld-dep">⭐ <span class="ld-btn-label">Depoimentos</span></button>
            <div class="ld-sep"></div>
            <button class="ld-btn orange" id="ld-colors">🎨 <span class="ld-btn-label">Cores</span></button>
            <div class="ld-sep"></div>
            <button class="ld-btn green" id="ld-pub">🚀 <span class="ld-btn-label">Publicar</span></button>
            <div class="ld-sep"></div>
            <button class="ld-btn" id="ld-revert" title="Descartar rascunho não publicado">↩ <span class="ld-btn-label">Reverter</span></button>
            <button class="ld-btn red" id="ld-exit">✕ <span class="ld-btn-label">Sair</span></button>`;
            document.body.prepend(bar);
            const pubBtn = document.getElementById('ld-pub');
            if (pubBtn) {
                const footerBtn = document.createElement('button');
                footerBtn.className = 'ld-btn';
                footerBtn.id = 'ld-footer';
                footerBtn.innerHTML = '📝 <span class="ld-btn-label">Rodapé</span>';
                pubBtn.before(footerBtn);
            }
            document.getElementById('ld-add-pkg').onclick    = () => this.pAddPacote();
            document.getElementById('ld-buy-links').onclick  = () => this.pManageBuyLinks();
            document.getElementById('ld-banners').onclick    = () => this.pManageBanners();
            const heroBtn = document.getElementById('ld-hero');
            if (heroBtn) {
                if (!document.querySelector('.hero-bg .hero-slide')) heroBtn.style.display = 'none';
                heroBtn.onclick = () => this.pHero();
            }
            document.getElementById('ld-leads').onclick      = () => this.pManageLeads();
            this.updateLeadsBadge();
            document.getElementById('ld-dep').onclick       = () => this.pManageDep();
            document.getElementById('ld-colors').onclick = () => this.pColors();
            document.getElementById('ld-footer').onclick = () => this.pFooter();
            document.getElementById('ld-pub').onclick    = () => this.publish();
            document.getElementById('ld-revert').onclick = () => this.revert();
            document.getElementById('ld-exit').onclick   = () => this.exit();
        },

        bindAll() {
            document.querySelectorAll('[data-eid]').forEach(el => {
                if (el._ldBound) return;
                el._ldBound = true;
                el.addEventListener('click', e => {
                    e.preventDefault();
                    e.stopPropagation();
                    document.querySelectorAll('.ld-sel').forEach(x => x.classList.remove('ld-sel'));
                    el.classList.add('ld-sel');
                    this.dispatch(el);
                });
            });
            // Mostrar botão de adicionar depoimento
            const depBtn = document.getElementById('dep-add-btn');
            if (depBtn) depBtn.style.display = 'block';
            // Adicionar botões de remover em cada card de pacote
            this.bindPackageRemoveButtons();
            // Adicionar botões de remover em cada card de depoimento
            this.bindDepRemoveButtons();
        },

        dispatch(el) {
            if (el.tagName === 'IMG')      this.pImage(el);
            else if (el.tagName === 'A')   this.pLink(el);
            else                           this.pText(el);
        },

        /* ── TEXTO ── */
        pText(el) {
            const origHTML  = el.innerHTML;
            const origStyle = el.getAttribute('style') || '';
            const cs = getComputedStyle(el);
            let colorChanged = false, sizeChanged = false;
            const p = this.panel_('✏️ Editar Texto — ' + (el.dataset.elabel || ''));
            p.innerHTML += `<div class="ld-pb">
                <div class="ld-f"><label>Conteúdo</label>
                    <div class="ld-rich" contenteditable="true" id="ldr">${el.innerHTML}</div>
                    <div class="ld-fmts">
                        <button onmousedown="event.preventDefault();document.execCommand('bold')"><b>N</b></button>
                        <button onmousedown="event.preventDefault();document.execCommand('italic')"><i>I</i></button>
                        <button onmousedown="event.preventDefault();document.execCommand('underline')"><u>S</u></button>
                    </div>
                </div>
                <div class="ld-g2">
                    <div class="ld-f"><label>Cor do texto</label><input type="color" id="ldtc" value="${this.hex(cs.color)}"></div>
                    <div class="ld-f"><label>Tamanho (px)</label><input type="text" id="ldfs" value="${parseInt(cs.fontSize)||16}"></div>
                </div>
                <div class="ld-acts">
                    <button class="ld-ok" id="lda">✓ Aplicar</button>
                    <button class="ld-ko" id="ldc">Cancelar</button>
                </div>
                <button class="ld-danger" id="ldrme" type="button">Remover este item do site</button>
            </div>`;
            const rich = p.querySelector('#ldr');
            const tc   = p.querySelector('#ldtc');
            const fs   = p.querySelector('#ldfs');
            rich.oninput = () => el.innerHTML = rich.innerHTML;
            tc.oninput   = () => { colorChanged = true; el.style.color = tc.value; };
            fs.oninput   = () => { sizeChanged  = true; el.style.fontSize = fs.value + 'px'; };
            p.querySelector('#lda').onclick = () => {
                const styleOverride = {};
                if (colorChanged) styleOverride.color = tc.value;
                if (sizeChanged)  styleOverride.fontSize = fs.value + 'px';
                const entry = { html: el.innerHTML };
                if (Object.keys(styleOverride).length) entry.style = styleOverride;
                this.store(el.dataset.eid, entry);
                this.closePanel();
                this.toast('✓ Texto salvo no rascunho', 'ok');
            };
            p.querySelector('#ldc').onclick = () => {
                el.innerHTML = origHTML;
                el.setAttribute('style', origStyle);
                this.closePanel();
            };
            p.querySelector('#ldrme').onclick = () => this.removeElement(el);
        },

        /* ── IMAGEM ── */
        pImage(el) {
            const origSrc = el.src;
            // Usa o atributo src original (não o absoluto do browser) se disponível
            const origAttr = el.getAttribute('src') || el.src;
            const p = this.panel_('🖼️ Trocar Imagem — ' + (el.dataset.elabel || ''));
            p.innerHTML += `<div class="ld-pb">
                <img class="ld-prev" id="ldprev" src="${origSrc}" style="background:#F3F4F6;">
                <div class="ld-f">
                    <label>Nova foto</label>
                    <button id="ldbtn" style="width:100%;padding:10px;border:2px dashed #E5E7EB;border-radius:8px;background:#F9FAFB;cursor:pointer;font-size:13px;color:#374151;transition:border .15s;">
                        📂 Escolher foto do computador
                    </button>
                    <input type="file" id="ldfile" accept="image/jpeg,image/png,image/webp,image/gif" style="display:none">
                    <div id="ldupstatus" class="ld-hint" style="margin-top:6px;"></div>
                </div>
                <div class="ld-f">
                    <label>Ou cole o endereço de uma foto</label>
                    <input type="url" id="ldiu" value="${origAttr}" placeholder="https://site.com/foto.jpg">
                    <p class="ld-hint">Não precisa preencher se você escolheu a foto acima.</p>
                </div>
                <div class="ld-acts">
                    <button class="ld-ok" id="lda">✓ Aplicar</button>
                    <button class="ld-ko" id="ldc">Cancelar</button>
                </div>
                <button class="ld-danger" id="ldrme" type="button">Remover esta imagem do site</button>
            </div>`;
            const ui     = p.querySelector('#ldiu');
            const pv     = p.querySelector('#ldprev');
            const btn    = p.querySelector('#ldbtn');
            const file   = p.querySelector('#ldfile');
            const status = p.querySelector('#ldupstatus');
            let debounce;

            // Botão abre seletor de arquivo
            btn.onclick = () => file.click();
            btn.onmouseenter = () => btn.style.borderColor = '#1565C0';
            btn.onmouseleave = () => btn.style.borderColor = '#E5E7EB';

            // Upload quando arquivo selecionado (o site reduz a foto sozinho)
            file.onchange = async () => {
                const f = file.files[0];
                if (!f) return;
                const tmp = URL.createObjectURL(f);
                el.src = tmp; pv.src = tmp;
                btn.textContent = '⏳ Enviando…';
                btn.disabled = true;
                status.textContent = 'Enviando a foto, aguarde…';
                status.style.color = '#6B7280';
                try {
                    const url = await uploadImageFile(f, { maxW: 1600, maxH: 1600 });
                    if (!url) throw new Error('Não foi possível enviar a foto.');
                    document.querySelectorAll(`[data-eid="${el.dataset.eid}"]`).forEach(e => {
                        if (e.tagName === 'IMG') e.src = url;
                    });
                    pv.src = url;
                    ui.value = url;
                    btn.textContent = '✅ Foto enviada!';
                    status.textContent = 'Agora clique em ✓ Aplicar.';
                    status.style.color = '#16A34A';
                } catch (err) {
                    el.src = origSrc;
                    pv.src = origSrc;
                    btn.textContent = '📂 Escolher foto do computador';
                    btn.disabled = false;
                    status.textContent = '❌ ' + (err.message || 'Erro no envio');
                    status.style.color = '#DC2626';
                }
            };

            // Preview por URL digitada
            ui.oninput = () => {
                clearTimeout(debounce);
                debounce = setTimeout(() => {
                    const v = ui.value.trim();
                    if (v) { el.src = v; pv.src = v; }
                }, 500);
            };
            p.querySelector('#lda').onclick = () => {
                clearTimeout(debounce);
                const src = ui.value.trim() || origSrc;
                pv.src = src;
                // Atualiza TODOS os elementos com o mesmo data-eid (ex: slide + miniatura)
                document.querySelectorAll(`[data-eid="${el.dataset.eid}"]`).forEach(e => {
                    if (e.tagName === 'IMG') e.src = src;
                });
                this.store(el.dataset.eid, { src });
                this.closePanel();
                this.toast('✓ Imagem salva no rascunho', 'ok');
            };
            p.querySelector('#ldc').onclick = () => {
                el.src = origSrc;
                this.closePanel();
            };
            p.querySelector('#ldrme').onclick = () => this.removeElement(el);
        },

        /* ── LINK ── */
        pLink(el) {
            const origHTML   = el.innerHTML;
            const origStyle  = el.getAttribute('style') || '';
            const origHref   = el.getAttribute('href') || '';
            const origTarget = el.getAttribute('target') || '_self';
            const cs = getComputedStyle(el);
            const p = this.panel_('🔗 Editar Botão/Link — ' + (el.dataset.elabel || ''));
            p.innerHTML += `<div class="ld-pb">
                <div class="ld-f"><label>Texto</label><input type="text" id="ldbt" value="${el.textContent.trim()}"></div>
                <div class="ld-f"><label>Link (URL)</label><input type="url" id="ldbh" value="${origHref}" placeholder="https://wa.me/..."></div>
                <div class="ld-f"><label>Abrir em</label>
                    <select id="ldtgt">
                        <option value="_self" ${origTarget!=='_blank'?'selected':''}>Mesma aba</option>
                        <option value="_blank" ${origTarget==='_blank'?'selected':''}>Nova aba</option>
                    </select>
                </div>
                <div class="ld-g2">
                    <div class="ld-f"><label>Cor de fundo</label><input type="color" id="ldbbg" value="${this.hex(cs.backgroundColor)}"></div>
                    <div class="ld-f"><label>Cor do texto</label><input type="color" id="ldbfg" value="${this.hex(cs.color)}"></div>
                </div>
                <div class="ld-acts">
                    <button class="ld-ok" id="lda">✓ Aplicar</button>
                    <button class="ld-ko" id="ldc">Cancelar</button>
                </div>
                <button class="ld-danger" id="ldrme" type="button">Remover este item do site</button>
            </div>`;
            const bt  = p.querySelector('#ldbt');
            const bh  = p.querySelector('#ldbh');
            const tgt = p.querySelector('#ldtgt');
            const bbg = p.querySelector('#ldbbg');
            const bfg = p.querySelector('#ldbfg');
            let bgChanged = false, fgChanged = false;
            bt.oninput  = () => { const ic = el.querySelector('i'); el.textContent = bt.value; if(ic) el.prepend(ic.cloneNode(true)); };
            bbg.oninput = () => { bgChanged = true; el.style.backgroundColor = bbg.value; };
            bfg.oninput = () => { fgChanged = true; el.style.color = bfg.value; };
            p.querySelector('#lda').onclick = () => {
                el.setAttribute('href', bh.value);
                el.setAttribute('target', tgt.value);
                const styleOverride = {};
                if (bgChanged) styleOverride.backgroundColor = bbg.value;
                if (fgChanged) styleOverride.color = bfg.value;
                const entry = { html: el.innerHTML, href: bh.value, target: tgt.value };
                if (Object.keys(styleOverride).length) entry.style = styleOverride;
                this.store(el.dataset.eid, entry);
                this.closePanel();
                this.toast('✓ Botão salvo no rascunho', 'ok');
            };
            p.querySelector('#ldc').onclick = () => {
                el.innerHTML = origHTML;
                el.setAttribute('style', origStyle);
                el.setAttribute('href', origHref);
                this.closePanel();
            };
            p.querySelector('#ldrme').onclick = () => this.removeElement(el);
        },

        /* ── CORES GLOBAIS ── */
        pFooter() {
            const fields = [...document.querySelectorAll('footer [data-eid], [data-eid^="ft-"], [data-eid^="info-email"], [data-eid^="info-horario"]')];
            const p = this.panel_('📝 Editar Rodapé');
            if (!fields.length) {
                p.innerHTML += `<div class="ld-pb"><div class="ld-info">Nenhum texto do rodapé para editar nesta página.</div></div>`;
                return;
            }
            const rows = fields.map((el, i) => `
                <div class="ld-f">
                    <label>${escapeHTML(el.dataset.elabel || el.dataset.eid || ('Campo ' + (i + 1)))}</label>
                    <textarea rows="2" data-footer-eid="${escapeHTML(el.dataset.eid)}">${escapeHTML(el.textContent.trim())}</textarea>
                </div>`).join('');
            p.innerHTML += `<div class="ld-pb">
                <div class="ld-info">Aqui você muda e-mail, horário de atendimento e os textos do final do site.</div>
                ${rows}
                <div class="ld-acts">
                    <button class="ld-ok" id="ld-footer-save">✓ Salvar</button>
                    <button class="ld-ko" id="ld-footer-close">Cancelar</button>
                </div>
            </div>`;
            p.querySelector('#ld-footer-close').onclick = () => this.closePanel();
            p.querySelector('#ld-footer-save').onclick = () => {
                p.querySelectorAll('[data-footer-eid]').forEach(input => {
                    const eid = input.dataset.footerEid;
                    const value = input.value.trim();
                    if (!eid) return;
                    document.querySelectorAll(`[data-eid="${CSS.escape(eid)}"]`).forEach(el => {
                        if (el.tagName === 'A' && value.includes('@')) el.href = 'mailto:' + value;
                        const icon = el.querySelector('i');
                        el.textContent = value;
                        if (icon) el.prepend(icon.cloneNode(true));
                    });
                    const current = document.querySelector(`[data-eid="${CSS.escape(eid)}"]`);
                    this.store(eid, { html: current ? current.innerHTML : value, ...(value.includes('@') ? { href: 'mailto:' + value } : {}) });
                });
                const email = entryText(this.cms, 'info-email', FOOTER_DEFAULTS.email);
                const infoHours = entryText(this.cms, 'info-horario', FOOTER_DEFAULTS.infoHours);
                const hours = entryText(this.cms, 'ft-hours', FOOTER_DEFAULTS.hours);
                const hours2 = entryText(this.cms, 'ft-hours2', FOOTER_DEFAULTS.hours2);
                const copyright = entryText(this.cms, 'ft-copyright', FOOTER_DEFAULTS.copyright);
                ['info-email', 'ft-email', 'ft-email-pacote'].forEach(eid => {
                    this.cms[eid] = { html: email, href: 'mailto:' + email };
                });
                this.cms['info-horario'] = { html: infoHours };
                ['ft-hours', 'ft-hours-pacote'].forEach(eid => { this.cms[eid] = { html: hours }; });
                ['ft-hours2', 'ft-hours2-pacote'].forEach(eid => { this.cms[eid] = { html: hours2 }; });
                this.cms['ft-copyright'] = { html: copyright };
                syncContactFooter(this.cms);
                saveDraft(this.cms);
                this.closePanel();
                this.markDirty();
                this.toast('✓ Rodapé salvo. Clique em Publicar para ir ao ar.', 'ok');
            };
        },

        pColors() {
            const root = document.documentElement;
            const alias = { '--primary': '--navy', '--primary-dark': '--navy-dark', '--text-dark': '--text' };
            const g = v => {
                const cs = getComputedStyle(root);
                const val = (cs.getPropertyValue(v).trim() || (alias[v] ? cs.getPropertyValue(alias[v]).trim() : ''));
                return /^#|^rgb/i.test(val) ? val : '';
            };
            const p = this.panel_('🎨 Cores Globais do Site');
            p.innerHTML += `<div class="ld-pb">
                <div class="ld-info">Muda as cores do site todo de uma vez. Clique na cor para escolher outra.</div>
                <div class="ld-cr"><label>🔵 Azul principal</label><input type="color" id="ldg1" value="${this.hex(g('--primary'))||'#1565C0'}"></div>
                <div class="ld-cr"><label>🔵 Azul escuro</label><input type="color" id="ldg2" value="${this.hex(g('--primary-dark'))||'#0D47A1'}"></div>
                <div class="ld-cr"><label>🟠 Laranja destaque</label><input type="color" id="ldg3" value="${this.hex(g('--accent'))||'#F97316'}"></div>
                <div class="ld-cr"><label>⬛ Texto principal</label><input type="color" id="ldg4" value="${this.hex(g('--text-dark'))||'#1A1F2E'}"></div>
                <div class="ld-cr"><label>🟩 WhatsApp verde</label><input type="color" id="ldg5" value="${this.hex(g('--wa'))||'#25D366'}"></div>
                <hr class="ld-hr">
                <div class="ld-f"><label>📱 Número do WhatsApp</label>
                    <input type="text" id="ldgwa" value="${this.cms.whatsapp||''}" placeholder="5511999999999">
                    <p class="ld-hint">Só números, começando com 55 e o DDD. Ex: 5579999999999. Muda todos os botões de WhatsApp do site.</p>
                </div>
                <div class="ld-acts">
                    <button class="ld-ok" id="lda">✓ Salvar</button>
                    <button class="ld-ko" id="ldc">Cancelar</button>
                </div>
            </div>`;
            const vars = ['--primary','--primary-dark','--accent','--text-dark','--wa'];
            const inputs = ['ldg1','ldg2','ldg3','ldg4','ldg5'].map(id => p.querySelector('#'+id));
            const waInp = p.querySelector('#ldgwa');
            const touched = new Set();
            inputs.forEach((inp, i) => {
                inp.oninput = () => {
                    touched.add(i);
                    root.style.setProperty(vars[i], inp.value);
                    if (alias[vars[i]]) root.style.setProperty(alias[vars[i]], inp.value);
                };
            });
            waInp.oninput = () => {
                const num = waInp.value.replace(/\D/g, '');
                if (num) document.querySelectorAll('a[href*="wa.me/"]').forEach(a => {
                    a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + num);
                });
            };
            p.querySelector('#lda').onclick = () => {
                const colors = {};
                vars.forEach((v, i) => { if (touched.has(i)) colors[v] = inputs[i].value; });
                this.cms.colors = { ...(this.cms.colors || {}), ...colors };
                const num = waInp.value.replace(/\D/g, '');
                if (num) this.cms.whatsapp = num;
                saveDraft(this.cms);
                this.markDirty();
                this.closePanel();
                this.toast('✓ Cores salvas no rascunho', 'ok');
            };
            p.querySelector('#ldc').onclick = () => {
                // Remove também aliases usados em index.html / pacote.html
                [...vars, '--navy', '--navy-dark', '--text'].forEach(v => root.style.removeProperty(v));
                applyContent(this.cms);
                this.closePanel();
            };
        },

        /* ── ADICIONAR PACOTE ── */
        pAddPacoteLegacyDraftOnly() {
            const p = this.panel_('➕ Adicionar Novo Pacote');
            p.innerHTML += `<div class="ld-pb">
                <div class="ld-info">Preencha os dados do novo pacote. Ele aparecerá na grade de destinos.</div>
                <div class="ld-f"><label>ID único (ex: cancun, paris, noronha)</label><input type="text" id="pkg-id" placeholder="cancun"></div>
                <div class="ld-f"><label>País / Bandeira (ex: México 🌮)</label><input type="text" id="pkg-flag" placeholder="Brasil 🏖️"></div>
                <div class="ld-f"><label>Título do pacote</label><input type="text" id="pkg-title" placeholder="Cancún & Riviera Maya"></div>
                <div class="ld-f"><label>Subtítulo</label><input type="text" id="pkg-subtitle" placeholder="O Caribe Mexicano te espera"></div>
                <div class="ld-f"><label>Localização</label><input type="text" id="pkg-loc" placeholder="Cancún, México"></div>
                <div class="ld-f"><label>Duração</label><input type="text" id="pkg-dur" placeholder="7 dias / 6 noites"></div>
                <div class="ld-f"><label>Preço (ex: 4.990,00)</label><input type="text" id="pkg-price" placeholder="4.990,00"></div>
                <div class="ld-f"><label>Parcelamento (ex: 10x de R$ 499)</label><input type="text" id="pkg-parc" placeholder="10x de R$ 499"></div>
                <div class="ld-f"><label>URL da foto principal</label><input type="url" id="pkg-img" placeholder="https://images.unsplash.com/..."></div>
                <div class="ld-f"><label>Descrição do destino</label><textarea id="pkg-desc" rows="3"></textarea></div>
                <div class="ld-f"><label>O que está incluso (um por linha)</label><textarea id="pkg-incluso" rows="4" placeholder="Passagem aérea ida e volta&#10;Hospedagem com café da manhã"></textarea></div>
                <div class="ld-acts">
                    <button class="ld-ok" id="lda">✓ Criar Pacote</button>
                    <button class="ld-ko" id="ldc">Cancelar</button>
                </div>
            </div>`;
            p.querySelector('#ldc').onclick = () => this.closePanel();
            p.querySelector('#lda').onclick = () => {
                const id       = p.querySelector('#pkg-id').value.trim().replace(/\s+/g,'').toLowerCase();
                const flag     = p.querySelector('#pkg-flag').value.trim();
                const title    = p.querySelector('#pkg-title').value.trim();
                const subtitle = p.querySelector('#pkg-subtitle').value.trim();
                const loc      = p.querySelector('#pkg-loc').value.trim();
                const dur      = p.querySelector('#pkg-dur').value.trim();
                const price    = p.querySelector('#pkg-price').value.trim();
                const parc     = p.querySelector('#pkg-parc').value.trim();
                const img      = p.querySelector('#pkg-img').value.trim();
                const desc     = p.querySelector('#pkg-desc').value.trim();
                const inclusoBruto = p.querySelector('#pkg-incluso').value.trim();
                const buyUrl = (p.querySelector('#pkg-buy-url')?.value || '').trim();
                if (!id || !title || !price) {
                    this.toast('⚠️ Preencha ID, Título e Preço', 'err'); return;
                }
                const incluso = inclusoBruto ? inclusoBruto.split('\n').map(s=>s.trim()).filter(Boolean) : ['Aéreo ida e volta','Hospedagem com café da manhã','Transfer aeroporto-hotel','Guia local'];
                // Salvar no CMS para publicação
                const pkgData = { id, flag, title, subtitle, location: loc, duration: dur, price, parcelas: parc, img, desc, incluso, _new: true };
                if (!this.cms._packages) this.cms._packages = {};
                this.cms._packages[id] = pkgData;
                saveDraft(this.cms);
                this.markDirty();
                // Renderizar card na home
                this._renderNewPackageCard(pkgData);
                this.closePanel();
                this.toast('✓ Pacote "' + title + '" criado! Publique para salvar.', 'ok');
            };
        },

        pAddPacote() {
            const p = this.panel_('➕ Novo Pacote');
            p.innerHTML += `<div class="ld-pb">
                <div class="ld-info">Preencha e clique em <strong>Criar pacote</strong>. Ele aparece na lista de destinos do site. Só <strong>Nome</strong> e <strong>Preço</strong> são obrigatórios.</div>
                <div class="ld-f"><label>Nome do pacote *</label><input type="text" id="pkg-title" placeholder="Ex: Cancún & Riviera Maya"></div>
                <div class="ld-f"><label>Frase curta</label><input type="text" id="pkg-subtitle" placeholder="Ex: O Caribe Mexicano te espera"></div>
                <div class="ld-f"><label>Cidade / país</label><input type="text" id="pkg-loc" placeholder="Ex: Cancún, México"></div>
                <div class="ld-g2">
                    <div class="ld-f"><label>Preço por pessoa *</label><input type="text" id="pkg-price" placeholder="4.990,00"></div>
                    <div class="ld-f"><label>Quantos dias</label><input type="text" id="pkg-dur" placeholder="7 dias / 6 noites"></div>
                </div>
                <div class="ld-f"><label>Parcelamento</label><input type="text" id="pkg-parc" placeholder="Ex: 10x de R$ 499"></div>
                <div class="ld-f"><label>Fotos do pacote</label>
                    <button type="button" class="ld-ok" id="pkg-file-btn" style="width:100%;margin-bottom:6px;">📷 Escolher fotos do computador</button>
                    <input type="file" id="pkg-files" accept="image/*" multiple style="display:none">
                    <div id="pkg-file-status" class="ld-hint">Pode escolher várias de uma vez. A primeira vira a capa.</div>
                </div>
                <div class="ld-f"><label>Descrição do destino</label><textarea id="pkg-desc" rows="3" placeholder="Conte um pouco sobre o lugar"></textarea></div>
                <div class="ld-f"><label>O que está incluso (um item por linha)</label><textarea id="pkg-incluso" rows="4" placeholder="Passagem aérea ida e volta&#10;Hospedagem com café da manhã"></textarea></div>
                <div class="ld-f"><label>Link de compra online (se tiver)</label><input type="url" id="pkg-buy-url" placeholder="https://..."><p class="ld-hint">Se ficar vazio, o botão leva para o WhatsApp.</p></div>
                <details style="margin-bottom:10px;font-size:12px;color:#6B7280;">
                    <summary style="cursor:pointer;">Mais opções (não precisa mexer)</summary>
                    <div class="ld-f" style="margin-top:8px;"><label>Etiqueta da foto (ex: Internacional)</label><input type="text" id="pkg-flag" placeholder="Nacional"></div>
                    <div class="ld-f"><label>Endereço do pacote (sem espaço)</label><input type="text" id="pkg-id" placeholder="Vazio = criado pelo nome"></div>
                    <div class="ld-f"><label>Endereços de fotos (um por linha)</label><textarea id="pkg-imgs" rows="3" placeholder="https://.../foto.webp"></textarea></div>
                </details>
                <div class="ld-acts">
                    <button class="ld-ok" id="lda">✓ Criar pacote</button>
                    <button class="ld-ko" id="ldc">Cancelar</button>
                </div>
            </div>`;
            p.querySelector('#ldc').onclick = () => this.closePanel();
            p.querySelector('#pkg-file-btn').onclick = () => p.querySelector('#pkg-files').click();
            p.querySelector('#pkg-files').onchange = () => {
                const total = p.querySelector('#pkg-files').files.length;
                p.querySelector('#pkg-file-status').textContent = total ? (total === 1 ? '1 foto escolhida.' : total + ' fotos escolhidas.') : 'Nenhuma foto escolhida.';
            };
            p.querySelector('#lda').onclick = async () => {
                let id         = cleanPackageId((p.querySelector('#pkg-id').value || p.querySelector('#pkg-title').value).trim().replace(/\s+/g, '-')).replace(/-+/g, '-').replace(/^-|-$/g, '');
                if (id && !p.querySelector('#pkg-id').value.trim()) { const base = id; let n = 2; while (document.querySelector('#destinos .card-link[href*="id=' + id + '"]') || (this.cms._packages || {})[id]) id = base + '-' + (n++); }
                const flag     = p.querySelector('#pkg-flag').value.trim();
                const title    = p.querySelector('#pkg-title').value.trim();
                const subtitle = p.querySelector('#pkg-subtitle').value.trim();
                const loc      = p.querySelector('#pkg-loc').value.trim();
                const dur      = p.querySelector('#pkg-dur').value.trim();
                const price    = p.querySelector('#pkg-price').value.trim();
                const parc     = p.querySelector('#pkg-parc').value.trim();
                const desc     = p.querySelector('#pkg-desc').value.trim();
                const inclusoBruto = p.querySelector('#pkg-incluso').value.trim();
                const buyUrl = (p.querySelector('#pkg-buy-url')?.value || '').trim();
                if (!id || !title || !price) {
                    this.toast('Preencha o nome e o preço do pacote', 'err');
                    return;
                }
                const urlLines = p.querySelector('#pkg-imgs').value.split('\n').map(s => s.trim()).filter(Boolean);
                if (urlLines.some(src => !isValidImageSrc(src))) {
                    this.toast('Um dos endereços de foto não funciona. Use o botão Escolher fotos.', 'err');
                    p.querySelector('#pkg-imgs').focus();
                    return;
                }
                const btn = p.querySelector('#lda');
                btn.disabled = true;
                btn.textContent = 'Criando pacote, aguarde...';
                try {
                    const uploaded = [];
                    for (const file of [...p.querySelector('#pkg-files').files]) {
                        uploaded.push(await uploadImageFile(file, { maxW: 1600, maxH: 1600 }));
                    }
                    const fotos = [...uploaded, ...urlLines].filter(Boolean);
                    const incluso = inclusoBruto ? inclusoBruto.split('\n').map(s=>s.trim()).filter(Boolean) : ['Aereo ida e volta','Hospedagem com cafe da manha','Transfer aeroporto-hotel','Guia local'];
                const pkgData = { id, flag, title, subtitle, location: loc, duration: dur, price, parcelas: parc, img: fotos[0] || FALLBACK_PACKAGE_IMG, fotos, desc, incluso, ...(buyUrl ? { buyUrl } : {}), _new: true };
                    if (!this.cms._packages) this.cms._packages = {};
                    this.cms._packages[id] = pkgData;
                    saveDraft(this.cms);
                    this.markDirty();
                    this._renderNewPackageCard(pkgData);
                    await this.publishNow(sessionStorage.getItem('lovisa_secret') || '');
                    localStorage.removeItem(CMS_KEY);
                    document.querySelectorAll('.ld-dirty-dot').forEach(d => d.remove());
                    this.closePanel();
                    this.toast('✓ Pacote criado e publicado no site!', 'ok');
                } catch (err) {
                    btn.disabled = false;
                    btn.textContent = '✓ Criar pacote';
                    this.toast(err.message || 'Erro ao publicar pacote', 'err');
                }
            };
        },

        _renderNewPackageCard(pkg) {
            const grid = document.querySelector('.cards-grid');
            if (!grid) return;
            const wrap = document.createElement('div');
            wrap.style.position = 'relative';
            wrap.className = 'card-link-wrap';
            wrap.innerHTML = `
                <button class="ld-remove-pkg" data-pkg-id="${pkg.id}" title="Remover pacote">Remover</button>
                <a href="${packageUrl(pkg)}" class="card-link rv on">
                    <div class="card-img">
                        <img src="${pkg.img || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80'}" alt="${pkg.title}" loading="lazy">
                        <div class="card-flag">${pkg.flag || ''}</div>
                        <div class="card-overlay"><span>Ver pacote <i class="fa-solid fa-arrow-right"></i></span></div>
                    </div>
                    <div class="card-body">
                        <div class="card-loc"><i class="fa-solid fa-location-dot"></i> ${pkg.location || ''}</div>
                        <h3>${pkg.title}</h3>
                        <div class="card-foot">
                            <div class="card-price">R$ ${pkg.price} <small>/ pessoa</small></div>
                            <span class="card-arrow">Saiba mais <i class="fa-solid fa-arrow-right"></i></span>
                        </div>
                    </div>
                </a>`;
            grid.appendChild(wrap);
            wrap.querySelector('.ld-remove-pkg').addEventListener('click', e => {
                e.stopPropagation();
                this._confirmRemovePkg(pkg.id, wrap);
            });
        },

        bindPackageRemoveButtons() {
            // Adicionar botão de remover em cada card existente
            document.querySelectorAll('.cards-grid .card-link').forEach(card => {
                if (card.querySelector('.ld-remove-pkg')) return; // já tem
                const href = card.getAttribute('href') || '';
                const m = href.match(/id=([^&]+)/);
                if (!m) return;
                const pkgId = m[1];
                // Envolver em wrapper relativo se necessário
                if (!card.parentElement.classList.contains('card-link-wrap')) {
                    const wrap = document.createElement('div');
                    wrap.style.position = 'relative';
                    wrap.className = 'card-link-wrap';
                    card.parentNode.insertBefore(wrap, card);
                    wrap.appendChild(card);
                    const btn = document.createElement('button');
                    btn.className = 'ld-remove-pkg';
                    btn.dataset.pkgId = pkgId;
                    btn.title = 'Remover pacote';
                    btn.innerHTML = '🗑 Remover';
                    wrap.appendChild(btn);
                    btn.addEventListener('click', e => {
                        e.stopPropagation();
                        this._confirmRemovePkg(pkgId, wrap);
                    });
                }
            });
        },

        _confirmRemovePkg(pkgId, el) {
            if (!confirm(`Remover o pacote "${pkgId}" do site?\n\nEsta ação será aplicada ao publicar.`)) return;
            if (!this.cms._removedPackages) this.cms._removedPackages = [];
            if (!this.cms._removedPackages.includes(pkgId)) this.cms._removedPackages.push(pkgId);
            saveDraft(this.cms);
            this.markDirty();
            el.style.opacity = '0.3';
            el.style.pointerEvents = 'none';
            el.style.outline = '2px dashed #ef4444';
            this.toast('🗑 Pacote marcado para remover. Publique para confirmar.', 'ok');
        },

        /* ── GERENCIAR SOLICITAÇÕES / LEADS ── */
        /* Solicitações ficam em /api/lead (criptografadas, só com a senha do painel) */
        async fetchLeads() {
            const secret = sessionStorage.getItem('lovisa_secret') || '';
            const r = await fetch('/api/lead?_=' + Date.now(), { headers: { 'x-admin-secret': secret } });
            if (r.status === 401) throw new Error('Sessão expirada. Saia e entre de novo no painel.');
            const j = await r.json().catch(() => ({}));
            if (!r.ok) throw new Error(j.error || 'Não foi possível carregar as cotações.');
            this._leads = Array.isArray(j.leads) ? j.leads : [];
            return this._leads;
        },

        async updateLeadsBadge() {
            const badge = document.getElementById('ld-leads-badge');
            if (!badge) return;
            try {
                const list = this._leads || await this.fetchLeads();
                const seen = parseInt(localStorage.getItem('lovisa_leads_seen') || '0', 10);
                const novos = list.filter(l => (l.timestamp || 0) > seen).length;
                badge.textContent = novos ? (novos + (novos > 1 ? ' novas' : ' nova')) : String(list.length);
                badge.style.display = list.length ? 'inline-block' : 'none';
            } catch (_) { badge.style.display = 'none'; }
        },

        pManageLeads() {
            const p = this.panel_('📋 Cotações recebidas');
            const seenBefore = parseInt(localStorage.getItem('lovisa_leads_seen') || '0', 10);
            let filtro = '';

            const shell = (inner) => {
                p.querySelector('.ld-pb')?.remove();
                const pb = document.createElement('div');
                pb.className = 'ld-pb';
                pb.innerHTML = inner;
                p.append(pb);
                return pb;
            };

            const card = (lead) => {
                const digits = String(lead.whats || '').replace(/\D/g, '');
                const phone = digits.length >= 12 && digits.startsWith('55') ? digits : (digits ? '55' + digits : '');
                const primeiro = String(lead.nome || '').split(' ')[0];
                const msg = 'Olá ' + primeiro + '! Aqui é da Lovisa Destinos. Recebemos seu pedido de cotação para ' + (lead.destino || 'sua viagem') + ' e já estamos preparando sua cotação.';
                const waLink = phone ? 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg) : '';
                const isNew = (lead.timestamp || 0) > seenBefore;
                const field = (label, value, extra) => '<div><span style="color:#6B7280;font-size:11px;">' + label + '</span><div style="' + (extra || '') + '">' + escapeHTML(value || '—') + '</div></div>';
                return '<div style="border:1.5px solid ' + (isNew ? '#86EFAC' : '#E5E7EB') + ';border-radius:10px;padding:12px 14px;background:#fff;">'
                    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;border-bottom:1px solid #F3F4F6;padding-bottom:6px;gap:8px;">'
                    + '<div style="font-size:12px;color:#6B7280;">📅 <strong>' + escapeHTML(lead.data || '—') + '</strong>'
                    + (isNew ? ' <span style="background:#DCFCE7;color:#166534;font-weight:700;padding:1px 8px;border-radius:99px;font-size:11px;margin-left:4px;">NOVA</span>' : '') + '</div>'
                    + '<button type="button" class="ld-ko" data-lead-del="' + escapeHTML(lead.id || '') + '" style="padding:4px 10px;font-size:12px;color:#DC2626;">✕ Excluir</button></div>'
                    + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px;font-size:13px;">'
                    + field('NOME', lead.nome, 'font-weight:700;color:#111827;')
                    + field('DESTINO', lead.destino, 'font-weight:700;color:#2563EB;')
                    + field('WHATSAPP', lead.whats, 'font-weight:700;')
                    + field('E-MAIL', lead.email, 'word-break:break-all;')
                    + field('VIAJANTES', lead.viajantes)
                    + field('DATAS', (lead.ida || '—') + ' → ' + (lead.volta || '—'))
                    + '</div>'
                    + (lead.obs && lead.obs !== '—' ? '<div style="background:#F9FAFB;border-radius:6px;padding:6px 10px;font-size:12px;color:#4B5563;margin-top:8px;"><strong>Observações:</strong> ' + escapeHTML(lead.obs) + '</div>' : '')
                    + (waLink ? '<a href="' + waLink + '" target="_blank" rel="noopener noreferrer" style="margin-top:10px;display:flex;align-items:center;justify-content:center;gap:6px;background:#25D366;color:#fff;padding:9px 12px;border-radius:8px;font-size:13px;text-decoration:none;font-weight:700;"><i class="fab fa-whatsapp"></i> Responder no WhatsApp</a>' : '')
                    + '</div>';
            };

            const render = () => {
                const all = this._leads || [];
                const q = filtro.trim().toLowerCase();
                const list = q ? all.filter(l => [l.nome, l.whats, l.email, l.destino, l.obs].join(' ').toLowerCase().includes(q)) : all;
                const empty = '<div style="text-align:center;padding:30px 10px;color:#6B7280;"><div style="font-size:32px;margin-bottom:8px;">📬</div><strong>'
                    + (q ? 'Nenhuma cotação encontrada nessa busca.' : 'Nenhuma cotação recebida ainda.') + '</strong><p style="font-size:12px;margin-top:4px;">'
                    + (q ? 'Tente outro nome ou destino.' : 'Quando um cliente enviar o formulário do site, o pedido aparece aqui com data e hora.') + '</p></div>';
                const pb = shell(
                    '<div class="ld-info">Cotações enviadas pelo formulário do site. Só você vê. Para responder, clique no botão verde do WhatsApp.</div>'
                    + '<div style="display:flex;gap:8px;align-items:center;margin:10px 0;flex-wrap:wrap;">'
                    + '<input type="search" id="ld-leads-q" placeholder="Buscar por nome, destino, telefone…" style="flex:1;min-width:180px;padding:9px 12px;border:1.5px solid #E5E7EB;border-radius:8px;font-size:14px;">'
                    + '<button type="button" class="ld-btn" id="ld-leads-reload" title="Atualizar lista" style="padding:8px 12px;background:#F3F4F6;color:#111827;border-radius:8px;">↻ Atualizar</button>'
                    + (all.length ? '<button type="button" class="ld-btn" id="ld-export-csv" style="padding:8px 12px;font-size:12px;background:#059669;color:#fff;border-radius:8px;">📥 Baixar Excel / CSV</button>' : '')
                    + '</div>'
                    + '<div style="font-size:13px;color:#374151;margin-bottom:8px;"><strong>Total: <span style="color:#059669;">' + all.length + '</span></strong>' + (q ? ' · mostrando ' + list.length : '') + '</div>'
                    + '<div id="ld-leads-container" style="display:flex;flex-direction:column;gap:10px;max-height:60vh;overflow-y:auto;padding-right:4px;">'
                    + (list.length ? list.map(card).join('') : empty)
                    + '</div>');

                const qEl = pb.querySelector('#ld-leads-q');
                qEl.value = filtro;
                qEl.oninput = () => {
                    filtro = qEl.value;
                    const pos = qEl.selectionStart;
                    render();
                    const n = p.querySelector('#ld-leads-q');
                    n.focus(); n.setSelectionRange(pos, pos);
                };
                pb.querySelector('#ld-leads-reload').onclick = () => load();

                const exportBtn = pb.querySelector('#ld-export-csv');
                if (exportBtn) exportBtn.onclick = () => {
                    const cols = ['data', 'nome', 'whats', 'email', 'destino', 'viajantes', 'ida', 'volta', 'obs'];
                    const head = 'Data;Nome;WhatsApp;Email;Destino;Viajantes;Data Ida;Data Volta;Observações\n';
                    const csv = head + all.map(l => cols.map(c => '"' + String(l[c] || '').replace(/"/g, '""') + '"').join(';')).join('\n');
                    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'lovisa_cotacoes_' + new Date().toISOString().slice(0, 10) + '.csv';
                    a.click();
                    setTimeout(() => URL.revokeObjectURL(url), 1000);
                };

                pb.querySelectorAll('[data-lead-del]').forEach(btn => {
                    btn.onclick = async () => {
                        const lead = all.find(l => l.id === btn.dataset.leadDel);
                        if (!lead || !confirm('Excluir a cotação de ' + lead.nome + '? Isso não pode ser desfeito.')) return;
                        btn.disabled = true; btn.textContent = 'Excluindo…';
                        try {
                            const r = await fetch('/api/lead?id=' + encodeURIComponent(lead.id), {
                                method: 'DELETE',
                                headers: { 'x-admin-secret': sessionStorage.getItem('lovisa_secret') || '' }
                            });
                            const j = await r.json().catch(() => ({}));
                            if (!r.ok) throw new Error(j.error || 'Erro ao excluir');
                            this._leads = Array.isArray(j.leads) ? j.leads : all.filter(l => l.id !== lead.id);
                            this.toast('Cotação excluída.', 'ok');
                            render();
                            this.updateLeadsBadge();
                        } catch (e) {
                            this.toast('❌ ' + e.message, 'err');
                            btn.disabled = false; btn.textContent = '✕ Excluir';
                        }
                    };
                });
            };

            const load = async () => {
                shell('<div style="padding:30px;text-align:center;color:#6B7280;">Carregando cotações…</div>');
                try {
                    await this.fetchLeads();
                    render();
                    const newest = Math.max(0, ...(this._leads || []).map(l => l.timestamp || 0));
                    if (newest) localStorage.setItem('lovisa_leads_seen', String(newest));
                    this.updateLeadsBadge();
                } catch (e) {
                    shell('<div style="padding:24px;text-align:center;color:#B91C1C;"><strong>' + escapeHTML(e.message) + '</strong></div>');
                }
            };
            load();
        },

        /* ── GERENCIAR BANNERS ── */
        pHero() {
            const p = this.panel_('🏞️ Fotos de Fundo do Topo');
            const render = () => {
                const cur = (Array.isArray(this.cms._heroSlides) ? this.cms._heroSlides : []).filter(isValidImageSrc).slice(0, 3);
                const shown = cur.length ? cur : HERO_DEFAULTS;
                p.querySelector('.ld-pb')?.remove();
                const pb = document.createElement('div');
                pb.className = 'ld-pb';
                pb.innerHTML = `
                    <div class="ld-info">São as fotos grandes do começo do site, que trocam sozinhas a cada 7 segundos. Use fotos <strong>horizontais</strong> de paisagem, sem texto escrito. Pode usar de 1 a 3 fotos. O site já reduz e converte a imagem sozinho. Depois clique em <strong>🚀 Publicar</strong>.</div>
                    ${[0, 1, 2].map(i => `
                        <div style="border:1px solid #E5E7EB;border-radius:10px;padding:8px;margin-bottom:10px;">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;"><strong style="font-size:12px;color:#374151;">Foto ${i + 1}</strong>${cur[i] ? `<button type="button" class="ld-ko" data-hero-del="${i}" style="padding:3px 9px;font-size:11px;color:#DC2626;">✕ Remover</button>` : ''}</div>
                            ${shown[i] && (cur[i] || !cur.length) ? `<img src="${escapeHTML(shown[i])}" class="ld-prev" style="height:96px;margin-bottom:6px;" alt="">` : '<div class="ld-prev" style="height:60px;display:flex;align-items:center;justify-content:center;color:#9CA3AF;font-size:12px;margin-bottom:6px;">Vazio (repete as outras)</div>'}
                            <button type="button" class="ld-ko" data-hero-pick="${i}" style="width:100%;">${cur[i] ? 'Trocar esta foto' : 'Escolher foto do computador'}</button>
                        </div>`).join('')}
                    <input type="file" id="hero-file" accept="image/*" style="display:none">
                    ${cur.length ? '<button type="button" class="ld-danger" id="hero-reset">Voltar às fotos originais</button>' : ''}
                    <div class="ld-acts"><button class="ld-ko" id="ldc" style="flex:1;">Fechar</button></div>`;
                p.appendChild(pb);
                pb.querySelector('#ldc').onclick = () => this.closePanel();
                const save = (list) => {
                    this.cms._heroSlides = list;
                    saveDraft(this.cms);
                    this.markDirty();
                    applyHero(this.cms);
                    render();
                };
                let slot = 0;
                const fileIn = pb.querySelector('#hero-file');
                pb.querySelectorAll('[data-hero-pick]').forEach(b => b.onclick = () => { slot = +b.dataset.heroPick; fileIn.click(); });
                fileIn.onchange = async () => {
                    const f = fileIn.files[0];
                    if (!f) return;
                    const btn = pb.querySelector(`[data-hero-pick="${slot}"]`);
                    btn.disabled = true; btn.textContent = 'Enviando…';
                    try {
                        const url = await uploadImageFile(f, { maxW: 1920, maxH: 1280, quality: 0.8 });
                        const list = (Array.isArray(this.cms._heroSlides) ? this.cms._heroSlides : []).filter(isValidImageSrc).slice(0, 3);
                        if (slot < list.length) list[slot] = url; else list.push(url);
                        save(list);
                        this.toast('✓ Foto do topo trocada! Clique em Publicar para ir ao ar.', 'ok');
                    } catch (e) {
                        btn.disabled = false; btn.textContent = 'Tentar de novo';
                        this.toast('❌ ' + (e.message || 'Erro no envio'), 'err');
                    }
                };
                pb.querySelectorAll('[data-hero-del]').forEach(b => b.onclick = () => {
                    const list = (this.cms._heroSlides || []).filter(isValidImageSrc);
                    list.splice(+b.dataset.heroDel, 1);
                    save(list);
                });
                pb.querySelector('#hero-reset')?.addEventListener('click', () => {
                    if (confirm('Voltar às fotos originais do topo?')) save([]);
                });
            };
            render();
        },

        pManageBanners() {
            const p = this.panel_('🖼️ Banners');
            if (window.innerWidth > 768) p.style.width = '380px';
            if (!Array.isArray(this.cms._banners)) this.cms._banners = [];

            const waNumber = () => {
                const n = String(this.cms.whatsapp || '').replace(/\D/g, '');
                if (n) return n;
                const a = document.querySelector('a[href*="wa.me/"]');
                const m = a && a.getAttribute('href').match(/wa\.me\/(\d+)/);
                return m ? m[1] : '';
            };
            const linkOptions = () => {
                const opts = [
                    ['#contato', 'Formulário de pedir cotação'],
                    ['wa', 'Conversar no WhatsApp'],
                    ['#destinos', 'Lista de destinos'],
                ];
                document.querySelectorAll('#destinos .card-link').forEach(a => {
                    const href = a.getAttribute('href') || '';
                    const name = ((a.querySelector('h3') || {}).textContent || '').trim();
                    if (href && name) opts.push([href, 'Pacote: ' + name]);
                });
                opts.push(['', 'Não levar para lugar nenhum'], ['outro', 'Outro link (colar endereço)']);
                return opts;
            };
            const linkToChoice = (link) => {
                if (!link) return '';
                if (/wa\.me\//.test(link)) return 'wa';
                return linkOptions().some(o => o[0] === link) ? link : 'outro';
            };
            const btnStyle = 'padding:6px 9px;font-size:12px;';

            const renderPanel = (editIndex = -1) => {
                const list = this.cms._banners;
                const editing = editIndex >= 0 && list[editIndex] ? list[editIndex] : null;
                const secs = Math.min(60, Math.max(3, parseInt(this.cms._bannerInterval, 10) || 7));
                const secOpts = [...new Set([5, 7, 8, 10, 12, 15, secs])].sort((a, b) => a - b);
                const choice = linkToChoice(editing ? (editing.link || '') : '#contato');
                p.querySelector('.ld-pb')?.remove();
                const pb = document.createElement('div');
                pb.className = 'ld-pb';

                const listHTML = `
                    <div id="bn-list" style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px;">
                        ${list.length ? list.map((b, i) => `
                            <div style="padding:8px;border:1.5px solid ${i === editIndex ? '#2563EB' : '#E5E7EB'};border-radius:10px;background:${b.active === false ? '#F9FAFB' : '#fff'};">
                                <div style="display:flex;align-items:center;gap:10px;margin-bottom:7px;">
                                    <img src="${escapeHTML(b.img)}" alt="" style="width:96px;height:40px;object-fit:cover;border-radius:6px;flex-shrink:0;${b.active === false ? 'opacity:.45;' : ''}">
                                    <div style="flex:1;min-width:0;">
                                        <div style="font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHTML(b.title || ('Banner ' + (i + 1)))}</div>
                                        <div style="font-size:11px;font-weight:600;color:${b.active === false ? '#9CA3AF' : '#16A34A'};">${b.active === false ? 'Escondido' : 'Aparecendo no site'}</div>
                                    </div>
                                </div>
                                <div style="display:flex;gap:5px;flex-wrap:wrap;">
                                    <button type="button" class="ld-ko" data-bn-ed="${i}" style="${btnStyle}flex:1;font-weight:700;">✏️ Editar</button>
                                    <button type="button" class="ld-ko" data-bn-hide="${i}" style="${btnStyle}">${b.active === false ? '👁 Mostrar' : '🙈 Esconder'}</button>
                                    <button type="button" class="ld-ko" data-bn-up="${i}" title="Passar antes" style="${btnStyle}" ${i === 0 ? 'disabled' : ''}>↑</button>
                                    <button type="button" class="ld-ko" data-bn-dn="${i}" title="Passar depois" style="${btnStyle}" ${i === list.length - 1 ? 'disabled' : ''}>↓</button>
                                    <button type="button" class="ld-ko" data-bn-del="${i}" title="Apagar" style="${btnStyle}color:#DC2626;">🗑</button>
                                </div>
                            </div>`).join('') : '<div style="font-size:13px;color:#6B7280;padding:6px 0;">Nenhum banner ainda. Adicione o primeiro abaixo.</div>'}
                    </div>`;

                const formHTML = `
                    <div id="bn-form" style="border:1.5px solid ${editing ? '#2563EB' : '#E5E7EB'};border-radius:12px;padding:12px;background:${editing ? '#EFF6FF' : '#F9FAFB'};margin-bottom:12px;">
                        <p style="font-size:14px;font-weight:800;color:#111827;margin:0 0 10px;">${editing ? '✏️ Editando: ' + escapeHTML(editing.title || ('Banner ' + (editIndex + 1))) : '➕ Novo banner'}</p>
                        <div class="ld-f"><label>Foto do banner</label>
                            <div id="bn-prev-box" style="border-radius:8px;overflow:hidden;background:#E5E7EB;margin-bottom:6px;min-height:60px;display:flex;align-items:center;justify-content:center;color:#6B7280;font-size:12px;">
                                ${editing && isValidImageSrc(editing.img) ? `<img id="bn-prev" src="${escapeHTML(editing.img)}" alt="" style="width:100%;display:block;">` : '<span>Nenhuma foto escolhida</span>'}
                            </div>
                            <button type="button" class="ld-ok" id="bn-file-btn" style="width:100%;">${editing ? '📷 Trocar foto' : '📷 Escolher foto do computador'}</button>
                            <input type="file" id="bn-file" accept="image/*" style="display:none">
                            <p class="ld-hint">Tamanho ideal: foto deitada e bem larga, <strong>1920 × 640</strong>. Pode ser JPG, PNG ou WEBP.</p>
                        </div>
                        <div class="ld-f"><label>Nome do banner <span style="font-weight:400;color:#6B7280;">(só para você se organizar)</span></label><input type="text" id="bn-title" value="${escapeHTML(editing?.title || '')}" placeholder="Ex: Black Friday"></div>
                        <div class="ld-f"><label>Quando o cliente clicar, levar para:</label>
                            <select id="bn-link-sel">${linkOptions().map(([v, t]) => `<option value="${escapeHTML(v)}" ${v === choice ? 'selected' : ''}>${escapeHTML(t)}</option>`).join('')}</select>
                            <input type="text" id="bn-link-other" value="${choice === 'outro' ? escapeHTML(editing?.link || '') : ''}" placeholder="Cole o endereço, ex: https://..." style="margin-top:6px;${choice === 'outro' ? '' : 'display:none;'}">
                        </div>
                        <label style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;margin:4px 0 10px;cursor:pointer;">
                            <input type="checkbox" id="bn-active" ${editing?.active !== false ? 'checked' : ''} style="width:18px;height:18px;"> Mostrar no site
                        </label>
                        <details style="margin-bottom:10px;font-size:12px;color:#6B7280;">
                            <summary style="cursor:pointer;">Mais opções (não precisa mexer)</summary>
                            <div class="ld-f" style="margin-top:8px;"><label>Endereço da foto</label><input type="url" id="bn-img" value="${escapeHTML(editing?.img || '')}" placeholder="https://.../banner.webp"></div>
                            <div class="ld-f"><label>Foto diferente para celular</label>
                                <button type="button" class="ld-ko" id="bn-mfile-btn" style="width:100%;margin-bottom:6px;">Escolher foto do celular</button>
                                <input type="file" id="bn-mfile" accept="image/*" style="display:none">
                                <input type="url" id="bn-mimg" value="${escapeHTML(editing?.imgMobile || '')}" placeholder="Vazio = o site cria sozinho">
                                <p class="ld-hint">Se você não escolher, o site usa a mesma foto, menor.</p>
                            </div>
                        </details>
                        <div class="ld-acts">
                            <button class="ld-ok" id="bn-save">${editing ? '✓ Salvar alterações' : '+ Adicionar banner'}</button>
                            ${editing ? '<button class="ld-ko" id="bn-cancel-ed">Cancelar</button>' : ''}
                        </div>
                    </div>`;

                pb.innerHTML = `
                    <div class="ld-info">Os banners aparecem logo abaixo da foto do topo e passam sozinhos. Depois de mudar, clique em <strong>🚀 Publicar</strong> para ir ao ar.</div>
                    ${editing ? formHTML + listHTML : listHTML + formHTML}
                    <div class="ld-f" style="display:flex;align-items:center;gap:8px;">
                        <label for="bn-secs" style="margin:0;flex:1;">Cada banner fica na tela por</label>
                        <select id="bn-secs" style="width:auto;">${secOpts.map(v => `<option value="${v}" ${v === secs ? 'selected' : ''}>${v} segundos</option>`).join('')}</select>
                    </div>
                    ${editing ? '' : '<div class="ld-acts"><button class="ld-ko" id="ldc" style="flex:1;">Fechar</button></div>'}
                `;
                p.appendChild(pb);
                pb.scrollTop = 0;
                p.scrollTop = 0;

                const $ = sel => pb.querySelector(sel);
                $('#ldc')?.addEventListener('click', () => this.closePanel());
                $('#bn-cancel-ed')?.addEventListener('click', () => renderPanel(-1));

                let previewUrl = null;
                $('#bn-file-btn').onclick = () => $('#bn-file').click();
                $('#bn-file').onchange = () => {
                    const f = $('#bn-file').files[0];
                    if (!f) return;
                    if (previewUrl) URL.revokeObjectURL(previewUrl);
                    previewUrl = URL.createObjectURL(f);
                    $('#bn-prev-box').innerHTML = `<img id="bn-prev" src="${previewUrl}" alt="" style="width:100%;display:block;">`;
                    $('#bn-file-btn').textContent = '📷 Trocar foto';
                    if (!$('#bn-title').value.trim()) $('#bn-title').value = f.name.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ');
                };
                $('#bn-mfile-btn').onclick = () => $('#bn-mfile').click();
                $('#bn-mfile').onchange = () => {
                    const f = $('#bn-mfile').files[0];
                    if (f) $('#bn-mfile-btn').textContent = 'Escolhida: ' + f.name;
                };
                $('#bn-link-sel').onchange = () => {
                    const other = $('#bn-link-sel').value === 'outro';
                    $('#bn-link-other').style.display = other ? '' : 'none';
                    if (other) $('#bn-link-other').focus();
                };
                $('#bn-secs').onchange = () => {
                    this.cms._bannerInterval = parseInt($('#bn-secs').value, 10) || 7;
                    saveDraft(this.cms);
                    this.markDirty();
                    applyBanners(this.cms);
                    this.toast('✓ Tempo salvo. Clique em Publicar para ir ao ar.', 'ok');
                };

                const saveAndRefresh = (nextEdit) => {
                    saveDraft(this.cms);
                    this.markDirty();
                    applyBanners(this.cms);
                    renderPanel(nextEdit);
                };

                pb.querySelectorAll('[data-bn-up]').forEach(btn => btn.onclick = () => {
                    const i = +btn.dataset.bnUp;
                    if (i > 0) { [list[i-1], list[i]] = [list[i], list[i-1]]; saveAndRefresh(-1); }
                });
                pb.querySelectorAll('[data-bn-dn]').forEach(btn => btn.onclick = () => {
                    const i = +btn.dataset.bnDn;
                    if (i < list.length - 1) { [list[i+1], list[i]] = [list[i], list[i+1]]; saveAndRefresh(-1); }
                });
                pb.querySelectorAll('[data-bn-hide]').forEach(btn => btn.onclick = () => {
                    const b = list[+btn.dataset.bnHide];
                    b.active = b.active === false;
                    saveAndRefresh(-1);
                    this.toast(b.active ? '✓ Banner vai aparecer no site' : '✓ Banner escondido', 'ok');
                });
                pb.querySelectorAll('[data-bn-ed]').forEach(btn => btn.onclick = () => renderPanel(+btn.dataset.bnEd));
                pb.querySelectorAll('[data-bn-del]').forEach(btn => btn.onclick = () => {
                    const i = +btn.dataset.bnDel;
                    if (confirm('Apagar o banner "' + (list[i].title || ('Banner ' + (i + 1))) + '"?')) { list.splice(i, 1); saveAndRefresh(-1); }
                });

                $('#bn-save').onclick = async () => {
                    const saveBtn = $('#bn-save');
                    const label = saveBtn.textContent;
                    const file  = $('#bn-file').files[0];
                    const mfile = $('#bn-mfile').files[0];
                    let img = $('#bn-img').value.trim();
                    let imgMobile = $('#bn-mimg').value.trim();
                    const sel = $('#bn-link-sel').value;
                    let link = sel === 'outro' ? $('#bn-link-other').value.trim() : sel;
                    if (sel === 'wa') {
                        const n = waNumber();
                        link = n ? 'https://wa.me/' + n : '#contato';
                    }
                    if (sel === 'outro' && link && !/^(https?:\/\/|#)/i.test(link)) link = 'https://' + link;
                    if (!file && !isValidImageSrc(img)) {
                        this.toast('Escolha a foto do banner', 'err');
                        return;
                    }
                    saveBtn.disabled = true;
                    try {
                        if (file) {
                            saveBtn.textContent = 'Enviando foto...';
                            img = await uploadImageFile(file, { maxW: 1920 });
                        }
                        if (mfile) {
                            saveBtn.textContent = 'Enviando foto do celular...';
                            imgMobile = await uploadImageFile(mfile, { maxW: 900, quality: 0.8 });
                        } else if (file && (!editing || imgMobile === (editing.imgMobile || ''))) {
                            saveBtn.textContent = 'Preparando versão do celular...';
                            imgMobile = await uploadImageFile(file, { maxW: 900, quality: 0.8 }).catch(() => '');
                        }
                    } catch (err) {
                        saveBtn.disabled = false;
                        saveBtn.textContent = label;
                        this.toast('❌ ' + (err.message || 'Erro ao enviar a foto'), 'err');
                        return;
                    }
                    if (imgMobile && !isValidImageSrc(imgMobile)) imgMobile = '';
                    const item = { id: editing?.id || ('bn-' + Date.now()), title: $('#bn-title').value.trim(), img, imgMobile, link, active: $('#bn-active').checked };
                    if (editing) list[editIndex] = item;
                    else list.push(item);
                    saveAndRefresh(-1);
                    this.toast('✓ Banner salvo! Clique em 🚀 Publicar para ir ao ar.', 'ok');
                };
            };
            renderPanel(-1);
        },

        /* ── GERENCIAR LINKS DE COMPRA ONLINE (INFOTRAVEL/BRT) ── */
        pManageBuyLinks() {
            const p = this.panel_('🛒 Links de Compra Online');
            if (!this.cms._packageBuyUrls || typeof this.cms._packageBuyUrls !== 'object') {
                this.cms._packageBuyUrls = {};
            }
            const basePackages = [
                { id: 'lencois', title: 'Lençóis Maranhenses' },
                { id: 'disney', title: 'Disney & Orlando' },
                { id: 'maceio', title: 'Maceió & Maragogi' },
                { id: 'portogalinhas', title: 'Porto de Galinhas' },
                { id: 'riodejaneiro', title: 'Rio de Janeiro' },
                { id: 'joaopessoa', title: 'João Pessoa' }
            ];
            const removed = Array.isArray(this.cms._removedPackages) ? this.cms._removedPackages : [];
            const dynPkgs = Object.entries(this.cms._packages || {})
                .filter(([id]) => !removed.includes(id))
                .map(([id, pkg]) => ({ id, title: pkg.title || id }));
            const allPkgs = [...basePackages];
            dynPkgs.forEach(dp => {
                if (!allPkgs.some(bp => bp.id === dp.id)) allPkgs.push(dp);
            });

            const curPageId = new URLSearchParams(location.search).get('id');
            const initialId = (curPageId && allPkgs.some(x => x.id === curPageId)) ? curPageId : (allPkgs[0]?.id || 'aracaju');
            const getUrl = (pkgId) => this.cms._packageBuyUrls[pkgId] || (this.cms._packages?.[pkgId]?.buyUrl) || '';

            p.innerHTML += `<div class="ld-pb">
                <div class="ld-info">Cole o link de checkout da <strong>InfoTravel / BRT</strong> para ativar o botão <strong>Comprar Online Agora</strong> no pacote. Deixe vazio para mostrar apenas o WhatsApp.</div>
                <div class="ld-f"><label>Pacote</label>
                    <select id="bl-pkg">
                        ${allPkgs.map(x => `<option value="${escapeHTML(x.id)}" ${x.id === initialId ? 'selected' : ''}>${escapeHTML(x.title)} ${getUrl(x.id) ? '🛒' : ''}</option>`).join('')}
                    </select>
                </div>
                <div class="ld-f"><label>Link de Compra Online (URL)</label>
                    <input type="url" id="bl-url" value="${escapeHTML(getUrl(initialId))}" placeholder="https://brt.infotravel.com.br/b2c/...">
                </div>
                <div class="ld-acts">
                    <button class="ld-ok" id="bl-save">✓ Salvar Link</button>
                    <button class="ld-ko" id="bl-clear">Remover Link</button>
                    <button class="ld-ko" id="ldc">Fechar</button>
                </div>
            </div>`;

            const sel = p.querySelector('#bl-pkg');
            const inp = p.querySelector('#bl-url');
            sel.onchange = () => { inp.value = getUrl(sel.value); };
            p.querySelector('#ldc').onclick = () => this.closePanel();

            const saveUrl = (val) => {
                const pkgId = sel.value;
                if (val) {
                    this.cms._packageBuyUrls[pkgId] = val;
                    if (this.cms._packages?.[pkgId]) this.cms._packages[pkgId].buyUrl = val;
                } else {
                    delete this.cms._packageBuyUrls[pkgId];
                    if (this.cms._packages?.[pkgId]) delete this.cms._packages[pkgId].buyUrl;
                }
                saveDraft(this.cms);
                this.markDirty();
                const buyBtn = document.getElementById('btn-buy-online');
                if (buyBtn && curPageId === pkgId) {
                    if (val) { buyBtn.href = val; buyBtn.style.display = 'inline-flex'; }
                    else { buyBtn.style.display = 'none'; }
                }
                const opt = sel.options[sel.selectedIndex];
                if (opt) opt.textContent = opt.textContent.replace(/ 🛒$/, '') + (val ? ' 🛒' : '');
                this.toast(val ? '✓ Link de compra salvo! Clique em Publicar.' : 'Link removido! Clique em Publicar.', 'ok');
            };

            p.querySelector('#bl-save').onclick = () => {
                const val = inp.value.trim();
                if (val && !/^https?:\/\//i.test(val)) {
                    this.toast('Cole uma URL válida começando com https://', 'err');
                    return;
                }
                saveUrl(val);
            };
            p.querySelector('#bl-clear').onclick = () => { inp.value = ''; saveUrl(''); };
        },

        /* ── GERENCIAR DEPOIMENTOS ── */
        pManageDep() {
            const grid = document.getElementById('dep-grid');
            if (!grid) { this.toast('Os depoimentos ficam na página inicial', 'err'); return; }
            const count = [...grid.querySelectorAll('.dep-card')].filter(c => c.style.display !== 'none').length;
            const p = this.panel_('⭐ Depoimentos');
            p.innerHTML += `<div class="ld-pb">
                <div class="ld-info">Você tem <strong>${count} depoimento(s)</strong> no site. Para mudar um texto, clique nele no site. Para apagar, use o <strong>✕</strong> vermelho no canto do depoimento.</div>
                <p style="font-size:14px;font-weight:800;color:#111827;margin:12px 0 10px;">➕ Novo depoimento</p>
                <div class="ld-f"><label>Nome do cliente</label><input type="text" id="dep-nome" placeholder="Ex: Maria Souza"></div>
                <div class="ld-f"><label>Quando / onde (opcional)</label><input type="text" id="dep-dest" placeholder="Ex: há 1 mês"></div>
                <div class="ld-f"><label>O que o cliente disse</label><textarea id="dep-texto" rows="4" placeholder="Cole aqui a avaliação do cliente"></textarea></div>
                <div class="ld-acts">
                    <button class="ld-ok" id="lda">+ Adicionar</button>
                    <button class="ld-ko" id="ldc">Fechar</button>
                </div>
            </div>`;
            p.querySelector('#ldc').onclick = () => this.closePanel();
            p.querySelector('#lda').onclick = () => {
                const nome  = p.querySelector('#dep-nome').value.trim();
                const dest  = p.querySelector('#dep-dest').value.trim();
                const texto = p.querySelector('#dep-texto').value.trim();
                if (!nome || !texto) { this.toast('Preencha o nome e o que o cliente disse', 'err'); return; }
                if (!Array.isArray(this.cms._extraDeps)) this.cms._extraDeps = [];
                this.cms._extraDeps.push({ id: 'x' + Date.now(), nome, dest, texto });
                saveDraft(this.cms);
                this.markDirty();
                applyDeps(this.cms);
                this.bindDepRemoveButtons();
                this.closePanel();
                const last = grid.lastElementChild;
                if (last) last.scrollIntoView({ behavior: 'smooth', block: 'center' });
                this.toast('✓ Depoimento adicionado! Clique em Publicar para ir ao ar.', 'ok');
            };
        },

        bindDepRemoveButtons() {
            document.querySelectorAll('#dep-grid .dep-card').forEach(card => {
                if (card.querySelector('.ld-remove-card')) return;
                const btn = document.createElement('button');
                btn.className = 'ld-remove-card';
                btn.title = 'Apagar depoimento';
                btn.innerHTML = '✕';
                card.appendChild(btn);
                btn.addEventListener('click', e => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!confirm('Apagar este depoimento do site?')) return;
                    const id = String(card.dataset.depId || '');
                    if (card.dataset.depExtra) {
                        this.cms._extraDeps = (this.cms._extraDeps || []).filter(d => String(d.id) !== id);
                    } else {
                        if (!Array.isArray(this.cms._hiddenDeps)) this.cms._hiddenDeps = [];
                        if (!this.cms._hiddenDeps.map(String).includes(id)) this.cms._hiddenDeps.push(id);
                    }
                    saveDraft(this.cms);
                    this.markDirty();
                    applyDeps(this.cms);
                    this.bindDepRemoveButtons();
                    this.toast('✓ Depoimento apagado. Clique em Publicar para ir ao ar.', 'ok');
                });
            });
        },

        /* ── REVERTER ── */
        revert() {
            const hasDraft = hasDraft();
            if (!hasDraft) { this.toast('Não há rascunho para descartar', ''); return; }
            if (!confirm('Descartar todas as alterações não publicadas? O site voltará ao conteúdo que está publicado.')) return;
            localStorage.removeItem(CMS_KEY);
            document.querySelectorAll('.ld-dirty-dot').forEach(d => d.remove());
            this.toast('Rascunho descartado. Recarregando…', '');
            setTimeout(() => location.reload(), 900);
        },

        /* ── PUBLICAR ── */
        async publishNow(secret) {
            const diff = draftDiff(this.cms, window.__LOVISA_SRV_CMS || {});
            const latest = await fetchContent();
            this.cms = cleanContent(applyDiff(latest && Object.keys(latest).length ? latest : (window.__LOVISA_SRV_CMS || {}), diff));
            if (!secret) throw new Error('Sessao sem senha. Saia e entre novamente no editor.');
            const res = await fetch('/api/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: this.cms, secret })
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error || 'Erro desconhecido');
            window.__LOVISA_SRV_CMS = JSON.parse(JSON.stringify(this.cms));
            localStorage.removeItem(CMS_KEY);
            return data;
        },

        async publish() {
            // Resumo do que será publicado
            const changed = draftDiff(this.cms, window.__LOVISA_SRV_CMS || {});
            const elems   = Object.keys(changed).filter(k => k !== 'colors' && k !== 'whatsapp');
            const hasCols = 'colors' in changed;
            const hasWA   = 'whatsapp' in changed;
            const total   = elems.length + (hasCols ? 1 : 0) + (hasWA ? 1 : 0);

            if (total === 0) {
                this.toast('Nenhuma alteração para publicar', '');
                return;
            }

            let items = '';
            const names = { _banners: 'Banners', _bannerInterval: 'Tempo dos banners', _heroSlides: 'Fotos do topo', _packages: 'Pacotes', _removedPackages: 'Pacotes removidos', _packageBuyUrls: 'Links de compra', _extraDeps: 'Depoimentos', _hiddenDeps: 'Depoimentos' };
            const special = [...new Set(elems.filter(k => names[k]).map(k => names[k]))];
            const others = elems.filter(k => !names[k]).length;
            special.forEach(t => { items += `<li>${t}</li>`; });
            if (others) items += `<li>${others === 1 ? '1 texto ou foto alterado' : others + ' textos ou fotos alterados'}</li>`;
            if (hasCols) items += `<li>Cores globais do site</li>`;
            if (hasWA)   items += `<li>Número do WhatsApp: ${this.cms.whatsapp}</li>`;

            const hasSavedSecret = !!sessionStorage.getItem('lovisa_secret');
            const p = this.panel_('🚀 Publicar no Site');
            p.innerHTML += `<div class="ld-pb">
                <div class="ld-info" style="background:#EFF6FF;border:1px solid #BFDBFE;color:#1E40AF;border-radius:10px;padding:14px;margin-bottom:14px;line-height:1.8;">
                    <strong>O que será publicado:</strong><ul style="margin:8px 0 0 16px;">${items}</ul>
                </div>
                ${!hasSavedSecret ? `<div class="ld-f"><label>🔑 Senha de acesso</label>
                    <input type="password" id="ldpwd" placeholder="Digite sua senha" style="width:100%;padding:8px 11px;border:1.5px solid #E5E7EB;border-radius:8px;font-size:13px;outline:none;">
                </div>` : ''}
                <p class="ld-hint">Estas mudanças ficarão visíveis para todos os visitantes imediatamente.</p>
                <div class="ld-acts" style="margin-top:14px;">
                    <button class="ld-ok" id="lda">✓ Confirmar e publicar</button>
                    <button class="ld-ko" id="ldc">Cancelar</button>
                </div>
            </div>`;

            p.querySelector('#ldc').onclick = () => this.closePanel();
            p.querySelector('#lda').onclick = async () => {
                const pwdEl = p.querySelector('#ldpwd');
                let secret = sessionStorage.getItem('lovisa_secret') || '';
                if (pwdEl) {
                    if (!pwdEl.value) { pwdEl.focus(); pwdEl.style.borderColor='#DC2626'; return; }
                    secret = pwdEl.value;
                    sessionStorage.setItem('lovisa_secret', secret);
                }
                p.querySelector('.ld-pb').innerHTML = `<div class="ld-loading"><span class="ld-spin">⏳</span>Publicando alterações…</div>`;
                try {
                    const data = await this.publishNow(secret);
                    if (data.success) {
                        localStorage.removeItem(CMS_KEY);
                        const now = new Date().toLocaleString('pt-BR', {day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
                        localStorage.setItem('lovisa_last_pub', now);
                        document.querySelectorAll('.ld-dirty-dot').forEach(d => d.remove());
                        const lp = document.querySelector('.ld-last-pub');
                        if (lp) { lp.textContent = 'Publicado: ' + now; }
                        else {
                            const sep = document.createElement('div'); sep.className = 'ld-sep';
                            const span = document.createElement('span'); span.className = 'ld-last-pub'; span.textContent = 'Publicado: ' + now;
                            const btn2 = document.getElementById('ld-colors');
                            if (btn2) { btn2.before(span); btn2.before(sep); }
                        }
                        applyContent(this.cms);
                        p.querySelector('.ld-pb').innerHTML = `
                            <div class="ld-pub-box">✅ <strong>Publicado com sucesso!</strong><br>
                            Visitantes verão as mudanças em alguns segundos.</div>
                            <button class="ld-ok" style="width:100%;margin-top:12px" onclick="this.closest('.ld-panel').remove()">✓ OK</button>`;
                        this.toast('✅ Publicado!', 'ok');
                    } else {
                        throw new Error(data.error || 'Erro desconhecido');
                    }
                } catch (err) {
                    p.querySelector('.ld-pb').innerHTML = `
                        <div class="ld-pub-err">❌ <strong>Erro:</strong> ${err.message}</div>
                        <button class="ld-ko" style="width:100%;margin-top:12px" onclick="this.closest('.ld-panel').remove()">Fechar</button>`;
                    this.toast('❌ Erro ao publicar', 'err');
                }
            };
        },

        /* ── SAIR ── */
        exit() {
            const hasDraft = hasDraft();
            if (hasDraft && !confirm('Sair do editor? Você tem alterações não publicadas (rascunho salvo).')) return;
            sessionStorage.removeItem('editor_active');
            const u = new URL(location.href);
            u.searchParams.delete('editor');
            location.replace(u.toString());
        },

        /* ── HELPERS ── */
        panel_(title) {
            this.closePanel();
            const p = document.createElement('div');
            p.className = 'ld-panel';
            p.innerHTML = `<div class="ld-ph"><h3>${title}</h3><button class="ld-px" title="Fechar">✕</button></div>`;
            document.body.appendChild(p);
            p.querySelector('.ld-px').onclick = () => this.closePanel();
            this.drag_(p);
            this.panel = p;
            return p;
        },

        closePanel() {
            document.querySelectorAll('.ld-panel').forEach(x => x.remove());
            document.querySelectorAll('.ld-sel').forEach(x => x.classList.remove('ld-sel'));
            this.panel = null;
        },

        drag_(el) {
            if (window.matchMedia('(max-width:600px)').matches) return; // sem drag em mobile
            const h = el.querySelector('.ld-ph');
            let d=false, sx=0, sy=0, ox=0, oy=0;
            h.onmousedown = e => { d=true; sx=e.clientX; sy=e.clientY; ox=el.offsetLeft; oy=el.offsetTop; e.preventDefault(); };
            document.addEventListener('mousemove', e => { if(!d) return; el.style.left=ox+e.clientX-sx+'px'; el.style.top=oy+e.clientY-sy+'px'; });
            document.addEventListener('mouseup', () => d=false);
        },

        store(key, val) {
            this.cms[key] = val;
            saveDraft(this.cms);
            this.markDirty();
        },

        removeElement(el) {
            const eid = el && el.dataset ? el.dataset.eid : '';
            const label = (el && el.dataset && (el.dataset.elabel || el.dataset.eid)) || 'este item';
            if (!eid) {
                this.toast('Este item nao tem ID editavel para remover.', 'err');
                return;
            }
            if (!confirm(`Remover "${label}" do site?\n\nEle ficara oculto para os visitantes depois de publicar.`)) return;
            document.querySelectorAll(`[data-eid="${CSS.escape(eid)}"]`).forEach(item => {
                item.style.display = 'none';
                item.dataset.ldHidden = '1';
            });
            this.cms[eid] = { ...(this.cms[eid] || {}), hidden: true };
            saveDraft(this.cms);
            this.markDirty();
            this.closePanel();
            this.toast('Item removido no rascunho. Clique em Publicar para salvar no site.', 'ok');
        },

        markDirty() {
            const btn = document.getElementById('ld-pub');
            if (btn && !btn.querySelector('.ld-dirty-dot')) {
                const dot = document.createElement('span');
                dot.className = 'ld-dirty-dot';
                btn.prepend(dot);
            }
        },

        toast(msg, type='') {
            document.querySelectorAll('.ld-toast').forEach(t => t.remove());
            const t = document.createElement('div');
            t.className = 'ld-toast' + (type?' '+type:'');
            t.textContent = msg;
            document.body.appendChild(t);
            requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
            setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 320); }, 3000);
        },

        hex(rgb) {
            if (!rgb || rgb === 'transparent' || rgb.includes('rgba(0, 0, 0, 0)')) return '#ffffff';
            if (rgb.startsWith('#')) return rgb;
            const m = rgb.match(/\d+/g);
            if (!m || m.length < 3) return '#ffffff';
            return '#' + m.slice(0,3).map(n => (+n).toString(16).padStart(2,'0')).join('');
        }
    };

    /* ─── BOOT ──────────────────────────────────────────────── */
    window.__LOVISA_APPLY_CONTENT = applyContent;

    document.addEventListener('DOMContentLoaded', async () => {
        const srv = await fetchContent();   // 1 único fetch para toda a sessão
        await loadAndApply(srv);
        if (editMode) {
            await ED.start(srv);            // reutiliza dados já carregados
            setTimeout(() => ED.bindAll(), 500);
        }
    });

    document.addEventListener('lovisa:package-rendered', () => {
        if (window.__LOVISA_SRV_CMS) applyContent(window.__LOVISA_SRV_CMS);
        if (editMode) ED.bindAll();
    });

    window._LD = ED;
    // Expor funções globais para onclick HTML
    window.addDepoimento = () => ED.pManageDep();
})();
