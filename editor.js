/**
 * LOVISA DESTINOS — EDITOR VISUAL v2
 * - Edição inline de textos, imagens, cores, botões e links
 * - "Publicar" commita content.json no GitHub via API serverless
 * - Vercel detecta o commit e faz deploy automático (~30s)
 * - Visitantes veem o content.json do servidor aplicado na página
 */
(function () {
    'use strict';

    const CMS_KEY    = 'lovisa_cms_v2';
    const AUTH_KEY   = 'lovisa_auth';
    const API_PUBLISH = '/api/publish';

    /* ─── AUTENTICAÇÃO ─────────────────────────────────────── */
    const auth    = JSON.parse(sessionStorage.getItem(AUTH_KEY) || 'null');
    const isAdmin = auth && auth.expires > Date.now();
    const params  = new URLSearchParams(location.search);
    const editMode = isAdmin && (params.get('editor') === '1' || sessionStorage.getItem('editor_active') === '1');

    /* ─── CARREGAR CONTEÚDO (TODOS OS VISITANTES) ───────────── */
    // Busca content.json direto do GitHub raw (sempre a versão mais recente, sem cache)
    const CONTENT_URL = 'https://raw.githubusercontent.com/lucasferraripro/lovisa-destinos-site/master/content.json';
    async function loadAndApply() {
        let serverContent = {};
        try {
            const r = await fetch(CONTENT_URL + '?_=' + Date.now());
            if (r.ok) serverContent = await r.json();
        } catch (_) {}

        // Admin em edição usa localStorage (rascunho em tempo real)
        const localContent = editMode
            ? JSON.parse(localStorage.getItem(CMS_KEY) || '{}')
            : {};

        const cms = Object.keys(localContent).length ? localContent : serverContent;
        applyContent(cms);
        return cms;
    }

    function applyContent(cms) {
        if (!cms || !Object.keys(cms).length) return;

        // Cores globais
        if (cms.colors) {
            Object.entries(cms.colors).forEach(([k, v]) => {
                document.documentElement.style.setProperty(k, v);
            });
        }

        // Elementos com data-eid
        document.querySelectorAll('[data-eid]').forEach(el => {
            const d = cms[el.dataset.eid];
            if (!d) return;
            if (d.html  != null) el.innerHTML = d.html;
            if (d.src   != null && el.tagName === 'IMG') el.src = d.src;
            if (d.href  != null) el.setAttribute('href', d.href);
            if (d.target!= null) el.setAttribute('target', d.target);
            if (d.style)  Object.assign(el.style, d.style);
        });
    }

    /* ─── CSS DO EDITOR ─────────────────────────────────────── */
    function injectCSS() {
        if (document.getElementById('ld-css')) return;
        const s = document.createElement('style');
        s.id = 'ld-css';
        s.textContent = `
        #ld-bar{position:fixed;top:0;left:0;right:0;z-index:99999;height:52px;background:#111827;display:flex;align-items:center;gap:4px;padding:0 12px;box-shadow:0 2px 16px rgba(0,0,0,.5);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;}
        #ld-bar *{box-sizing:border-box;}
        .ld-brand{color:#fff;font-weight:700;display:flex;align-items:center;gap:7px;padding-right:14px;border-right:1px solid rgba(255,255,255,.12);white-space:nowrap;margin-right:6px;}
        .ld-dot{width:8px;height:8px;border-radius:50%;background:#22C55E;animation:ldpulse 1.5s infinite;}
        @keyframes ldpulse{0%,100%{opacity:1}50%{opacity:.3}}
        .ld-btn{padding:6px 13px;border:none;border-radius:8px;background:transparent;color:rgba(255,255,255,.7);cursor:pointer;font-size:12.5px;font-weight:500;display:flex;align-items:center;gap:5px;transition:all .15s;white-space:nowrap;outline:none;}
        .ld-btn:hover{background:rgba(255,255,255,.1);color:#fff;}
        .ld-btn.on{background:#F97316;color:#fff;}
        .ld-btn.blue{background:#1565C0;color:#fff;}
        .ld-btn.blue:hover{background:#0D47A1;}
        .ld-btn.green{background:#16A34A;color:#fff;}
        .ld-btn.green:hover{background:#15803D;}
        .ld-btn.red{color:rgba(255,255,255,.45);}
        .ld-btn.red:hover{color:#F87171;background:rgba(248,113,113,.1);}
        .ld-sep{width:1px;height:28px;background:rgba(255,255,255,.12);margin:0 6px;flex-shrink:0;}
        .ld-spacer{flex:1;}
        .ld-tag{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#F97316;white-space:nowrap;}

        body.ld-on{padding-top:52px!important;}
        body.ld-on [data-eid]{cursor:crosshair!important;position:relative;transition:outline .1s;}
        body.ld-on [data-eid]:hover{outline:2px dashed #F97316!important;outline-offset:2px;}
        body.ld-on [data-eid]:hover::after{content:attr(data-elabel);position:absolute;top:-24px;left:0;background:#F97316;color:#fff;font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:4px 4px 4px 0;white-space:nowrap;z-index:9999;pointer-events:none;font-family:-apple-system,sans-serif;}
        body.ld-on [data-eid].ld-sel{outline:2px solid #1565C0!important;outline-offset:2px;}

        .ld-panel{position:fixed;top:64px;right:18px;width:310px;background:#fff;border-radius:16px;z-index:99998;box-shadow:0 20px 60px rgba(0,0,0,.22);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;overflow:hidden;}
        .ld-ph{background:#111827;color:#fff;padding:13px 16px;display:flex;align-items:center;justify-content:space-between;cursor:move;user-select:none;}
        .ld-ph h3{font-size:13.5px;font-weight:700;}
        .ld-px{background:none;border:none;color:rgba(255,255,255,.55);font-size:18px;cursor:pointer;line-height:1;padding:0 2px;}
        .ld-px:hover{color:#fff;}
        .ld-pb{padding:16px;max-height:calc(100vh - 120px);overflow-y:auto;}
        .ld-f{margin-bottom:12px;}
        .ld-f label{display:block;font-size:11px;font-weight:700;color:#374151;margin-bottom:4px;text-transform:uppercase;letter-spacing:.06em;}
        .ld-f input[type=text],.ld-f input[type=url],.ld-f textarea,.ld-f select{width:100%;padding:8px 11px;border:1.5px solid #E5E7EB;border-radius:8px;font-size:13px;outline:none;font-family:inherit;resize:vertical;transition:border .15s;}
        .ld-f input:focus,.ld-f textarea:focus,.ld-f select:focus{border-color:#1565C0;}
        .ld-rich{min-height:64px;padding:8px 11px;border:1.5px solid #E5E7EB;border-radius:8px;font-size:13px;outline:none;transition:border .15s;}
        .ld-rich:focus{border-color:#1565C0;}
        .ld-cr{display:flex;align-items:center;gap:10px;margin-bottom:9px;}
        .ld-cr label{flex:1;font-size:12px;color:#374151;}
        .ld-cr input[type=color]{width:38px;height:30px;padding:2px;border:1.5px solid #E5E7EB;border-radius:6px;cursor:pointer;}
        .ld-fmts{display:flex;gap:5px;margin-top:5px;}
        .ld-fmts button{padding:4px 11px;border:1.5px solid #E5E7EB;border-radius:6px;background:#fff;cursor:pointer;font-size:13px;font-weight:700;}
        .ld-fmts button:hover{background:#F3F4F6;}
        .ld-prev{width:100%;height:120px;object-fit:cover;border-radius:9px;margin-bottom:11px;background:#F3F4F6;}
        .ld-acts{display:flex;gap:7px;margin-top:14px;}
        .ld-ok{flex:1;padding:9px;background:#1565C0;color:#fff;border:none;border-radius:8px;font-weight:700;font-size:13px;cursor:pointer;transition:background .15s;}
        .ld-ok:hover{background:#0D47A1;}
        .ld-ko{padding:9px 14px;background:#F3F4F6;color:#374151;border:none;border-radius:8px;font-size:13px;cursor:pointer;}
        .ld-ko:hover{background:#E5E7EB;}
        .ld-hint{font-size:11px;color:#9CA3AF;margin-top:4px;line-height:1.4;}
        .ld-hr{border:none;border-top:1px solid #F3F4F6;margin:12px 0;}
        .ld-g2{display:grid;grid-template-columns:1fr 1fr;gap:8px;}

        .ld-toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(16px);background:#111827;color:#fff;padding:11px 22px;border-radius:50px;font-size:13px;font-weight:600;z-index:999999;opacity:0;transition:all .28s;white-space:nowrap;box-shadow:0 8px 24px rgba(0,0,0,.3);font-family:-apple-system,sans-serif;}
        .ld-toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
        .ld-toast.ok{background:#16A34A;}
        .ld-toast.err{background:#DC2626;}

        .ld-pub-box{background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:14px;margin-bottom:12px;font-size:13px;color:#166534;}
        .ld-pub-box ul{padding-left:18px;margin-top:6px;}
        .ld-pub-box li{margin-bottom:4px;}
        .ld-pub-progress{text-align:center;padding:20px;font-size:13px;color:#6B7280;}
        .ld-pub-progress .spin{font-size:28px;animation:spin 1s linear infinite;display:block;margin-bottom:8px;}
        @keyframes spin{to{transform:rotate(360deg)}}

        @media(max-width:600px){.ld-panel{left:8px;right:8px;width:auto;}.ld-bar-modes{overflow-x:auto;}}
        `;
        document.head.appendChild(s);
    }

    /* ─── EDITOR ─────────────────────────────────────────────── */
    const ED = {
        mode: null,
        panel: null,
        cms: {},

        async start() {
            injectCSS();
            this.cms = JSON.parse(localStorage.getItem(CMS_KEY) || '{}');
            // Sincroniza do GitHub raw (sempre atualizado)
            try {
                const r = await fetch(CONTENT_URL + '?_=' + Date.now());
                if (r.ok) {
                    const srv = await r.json();
                    // Mantém rascunho local se existir
                    this.cms = Object.keys(this.cms).length ? this.cms : srv;
                }
            } catch (_) {}

            document.body.classList.add('ld-on');
            sessionStorage.setItem('editor_active', '1');
            this.buildBar();
            this.bindAll();
        },

        buildBar() {
            const bar = document.createElement('div');
            bar.id = 'ld-bar';
            bar.innerHTML = `
            <div class="ld-brand"><span class="ld-dot"></span>Editor Ativo</div>
            <button class="ld-btn" data-m="text">✏️ Texto</button>
            <button class="ld-btn" data-m="image">🖼️ Imagem</button>
            <button class="ld-btn" data-m="color">🎨 Cores</button>
            <button class="ld-btn" data-m="button">🔘 Botão</button>
            <button class="ld-btn" data-m="link">🔗 Link</button>
            <div class="ld-spacer"></div>
            <span class="ld-tag" id="ld-mode-tag">← escolha um modo</span>
            <div class="ld-sep"></div>
            <button class="ld-btn blue" id="ld-save">💾 Salvar rascunho</button>
            <button class="ld-btn green" id="ld-pub">🚀 Publicar no site</button>
            <div class="ld-sep"></div>
            <button class="ld-btn red" id="ld-exit">✕</button>`;
            document.body.prepend(bar);

            bar.querySelectorAll('[data-m]').forEach(b => b.addEventListener('click', () => {
                this.mode = b.dataset.m;
                bar.querySelectorAll('[data-m]').forEach(x => x.classList.remove('on'));
                b.classList.add('on');
                document.getElementById('ld-mode-tag').textContent = 'Modo: ' + b.textContent.trim();
                this.closePanel();
                this.toast('Clique em qualquer elemento da página');
            }));

            document.getElementById('ld-save').onclick  = () => this.saveDraft();
            document.getElementById('ld-pub').onclick   = () => this.publish();
            document.getElementById('ld-exit').onclick  = () => this.exit();
        },

        bindAll() {
            document.querySelectorAll('[data-eid]').forEach(el => {
                el.addEventListener('click', e => {
                    if (!this.mode) { this.toast('⬆️ Escolha um modo na barra'); return; }
                    e.preventDefault(); e.stopPropagation();
                    document.querySelectorAll('.ld-sel').forEach(x => x.classList.remove('ld-sel'));
                    el.classList.add('ld-sel');
                    this.dispatch(el);
                });
            });
        },

        dispatch(el) {
            const m = this.mode;
            if      (m === 'text'   && el.tagName !== 'IMG') this.pText(el);
            else if (m === 'image'  && el.tagName === 'IMG')  this.pImage(el);
            else if (m === 'color')                           this.pColor(el);
            else if (m === 'button')                          this.pButton(el);
            else if (m === 'link'   && el.tagName === 'A')    this.pLink(el);
            else this.toast('Elemento não suporta este modo');
        },

        /* ── PAINEL TEXTO ── */
        pText(el) {
            const orig = el.innerHTML;
            const p = this.panel_(title('✏️ Editar Texto'));
            p.innerHTML += `<div class="ld-pb">
                <div class="ld-f"><label>Conteúdo</label><div class="ld-rich" contenteditable="true" id="ldr">${el.innerHTML}</div></div>
                <div class="ld-f"><label>Formatação</label><div class="ld-fmts">
                    <button onmousedown="event.preventDefault();document.execCommand('bold')"><b>N</b></button>
                    <button onmousedown="event.preventDefault();document.execCommand('italic')"><i>I</i></button>
                    <button onmousedown="event.preventDefault();document.execCommand('underline')"><u>S</u></button>
                </div></div>
                <div class="ld-f"><label>Cor</label><input type="color" id="ldtc" value="${this.hex(getComputedStyle(el).color)}"></div>
                <div class="ld-f"><label>Tamanho (px)</label><input type="text" id="ldfs" value="${parseInt(getComputedStyle(el).fontSize)||16}" style="width:80px"></div>
                <div class="ld-acts"><button class="ld-ok" id="lda">Aplicar</button><button class="ld-ko" id="ldc">Cancelar</button></div>
            </div>`;
            const rich = p.querySelector('#ldr'), tc = p.querySelector('#ldtc'), fs = p.querySelector('#ldfs');
            rich.oninput  = () => el.innerHTML = rich.innerHTML;
            tc.oninput    = () => el.style.color = tc.value;
            fs.oninput    = () => el.style.fontSize = fs.value + 'px';
            p.querySelector('#lda').onclick = () => {
                this.store(el.dataset.eid, { html: el.innerHTML, style: { color: tc.value, fontSize: fs.value+'px' } });
                this.closePanel(); this.toast('✓ Texto salvo no rascunho', 'ok');
            };
            p.querySelector('#ldc').onclick = () => { el.innerHTML = orig; el.style.color=''; el.style.fontSize=''; this.closePanel(); };
        },

        /* ── PAINEL IMAGEM ── */
        pImage(el) {
            const orig = el.src;
            const p = this.panel_(title('🖼️ Trocar Imagem'));
            p.innerHTML += `<div class="ld-pb">
                <img class="ld-prev" id="ldprev" src="${el.src}">
                <div class="ld-f"><label>URL da imagem</label>
                    <input type="url" id="ldiu" value="${el.src}" placeholder="https://...">
                    <p class="ld-hint">Cole link do Unsplash, Instagram ou qualquer imagem pública</p></div>
                <div class="ld-f"><label>Ou envie do dispositivo</label><input type="file" accept="image/*" id="ldif"></div>
                <div class="ld-acts"><button class="ld-ok" id="lda">Aplicar</button><button class="ld-ko" id="ldc">Cancelar</button></div>
            </div>`;
            const ui = p.querySelector('#ldiu'), pv = p.querySelector('#ldprev');
            ui.oninput = () => { el.src = ui.value; pv.src = ui.value; };
            p.querySelector('#ldif').onchange = e => {
                const f = e.target.files[0]; if (!f) return;
                const r = new FileReader();
                r.onload = ev => { el.src = pv.src = ui.value = ev.target.result; };
                r.readAsDataURL(f);
            };
            p.querySelector('#lda').onclick = () => {
                this.store(el.dataset.eid, { src: el.src });
                this.closePanel(); this.toast('✓ Imagem salva no rascunho', 'ok');
            };
            p.querySelector('#ldc').onclick = () => { el.src = orig; this.closePanel(); };
        },

        /* ── PAINEL CORES ── */
        pColor(el) {
            const cs = getComputedStyle(el), origBg = el.style.backgroundColor, origFg = el.style.color;
            const p = this.panel_(title('🎨 Editar Cores'));
            p.innerHTML += `<div class="ld-pb">
                <p style="font-size:11.5px;color:#6B7280;margin-bottom:12px">Elemento: <strong>${el.dataset.elabel||el.tagName}</strong></p>
                <div class="ld-cr"><label>Fundo do elemento</label><input type="color" id="ldbg" value="${this.hex(cs.backgroundColor)}"></div>
                <div class="ld-cr"><label>Texto do elemento</label><input type="color" id="ldfg" value="${this.hex(cs.color)}"></div>
                <hr class="ld-hr">
                <p style="font-size:10.5px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">CORES GLOBAIS DO SITE</p>
                <div class="ld-g2">
                    <div class="ld-cr"><label>🔵 Azul</label><input type="color" id="ldg1" value="#1565C0"></div>
                    <div class="ld-cr"><label>🟠 Laranja</label><input type="color" id="ldg2" value="#F97316"></div>
                    <div class="ld-cr"><label>🔵 Azul escuro</label><input type="color" id="ldg3" value="#0D47A1"></div>
                    <div class="ld-cr"><label>⬛ Texto</label><input type="color" id="ldg4" value="#1A1F2E"></div>
                </div>
                <div class="ld-acts"><button class="ld-ok" id="lda">Aplicar</button><button class="ld-ko" id="ldc">Cancelar</button></div>
            </div>`;
            const bg=p.querySelector('#ldbg'),fg=p.querySelector('#ldfg'),g1=p.querySelector('#ldg1'),g2=p.querySelector('#ldg2'),g3=p.querySelector('#ldg3'),g4=p.querySelector('#ldg4');
            bg.oninput=()=>el.style.backgroundColor=bg.value;
            fg.oninput=()=>el.style.color=fg.value;
            g1.oninput=()=>document.documentElement.style.setProperty('--navy',g1.value);
            g2.oninput=()=>document.documentElement.style.setProperty('--accent',g2.value);
            g3.oninput=()=>document.documentElement.style.setProperty('--navy-dark',g3.value);
            g4.oninput=()=>document.documentElement.style.setProperty('--text',g4.value);
            p.querySelector('#lda').onclick = () => {
                const colors={'--navy':g1.value,'--accent':g2.value,'--navy-dark':g3.value,'--text':g4.value};
                this.store(el.dataset.eid+'_col',{style:{backgroundColor:bg.value,color:fg.value}});
                this.cms.colors = {...(this.cms.colors||{}), ...colors};
                localStorage.setItem(CMS_KEY, JSON.stringify(this.cms));
                this.closePanel(); this.toast('✓ Cores salvas no rascunho','ok');
            };
            p.querySelector('#ldc').onclick=()=>{el.style.backgroundColor=origBg;el.style.color=origFg;this.closePanel();};
        },

        /* ── PAINEL BOTÃO ── */
        pButton(el) {
            const isA=el.tagName==='A', origHTML=el.innerHTML, origHref=el.getAttribute('href')||'', origTarget=el.getAttribute('target')||'_self';
            const cs=getComputedStyle(el);
            const p=this.panel_(title('🔘 Editar Botão'));
            p.innerHTML+=`<div class="ld-pb">
                <div class="ld-f"><label>Texto</label><input type="text" id="ldbt" value="${el.textContent.trim()}"></div>
                ${isA?`<div class="ld-f"><label>Link (URL)</label><input type="url" id="ldbh" value="${origHref}" placeholder="https://wa.me/..."></div>
                <div class="ld-f"><label>Abrir em</label><select id="ldtgt"><option value="_self" ${origTarget!=='_blank'?'selected':''}>Mesma aba</option><option value="_blank" ${origTarget==='_blank'?'selected':''}>Nova aba</option></select></div>`:''}
                <div class="ld-cr" style="margin-top:8px"><label>Cor de fundo</label><input type="color" id="ldbbg" value="${this.hex(cs.backgroundColor)}"></div>
                <div class="ld-cr"><label>Cor do texto</label><input type="color" id="ldbfg" value="${this.hex(cs.color)}"></div>
                <div class="ld-acts"><button class="ld-ok" id="lda">Aplicar</button><button class="ld-ko" id="ldc">Cancelar</button></div>
            </div>`;
            const bt=p.querySelector('#ldbt'),bbg=p.querySelector('#ldbbg'),bfg=p.querySelector('#ldbfg');
            bt.oninput=()=>{const ic=el.querySelector('i');el.textContent=bt.value;if(ic)el.prepend(ic);};
            bbg.oninput=()=>el.style.backgroundColor=bbg.value;
            bfg.oninput=()=>el.style.color=bfg.value;
            p.querySelector('#lda').onclick=()=>{
                const href=p.querySelector('#ldbh')?.value,target=p.querySelector('#ldtgt')?.value;
                if(href)el.setAttribute('href',href);if(target)el.setAttribute('target',target);
                this.store(el.dataset.eid,{html:el.innerHTML,href:href||origHref,target:target||origTarget,style:{backgroundColor:bbg.value,color:bfg.value}});
                this.closePanel();this.toast('✓ Botão salvo no rascunho','ok');
            };
            p.querySelector('#ldc').onclick=()=>{el.innerHTML=origHTML;el.style.backgroundColor='';el.style.color='';this.closePanel();};
        },

        /* ── PAINEL LINK ── */
        pLink(el) {
            const oh=el.getAttribute('href')||'',ot=el.getAttribute('target')||'_self';
            const p=this.panel_(title('🔗 Editar Link'));
            p.innerHTML+=`<div class="ld-pb">
                <div class="ld-f"><label>URL</label><input type="url" id="ldlh" value="${oh}" placeholder="https://..."></div>
                <div class="ld-f"><label>Abrir em</label><select id="ldlt"><option value="_self" ${ot!=='_blank'?'selected':''}>Mesma aba</option><option value="_blank" ${ot==='_blank'?'selected':''}>Nova aba</option></select></div>
                <div class="ld-acts"><button class="ld-ok" id="lda">Aplicar</button><button class="ld-ko" id="ldc">Cancelar</button></div>
            </div>`;
            p.querySelector('#lda').onclick=()=>{
                const h=p.querySelector('#ldlh').value,t=p.querySelector('#ldlt').value;
                el.setAttribute('href',h);el.setAttribute('target',t);
                this.store(el.dataset.eid,{href:h,target:t});
                this.closePanel();this.toast('✓ Link salvo no rascunho','ok');
            };
            p.querySelector('#ldc').onclick=()=>this.closePanel();
        },

        /* ── SALVAR RASCUNHO ── */
        saveDraft() {
            localStorage.setItem(CMS_KEY, JSON.stringify(this.cms));
            this.toast('✓ Rascunho salvo localmente','ok');
        },

        /* ── PUBLICAR NO VERCEL ── */
        async publish() {
            const p = this.panel_(title('🚀 Publicar no Site'));
            p.innerHTML += `<div class="ld-pb"><div class="ld-pub-progress"><span class="spin">⏳</span>Publicando alterações…<br><small style="color:#9CA3AF">Enviando para o servidor</small></div></div>`;

            try {
                const res = await fetch(API_PUBLISH, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: this.cms, secret: 'Lovisa@2025' })
                });
                const data = await res.json();

                if (res.ok && data.success) {
                    // Mantém o CMS no localStorage (É o conteúdo publicado agora)
                    localStorage.setItem(CMS_KEY, JSON.stringify(this.cms));
                    // Aplica as mudanças diretamente na página atual
                    applyContent(this.cms);
                    p.querySelector('.ld-pb').innerHTML = `
                        <div class="ld-pub-box">
                            <strong>✅ Publicado com sucesso!</strong>
                            <ul>
                                <li>Alterações aplicadas na página</li>
                                <li>Visitantes verão em ~30 segundos</li>
                            </ul>
                        </div>
                        <button class="ld-ok" style="width:100%" onclick="this.closest('.ld-panel').remove()">✓ Continuar editando</button>`;
                    this.toast('🚀 Publicado com sucesso!', 'ok');
                } else {
                    throw new Error(data.error || 'Erro desconhecido');
                }
            } catch (err) {
                p.querySelector('.ld-pb').innerHTML = `
                    <div style="background:#FEF2F2;border:1px solid #FCA5A5;border-radius:10px;padding:14px;color:#991B1B;font-size:13px;">
                        ❌ <strong>Erro ao publicar:</strong><br>${err.message}
                    </div>
                    <button class="ld-ko" style="width:100%;margin-top:10px" id="ldc">Fechar</button>`;
                p.querySelector('#ldc').onclick = () => this.closePanel();
                this.toast('❌ Erro ao publicar', 'err');
            }
        },

        /* ── EXIT ── */
        exit() {
            if (confirm('Sair do modo editor? Rascunhos não publicados serão mantidos.')) {
                sessionStorage.removeItem('editor_active');
                const u = new URL(location.href);
                u.searchParams.delete('editor');
                location.replace(u.toString());
            }
        },

        /* ── HELPERS ── */
        panel_(t) {
            this.closePanel();
            const p = document.createElement('div');
            p.className='ld-panel';
            p.innerHTML=`<div class="ld-ph"><h3>${t}</h3><button class="ld-px">✕</button></div>`;
            document.body.appendChild(p);
            p.querySelector('.ld-px').onclick=()=>this.closePanel();
            this.drag_(p); this.panel=p; return p;
        },

        closePanel() {
            document.querySelectorAll('.ld-panel').forEach(x=>x.remove());
            document.querySelectorAll('.ld-sel').forEach(x=>x.classList.remove('ld-sel'));
            this.panel=null;
        },

        drag_(el) {
            const h=el.querySelector('.ld-ph');
            let d=false,sx=0,sy=0,ox=0,oy=0;
            h.onmousedown=e=>{d=true;sx=e.clientX;sy=e.clientY;ox=el.offsetLeft;oy=el.offsetTop;e.preventDefault();};
            document.addEventListener('mousemove',e=>{if(!d)return;el.style.left=ox+e.clientX-sx+'px';el.style.top=oy+e.clientY-sy+'px';});
            document.addEventListener('mouseup',()=>d=false);
        },

        store(key, val) {
            this.cms[key]=val;
            localStorage.setItem(CMS_KEY, JSON.stringify(this.cms));
        },

        toast(msg, type='') {
            document.querySelectorAll('.ld-toast').forEach(t=>t.remove());
            const t=document.createElement('div');
            t.className='ld-toast'+(type?' '+type:'');t.textContent=msg;
            document.body.appendChild(t);
            requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.add('show')));
            setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),320);},3200);
        },

        hex(rgb) {
            if(!rgb||rgb.includes('rgba(0, 0, 0, 0)')||rgb==='transparent')return'#ffffff';
            const m=rgb.match(/\d+/g);
            if(!m||m.length<3)return'#ffffff';
            return'#'+m.slice(0,3).map(n=>(+n).toString(16).padStart(2,'0')).join('');
        }
    };

    /* helper */
    function title(t){return t;}

    /* ─── BOOT ──────────────────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', async () => {
        // Sempre aplica o conteúdo salvo na página (admin e visitantes)
        await loadAndApply();
        if (editMode) {
            await ED.start();
        }
    });

    window._LD = ED;
})();
