/**
 * LOVISA DESTINOS — EDITOR VISUAL
 * Sistema de edição inline para o site
 * Acesso: /admin/login.html
 * Credenciais: admin@lovisadestinos.com.br / Lovisa@2025
 */

(function () {
    'use strict';

    const CMS_KEY = 'lovisa_cms_v2';
    const AUTH_KEY = 'lovisa_auth';

    /* ─── VERIFICAR AUTENTICAÇÃO ─────────────────────────────── */
    const auth = JSON.parse(sessionStorage.getItem(AUTH_KEY) || 'null');
    const isAdmin = auth && auth.expires > Date.now();
    const editMode = isAdmin && (new URLSearchParams(location.search).get('editor') === '1' || sessionStorage.getItem('editor_active'));

    /* ─── CARREGAR CONTEÚDO SALVO (TODOS OS VISITANTES) ─────── */
    const cms = JSON.parse(localStorage.getItem(CMS_KEY) || '{}');

    function applyContent() {
        // Cores globais
        if (cms.colors) {
            Object.entries(cms.colors).forEach(([k, v]) => {
                document.documentElement.style.setProperty(k, v);
            });
        }
        // Elementos
        document.querySelectorAll('[data-eid]').forEach(el => {
            const id = el.dataset.eid;
            const d = cms[id];
            if (!d) return;
            if (d.html != null) el.innerHTML = d.html;
            if (d.src != null && el.tagName === 'IMG') el.src = d.src;
            if (d.href != null && el.href !== undefined) el.setAttribute('href', d.href);
            if (d.target != null) el.setAttribute('target', d.target);
            if (d.style) Object.assign(el.style, d.style);
        });
    }

    /* ─── CSS DO EDITOR (injetado dinamicamente) ─────────────── */
    function injectCSS() {
        const css = `
        /* ── TOOLBAR ── */
        #ld-toolbar {
            position: fixed; top: 0; left: 0; right: 0; z-index: 99999;
            height: 56px; background: #1A1A2E;
            display: flex; align-items: center; gap: 0;
            box-shadow: 0 2px 20px rgba(0,0,0,.4);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 13px;
        }
        #ld-toolbar * { box-sizing: border-box; }
        .ld-brand {
            padding: 0 20px; color: #fff; font-weight: 700;
            display: flex; align-items: center; gap: 8px;
            border-right: 1px solid rgba(255,255,255,.12);
            height: 100%; white-space: nowrap;
        }
        .ld-brand .dot { width: 8px; height: 8px; border-radius: 50%; background: #F97316; animation: blink 2s infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .ld-modes { display: flex; align-items: center; gap: 2px; padding: 0 12px; flex: 1; }
        .ld-btn {
            padding: 6px 14px; border: none; border-radius: 8px;
            background: transparent; color: rgba(255,255,255,.7);
            cursor: pointer; font-size: 12.5px; font-weight: 500;
            display: flex; align-items: center; gap: 6px;
            transition: all .15s; white-space: nowrap;
        }
        .ld-btn:hover { background: rgba(255,255,255,.1); color: #fff; }
        .ld-btn.active { background: #F97316; color: #fff; }
        .ld-btn.save { background: #1565C0; color: #fff; }
        .ld-btn.save:hover { background: #0D47A1; }
        .ld-btn.publish { background: #16A34A; color: #fff; }
        .ld-btn.publish:hover { background: #15803D; }
        .ld-btn.exit { color: rgba(255,255,255,.5); }
        .ld-btn.exit:hover { color: #F87171; background: rgba(248,113,113,.1); }
        .ld-sep { width: 1px; height: 32px; background: rgba(255,255,255,.12); margin: 0 8px; }
        .ld-actions { display: flex; align-items: center; gap: 6px; padding: 0 16px; border-left: 1px solid rgba(255,255,255,.12); }
        .ld-mode-label {
            padding: 0 16px; color: #F97316; font-size: 11px;
            font-weight: 700; text-transform: uppercase; letter-spacing: .08em;
            white-space: nowrap;
        }

        /* ── BODY OFFSET ── */
        body.ld-editor-on { padding-top: 56px !important; }

        /* ── EDITABLE HIGHLIGHT ── */
        body.ld-editor-on [data-eid] {
            position: relative; cursor: crosshair !important;
            transition: outline .1s;
        }
        body.ld-editor-on [data-eid]:hover {
            outline: 2px dashed #F97316 !important;
            outline-offset: 2px;
        }
        body.ld-editor-on [data-eid]:hover::after {
            content: attr(data-elabel);
            position: absolute; top: -26px; left: 0;
            background: #F97316; color: #fff;
            font-size: 11px; font-weight: 700;
            padding: 3px 8px; border-radius: 5px 5px 5px 0;
            white-space: nowrap; z-index: 9999;
            pointer-events: none;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        body.ld-editor-on [data-eid].ld-selected {
            outline: 2px solid #1565C0 !important;
            outline-offset: 2px;
        }

        /* ── PANEL ── */
        .ld-panel {
            position: fixed; top: 70px; right: 20px;
            width: 320px; background: #fff;
            border-radius: 16px; z-index: 99998;
            box-shadow: 0 20px 60px rgba(0,0,0,.25);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            overflow: hidden;
        }
        .ld-panel-header {
            background: #1A1A2E; color: #fff;
            padding: 14px 18px; display: flex;
            align-items: center; justify-content: space-between;
            cursor: move; user-select: none;
        }
        .ld-panel-header h3 { font-size: 14px; font-weight: 700; }
        .ld-panel-close {
            background: none; border: none; color: rgba(255,255,255,.6);
            font-size: 18px; cursor: pointer; line-height: 1;
            padding: 0 4px;
        }
        .ld-panel-close:hover { color: #fff; }
        .ld-panel-body { padding: 18px; max-height: calc(100vh - 140px); overflow-y: auto; }
        .ld-field { margin-bottom: 14px; }
        .ld-field label {
            display: block; font-size: 11.5px; font-weight: 600;
            color: #374151; margin-bottom: 5px; text-transform: uppercase; letter-spacing: .05em;
        }
        .ld-field input[type=text],
        .ld-field input[type=url],
        .ld-field textarea,
        .ld-field select {
            width: 100%; padding: 9px 12px;
            border: 1.5px solid #E5E7EB; border-radius: 9px;
            font-size: 13px; outline: none;
            font-family: inherit; resize: vertical;
        }
        .ld-field input:focus, .ld-field textarea:focus, .ld-field select:focus { border-color: #1565C0; }
        .ld-field .rich { min-height: 70px; padding: 9px 12px; border: 1.5px solid #E5E7EB; border-radius: 9px; font-size: 13px; outline: none; }
        .ld-field .rich:focus { border-color: #1565C0; }
        .ld-color-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .ld-color-row label { flex: 1; font-size: 12px; color: #374151; }
        .ld-color-row input[type=color] { width: 40px; height: 32px; padding: 2px; border: 1.5px solid #E5E7EB; border-radius: 6px; cursor: pointer; }
        .ld-format-btns { display: flex; gap: 6px; margin-top: 6px; }
        .ld-format-btns button {
            padding: 5px 12px; border: 1.5px solid #E5E7EB; border-radius: 7px;
            background: #fff; cursor: pointer; font-size: 13px; font-weight: 700;
        }
        .ld-format-btns button:hover { background: #F3F4F6; }
        .ld-img-preview { width: 100%; height: 140px; object-fit: cover; border-radius: 10px; margin-bottom: 12px; background: #F3F4F6; }
        .ld-panel-actions { display: flex; gap: 8px; margin-top: 16px; }
        .ld-apply {
            flex: 1; padding: 10px; background: #1565C0; color: #fff;
            border: none; border-radius: 9px; font-weight: 700; font-size: 13px; cursor: pointer;
        }
        .ld-apply:hover { background: #0D47A1; }
        .ld-cancel {
            padding: 10px 16px; background: #F3F4F6; color: #374151;
            border: none; border-radius: 9px; font-size: 13px; cursor: pointer;
        }
        .ld-cancel:hover { background: #E5E7EB; }
        .ld-hint { font-size: 11.5px; color: #9CA3AF; margin-top: 5px; line-height: 1.4; }
        .ld-divider { border: none; border-top: 1px solid #F3F4F6; margin: 14px 0; }

        /* ── TOAST ── */
        .ld-toast {
            position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%) translateY(20px);
            background: #1A1A2E; color: #fff; padding: 12px 24px;
            border-radius: 50px; font-size: 13.5px; font-weight: 600;
            z-index: 999999; opacity: 0; transition: all .3s;
            white-space: nowrap; box-shadow: 0 8px 24px rgba(0,0,0,.3);
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .ld-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

        /* ── PUBLISH PANEL ── */
        .ld-publish-step {
            background: #F0F9FF; border-radius: 10px; padding: 14px;
            margin-bottom: 12px; font-size: 13px; color: #0369A1;
        }
        .ld-publish-step ol { padding-left: 18px; }
        .ld-publish-step li { margin-bottom: 8px; line-height: 1.5; }
        .ld-publish-step code {
            background: #1A1A2E; color: #F97316; padding: 2px 8px;
            border-radius: 5px; font-size: 11px; display: inline-block; margin-top: 4px;
        }
        .ld-download-btn {
            width: 100%; padding: 12px; background: #16A34A; color: #fff;
            border: none; border-radius: 10px; font-weight: 700; font-size: 14px;
            cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
            margin-bottom: 8px;
        }
        .ld-download-btn:hover { background: #15803D; }

        /* ── COLOR PALETTE GLOBAL ── */
        .ld-palette-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

        /* ── MOBILE ── */
        @media (max-width: 600px) {
            .ld-panel { left: 10px; right: 10px; width: auto; }
            .ld-modes { overflow-x: auto; }
            .ld-mode-label { display: none; }
        }
        `;
        const style = document.createElement('style');
        style.id = 'ld-editor-css';
        style.textContent = css;
        document.head.appendChild(style);
    }

    /* ─── EDITOR PRINCIPAL ──────────────────────────────────── */
    const EDITOR = {
        mode: null,
        panel: null,

        init() {
            injectCSS();
            document.body.classList.add('ld-editor-on');
            sessionStorage.setItem('editor_active', '1');
            this.buildToolbar();
            this.bindElements();
        },

        buildToolbar() {
            const tb = document.createElement('div');
            tb.id = 'ld-toolbar';
            tb.innerHTML = `
                <div class="ld-brand">
                    <span class="dot"></span> Editor Ativo
                </div>
                <div class="ld-modes">
                    <button class="ld-btn" data-mode="text">✏️ Texto</button>
                    <button class="ld-btn" data-mode="image">🖼️ Imagem</button>
                    <button class="ld-btn" data-mode="color">🎨 Cores</button>
                    <button class="ld-btn" data-mode="button">🔘 Botão</button>
                    <button class="ld-btn" data-mode="link">🔗 Link</button>
                </div>
                <div class="ld-mode-label" id="ld-mode-label">← Escolha um modo</div>
                <div class="ld-actions">
                    <button class="ld-btn save" id="ld-save">💾 Salvar</button>
                    <button class="ld-btn publish" id="ld-publish">🚀 Publicar</button>
                    <div class="ld-sep"></div>
                    <button class="ld-btn exit" id="ld-exit" title="Sair do editor">✕ Sair</button>
                </div>
            `;
            document.body.prepend(tb);

            tb.querySelectorAll('[data-mode]').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.mode = btn.dataset.mode;
                    tb.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    document.getElementById('ld-mode-label').textContent = 'Modo: ' + btn.textContent.trim();
                    this.closePanel();
                    this.toast(`Modo ${btn.textContent.trim()} ativado — clique em um elemento`);
                });
            });

            document.getElementById('ld-save').addEventListener('click', () => this.save());
            document.getElementById('ld-publish').addEventListener('click', () => this.showPublish());
            document.getElementById('ld-exit').addEventListener('click', () => this.exit());
        },

        bindElements() {
            document.querySelectorAll('[data-eid]').forEach(el => {
                el.addEventListener('click', e => {
                    if (!this.mode) { this.toast('⬆️ Escolha um modo na barra acima antes de clicar'); return; }
                    e.preventDefault(); e.stopPropagation();
                    document.querySelectorAll('.ld-selected').forEach(x => x.classList.remove('ld-selected'));
                    el.classList.add('ld-selected');
                    this.dispatch(el);
                });
            });
        },

        dispatch(el) {
            const type = el.dataset.etype || 'text';
            if (this.mode === 'text')   this.panelText(el);
            else if (this.mode === 'image' && el.tagName === 'IMG') this.panelImage(el);
            else if (this.mode === 'image' && type === 'bg') this.panelBgImage(el);
            else if (this.mode === 'color')  this.panelColor(el);
            else if (this.mode === 'button') this.panelButton(el);
            else if (this.mode === 'link')   this.panelLink(el);
            else this.toast(`Este elemento não suporta o modo selecionado`);
        },

        /* ── TEXTO ── */
        panelText(el) {
            const orig = el.innerHTML;
            const p = this.createPanel('✏️ Editar Texto');
            p.innerHTML += `
            <div class="ld-panel-body">
                <div class="ld-field">
                    <label>Conteúdo</label>
                    <div class="rich" contenteditable="true" id="ld-rich">${el.innerHTML}</div>
                </div>
                <div class="ld-field">
                    <label>Formatação rápida</label>
                    <div class="ld-format-btns">
                        <button onclick="document.execCommand('bold')"><b>N</b></button>
                        <button onclick="document.execCommand('italic')"><i>I</i></button>
                        <button onclick="document.execCommand('underline')"><u>S</u></button>
                    </div>
                </div>
                <div class="ld-field">
                    <label>Cor do texto</label>
                    <input type="color" id="ld-tc" value="${this.getColor(el)}">
                </div>
                <div class="ld-field">
                    <label>Tamanho (px)</label>
                    <input type="text" id="ld-fs" value="${parseInt(getComputedStyle(el).fontSize) || 16}" style="width:80px">
                </div>
                <div class="ld-panel-actions">
                    <button class="ld-apply" id="ld-a">Aplicar</button>
                    <button class="ld-cancel" id="ld-c">Cancelar</button>
                </div>
            </div>`;

            const rich = p.querySelector('#ld-rich');
            const tc = p.querySelector('#ld-tc');
            const fs = p.querySelector('#ld-fs');

            tc.oninput = () => el.style.color = tc.value;
            fs.oninput = () => el.style.fontSize = fs.value + 'px';
            rich.oninput = () => el.innerHTML = rich.innerHTML;

            p.querySelector('#ld-a').onclick = () => {
                this.store(el.dataset.eid, { html: el.innerHTML, style: { color: tc.value, fontSize: fs.value + 'px' } });
                this.closePanel(); this.toast('✓ Texto atualizado!');
            };
            p.querySelector('#ld-c').onclick = () => { el.innerHTML = orig; el.style.color = ''; el.style.fontSize = ''; this.closePanel(); };
        },

        /* ── IMAGEM ── */
        panelImage(el) {
            const orig = el.src;
            const p = this.createPanel('🖼️ Trocar Imagem');
            p.innerHTML += `
            <div class="ld-panel-body">
                <img class="ld-img-preview" id="ld-preview" src="${el.src}" alt="preview">
                <div class="ld-field">
                    <label>URL da imagem</label>
                    <input type="url" id="ld-iurl" value="${el.src}" placeholder="https://...">
                    <p class="ld-hint">Cole um link do Unsplash, Google ou qualquer imagem pública.</p>
                </div>
                <div class="ld-field">
                    <label>Ou envie do seu dispositivo</label>
                    <input type="file" accept="image/*" id="ld-ifile">
                </div>
                <div class="ld-panel-actions">
                    <button class="ld-apply" id="ld-a">Aplicar</button>
                    <button class="ld-cancel" id="ld-c">Cancelar</button>
                </div>
            </div>`;

            const urlInput = p.querySelector('#ld-iurl');
            const preview = p.querySelector('#ld-preview');

            urlInput.oninput = () => { el.src = urlInput.value; preview.src = urlInput.value; };

            p.querySelector('#ld-ifile').onchange = e => {
                const f = e.target.files[0]; if (!f) return;
                const r = new FileReader();
                r.onload = ev => { el.src = ev.target.result; preview.src = ev.target.result; urlInput.value = ev.target.result; };
                r.readAsDataURL(f);
            };

            p.querySelector('#ld-a').onclick = () => {
                this.store(el.dataset.eid, { src: el.src });
                this.closePanel(); this.toast('✓ Imagem atualizada!');
            };
            p.querySelector('#ld-c').onclick = () => { el.src = orig; this.closePanel(); };
        },

        /* ── IMAGEM DE FUNDO ── */
        panelBgImage(el) {
            const p = this.createPanel('🖼️ Imagem de Fundo');
            const cur = el.style.backgroundImage || '';
            const curUrl = cur.replace(/url\(['"]?(.*?)['"]?\)/, '$1');
            p.innerHTML += `
            <div class="ld-panel-body">
                <div class="ld-field">
                    <label>URL da imagem de fundo</label>
                    <input type="url" id="ld-burl" value="${curUrl}" placeholder="https://...">
                </div>
                <div class="ld-panel-actions">
                    <button class="ld-apply" id="ld-a">Aplicar</button>
                    <button class="ld-cancel" id="ld-c">Cancelar</button>
                </div>
            </div>`;
            const input = p.querySelector('#ld-burl');
            input.oninput = () => el.style.backgroundImage = `url('${input.value}')`;
            p.querySelector('#ld-a').onclick = () => {
                this.store(el.dataset.eid, { style: { backgroundImage: `url('${input.value}')` } });
                this.closePanel(); this.toast('✓ Fundo atualizado!');
            };
            p.querySelector('#ld-c').onclick = () => { el.style.backgroundImage = cur; this.closePanel(); };
        },

        /* ── CORES ── */
        panelColor(el) {
            const cs = getComputedStyle(el);
            const origBg = el.style.backgroundColor;
            const origFg = el.style.color;
            const p = this.createPanel('🎨 Editar Cores');
            p.innerHTML += `
            <div class="ld-panel-body">
                <p style="font-size:12px;color:#6B7280;margin-bottom:12px">Elemento selecionado: <strong>${el.dataset.elabel || el.tagName}</strong></p>
                <div class="ld-color-row">
                    <label>Cor de fundo</label>
                    <input type="color" id="ld-bg" value="${this.toHex(cs.backgroundColor)}">
                </div>
                <div class="ld-color-row">
                    <label>Cor do texto</label>
                    <input type="color" id="ld-fg" value="${this.toHex(cs.color)}">
                </div>
                <hr class="ld-divider">
                <p style="font-size:11px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px">Cores globais do site</p>
                <div class="ld-palette-grid">
                    <div class="ld-color-row"><label>🔵 Azul principal</label><input type="color" id="ld-g1" value="#1565C0"></div>
                    <div class="ld-color-row"><label>🟠 Laranja CTA</label><input type="color" id="ld-g2" value="#F97316"></div>
                    <div class="ld-color-row"><label>🔵 Azul escuro</label><input type="color" id="ld-g3" value="#0D47A1"></div>
                    <div class="ld-color-row"><label>📝 Texto</label><input type="color" id="ld-g4" value="#1A1F2E"></div>
                </div>
                <div class="ld-panel-actions">
                    <button class="ld-apply" id="ld-a">Aplicar tudo</button>
                    <button class="ld-cancel" id="ld-c">Cancelar</button>
                </div>
            </div>`;

            const bgI = p.querySelector('#ld-bg'), fgI = p.querySelector('#ld-fg');
            const g1 = p.querySelector('#ld-g1'), g2 = p.querySelector('#ld-g2');
            const g3 = p.querySelector('#ld-g3'), g4 = p.querySelector('#ld-g4');

            bgI.oninput = () => el.style.backgroundColor = bgI.value;
            fgI.oninput = () => el.style.color = fgI.value;
            g1.oninput = () => document.documentElement.style.setProperty('--navy', g1.value);
            g2.oninput = () => document.documentElement.style.setProperty('--accent', g2.value);
            g3.oninput = () => document.documentElement.style.setProperty('--navy-dark', g3.value);
            g4.oninput = () => document.documentElement.style.setProperty('--text', g4.value);

            p.querySelector('#ld-a').onclick = () => {
                const colors = { '--navy': g1.value, '--accent': g2.value, '--navy-dark': g3.value, '--text': g4.value };
                this.store(el.dataset.eid + '_color', { style: { backgroundColor: bgI.value, color: fgI.value } });
                cms.colors = { ...(cms.colors || {}), ...colors };
                localStorage.setItem(CMS_KEY, JSON.stringify(cms));
                this.closePanel(); this.toast('✓ Cores atualizadas!');
            };
            p.querySelector('#ld-c').onclick = () => {
                el.style.backgroundColor = origBg; el.style.color = origFg; this.closePanel();
            };
        },

        /* ── BOTÃO ── */
        panelButton(el) {
            const isA = el.tagName === 'A';
            const origText = el.textContent.trim();
            const origHref = el.getAttribute('href') || '';
            const origTarget = el.getAttribute('target') || '_self';
            const cs = getComputedStyle(el);
            const p = this.createPanel('🔘 Editar Botão');
            p.innerHTML += `
            <div class="ld-panel-body">
                <div class="ld-field">
                    <label>Texto do botão</label>
                    <input type="text" id="ld-bt" value="${origText}">
                </div>
                ${isA ? `
                <div class="ld-field">
                    <label>Link (URL)</label>
                    <input type="url" id="ld-bh" value="${origHref}" placeholder="https://wa.me/...">
                </div>
                <div class="ld-field">
                    <label>Abrir em</label>
                    <select id="ld-btr">
                        <option value="_self" ${origTarget !== '_blank' ? 'selected' : ''}>Mesma aba</option>
                        <option value="_blank" ${origTarget === '_blank' ? 'selected' : ''}>Nova aba</option>
                    </select>
                </div>` : ''}
                <div class="ld-color-row" style="margin-top:10px">
                    <label>Cor de fundo</label>
                    <input type="color" id="ld-bbg" value="${this.toHex(cs.backgroundColor)}">
                </div>
                <div class="ld-color-row">
                    <label>Cor do texto</label>
                    <input type="color" id="ld-bfg" value="${this.toHex(cs.color)}">
                </div>
                <div class="ld-panel-actions">
                    <button class="ld-apply" id="ld-a">Aplicar</button>
                    <button class="ld-cancel" id="ld-c">Cancelar</button>
                </div>
            </div>`;

            const btI = p.querySelector('#ld-bt');
            const bbgI = p.querySelector('#ld-bbg');
            const bfgI = p.querySelector('#ld-bfg');

            btI.oninput = () => {
                const icon = el.querySelector('i');
                el.textContent = btI.value;
                if (icon) el.prepend(icon);
            };
            bbgI.oninput = () => el.style.backgroundColor = bbgI.value;
            bfgI.oninput = () => el.style.color = bfgI.value;

            p.querySelector('#ld-a').onclick = () => {
                const href = p.querySelector('#ld-bh')?.value;
                const target = p.querySelector('#ld-btr')?.value;
                if (href) el.setAttribute('href', href);
                if (target) el.setAttribute('target', target);
                this.store(el.dataset.eid, {
                    html: el.innerHTML,
                    href: href || origHref,
                    target: target || origTarget,
                    style: { backgroundColor: bbgI.value, color: bfgI.value }
                });
                this.closePanel(); this.toast('✓ Botão atualizado!');
            };
            p.querySelector('#ld-c').onclick = () => {
                const icon = el.querySelector('i');
                el.textContent = origText;
                if (icon) el.prepend(icon);
                el.style.backgroundColor = ''; el.style.color = '';
                if (origHref) el.setAttribute('href', origHref);
                this.closePanel();
            };
        },

        /* ── LINK ── */
        panelLink(el) {
            const origHref = el.getAttribute('href') || '';
            const origTarget = el.getAttribute('target') || '_self';
            const p = this.createPanel('🔗 Editar Link');
            p.innerHTML += `
            <div class="ld-panel-body">
                <div class="ld-field">
                    <label>URL do link</label>
                    <input type="url" id="ld-lh" value="${origHref}" placeholder="https://...">
                </div>
                <div class="ld-field">
                    <label>Abrir em</label>
                    <select id="ld-lt">
                        <option value="_self" ${origTarget !== '_blank' ? 'selected' : ''}>Mesma aba</option>
                        <option value="_blank" ${origTarget === '_blank' ? 'selected' : ''}>Nova aba</option>
                    </select>
                </div>
                <div class="ld-panel-actions">
                    <button class="ld-apply" id="ld-a">Aplicar</button>
                    <button class="ld-cancel" id="ld-c">Cancelar</button>
                </div>
            </div>`;
            p.querySelector('#ld-a').onclick = () => {
                const href = p.querySelector('#ld-lh').value;
                const target = p.querySelector('#ld-lt').value;
                el.setAttribute('href', href);
                el.setAttribute('target', target);
                this.store(el.dataset.eid, { href, target });
                this.closePanel(); this.toast('✓ Link atualizado!');
            };
            p.querySelector('#ld-c').onclick = () => this.closePanel();
        },

        /* ── PUBLICAR ── */
        showPublish() {
            const p = this.createPanel('🚀 Publicar Alterações');
            p.innerHTML += `
            <div class="ld-panel-body">
                <div class="ld-publish-step">
                    <strong style="display:block;margin-bottom:8px;color:#1565C0">Como publicar para todos os visitantes:</strong>
                    <ol>
                        <li>Clique em <strong>"Baixar content.json"</strong> abaixo</li>
                        <li>Coloque o arquivo baixado na pasta:<br><code>lovisa-destinos-site/</code></li>
                        <li>Abra o terminal na pasta e rode:<br><code>git add . && git commit -m "Atualiza conteúdo" && git push</code></li>
                        <li>Aguarde ~30 segundos → site atualizado para todos! ✅</li>
                    </ol>
                </div>
                <button class="ld-download-btn" id="ld-dl">⬇️ Baixar content.json</button>
                <button class="ld-cancel" style="width:100%;text-align:center;" id="ld-c">Fechar</button>
            </div>`;
            p.querySelector('#ld-dl').onclick = () => this.save();
            p.querySelector('#ld-c').onclick = () => this.closePanel();
        },

        /* ── HELPERS ── */
        createPanel(title) {
            this.closePanel();
            const p = document.createElement('div');
            p.className = 'ld-panel';
            p.innerHTML = `<div class="ld-panel-header"><h3>${title}</h3><button class="ld-panel-close">✕</button></div>`;
            document.body.appendChild(p);
            p.querySelector('.ld-panel-close').onclick = () => this.closePanel();
            this.makeDraggable(p);
            this.panel = p;
            return p;
        },

        closePanel() {
            if (this.panel) { this.panel.remove(); this.panel = null; }
            document.querySelectorAll('.ld-panel').forEach(p => p.remove());
            document.querySelectorAll('.ld-selected').forEach(el => el.classList.remove('ld-selected'));
        },

        makeDraggable(el) {
            const h = el.querySelector('.ld-panel-header');
            let drag = false, ox = 0, oy = 0, sx = 0, sy = 0;
            h.onmousedown = e => { drag = true; sx = e.clientX; sy = e.clientY; ox = el.offsetLeft; oy = el.offsetTop; e.preventDefault(); };
            document.onmousemove = e => { if (!drag) return; el.style.left = ox + e.clientX - sx + 'px'; el.style.top = oy + e.clientY - sy + 'px'; };
            document.onmouseup = () => drag = false;
        },

        store(key, val) {
            cms[key] = val;
            localStorage.setItem(CMS_KEY, JSON.stringify(cms));
        },

        save() {
            localStorage.setItem(CMS_KEY, JSON.stringify(cms));
            const blob = new Blob([JSON.stringify(cms, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'content.json'; a.click();
            URL.revokeObjectURL(url);
            this.toast('✓ Salvo! Coloque o content.json na pasta do projeto e faça git push.');
        },

        exit() {
            if (confirm('Sair do modo editor?')) {
                sessionStorage.removeItem('editor_active');
                const url = new URL(location.href);
                url.searchParams.delete('editor');
                location.replace(url.toString());
            }
        },

        toast(msg) {
            document.querySelectorAll('.ld-toast').forEach(t => t.remove());
            const t = document.createElement('div');
            t.className = 'ld-toast'; t.textContent = msg;
            document.body.appendChild(t);
            requestAnimationFrame(() => { requestAnimationFrame(() => t.classList.add('show')); });
            setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 350); }, 3000);
        },

        toHex(rgb) {
            if (!rgb || rgb === 'transparent' || rgb.includes('rgba(0, 0, 0, 0)')) return '#ffffff';
            const m = rgb.match(/\d+/g);
            if (!m || m.length < 3) return '#ffffff';
            return '#' + m.slice(0, 3).map(n => (+n).toString(16).padStart(2, '0')).join('');
        },

        getColor(el) {
            return this.toHex(getComputedStyle(el).color);
        }
    };

    /* ─── INICIALIZAÇÃO ─────────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', () => {
        applyContent();
        if (editMode) {
            EDITOR.init();
        }
    });

    // Expõe para debug
    window.LD_CMS = { cms, applyContent, EDITOR };

})();
