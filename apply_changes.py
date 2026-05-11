"""
Apply all pending changes to index.html safely using Python (no encoding issues):
1. Replace GIF background with static Unsplash photo  
2. Replace old testimonials section with Google-style cards
"""

REPO = r'C:\Users\win 10\Desktop\vendas-de-sites\TEMPLATE-BASE'

with open(REPO + r'\index.html', encoding='utf-8') as f:
    html = f.read()

print(f"Loaded. Chars: {len(html)}")
print(f"Has GIF: {'giphy' in html}")
print(f"Has accents: {'Início' in html}")

# ── CHANGE 1: Replace GIF with static photo ──────────────────────────────────
OLD_HERO_CSS = """        .hero-bg {
            position: absolute; inset: 0;
            background: url('https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3EwZm5xdTMyc3hyanBxZHoxNmh0d3h4NWI4NGN5cHp3ZmJpYTZnNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/aZg5FJVAHdB3G/giphy.gif') center/cover no-repeat;
        }"""

NEW_HERO_CSS = """        .hero-bg {
            position: absolute; inset: 0;
            background: url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=85') center/cover no-repeat;
        }"""

if OLD_HERO_CSS in html:
    html = html.replace(OLD_HERO_CSS, NEW_HERO_CSS)
    print("✅ Hero CSS replaced")
else:
    # Try partial match
    import re
    html = re.sub(
        r"\.hero-bg \{\s*position: absolute; inset: 0;\s*background: url\('[^']*giphy[^']*'\) center/cover no-repeat;\s*\}",
        NEW_HERO_CSS.strip(),
        html
    )
    print("✅ Hero CSS replaced (regex)")

# Replace mobile GIF too
OLD_MOB_GIF = "url('https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExejVnMmRnM3pkejZvOGRsN2U1empwbXVvOXI0MTJqYXpqeGExNXZvZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/AErExHJVxRbkm5hPkB/giphy.gif')"
NEW_MOB_PHOTO = "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80')"
if OLD_MOB_GIF in html:
    html = html.replace(OLD_MOB_GIF, NEW_MOB_PHOTO)
    print("✅ Mobile hero replaced")

# ── CHANGE 2: Replace testimonials section ────────────────────────────────────
OLD_DEP_START = '<!-- ════════════ DEPOIMENTOS ════════════ -->'
NEW_DEP_SECTION = '''<!-- ════════════ DEPOIMENTOS — GOOGLE STYLE ════════════ -->
<section class="section dep-bg" id="depoimentos">
    <div class="container">
        <div class="dep-hdr rv">
            <span class="label" style="color:#1A73E8;">Avaliações do Google</span>
            <h2 class="h2" data-eid="dep-title" data-elabel="Título Depoimentos">O que nossos clientes dizem</h2>
            <p class="lead" data-eid="dep-sub" data-elabel="Subtítulo Depoimentos">Avaliações verificadas do Google Maps — 5.0 ⭐ com 25 avaliações reais</p>
            <a href="https://www.google.com/maps/place/Lovisa+Destinos/@-13.3722091,-73.1397804,4z/data=!4m8!3m7!1s0x496312acd36d9057:0xbe12502a7a172777!8m2!3d-14.4095262!4d-51.31668!9m1!1b1!16s%2Fg%2F11wtlj2xps" target="_blank" rel="noopener"
               style="display:inline-flex;align-items:center;gap:10px;background:#fff;border:1px solid #E8EAED;border-radius:50px;padding:10px 22px;margin-top:16px;color:#3C4043;font-size:13px;font-weight:600;text-decoration:none;box-shadow:0 1px 4px rgba(0,0,0,.1);transition:box-shadow .2s;"
               onmouseover="this.style.boxShadow=\'0 4px 12px rgba(0,0,0,.15)\'" onmouseout="this.style.boxShadow=\'0 1px 4px rgba(0,0,0,.1)\'">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/24px-Google_%22G%22_Logo.svg.png" alt="Google" style="width:20px;height:20px;display:inline;">
                <span style="color:#FBBC04;">★★★★★</span>
                <span><strong style="color:#202124;">5,0</strong> · 25 avaliações no Google Maps</span>
                <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:10px;color:#1A73E8;"></i>
            </a>
        </div>
        <div class="dep-grid" id="dep-grid">

            <div class="dep-card rv" data-dep-id="0">
                <div class="dep-header">
                    <div class="dep-user">
                        <div class="dep-av" style="background:#1565C0;">K</div>
                        <div>
                            <div class="dep-name" data-eid="dep-1-nome" data-elabel="Nome Depoimento 1">Kenia Patricia</div>
                            <div class="dep-dest" data-eid="dep-1-dest" data-elabel="Data Depoimento 1">há 1 ano</div>
                        </div>
                    </div>
                    <div class="dep-g-logo"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/24px-Google_%22G%22_Logo.svg.png" alt="Google"></div>
                </div>
                <div class="dep-stars">
                    <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                </div>
                <p class="dep-text" data-eid="dep-1-text" data-elabel="Depoimento 1">"Foi minha primeira experiência viajando de avião, nunca tinha entrado no aeroporto, nunca tinha alugado carro nem nada do tipo. Graças aos serviços oferecidos foi tudo bem fácil. Obrigada Lovisa, tive uma ótima experiência. Já vou planejar a próxima viagem."</p>
                <a href="https://www.google.com/maps/place/Lovisa+Destinos" target="_blank" class="dep-link"><i class="fa-brands fa-google" style="font-size:11px;"></i> Ver no Google</a>
            </div>

            <div class="dep-card rv" data-dep-id="1">
                <div class="dep-header">
                    <div class="dep-user">
                        <div class="dep-av" style="background:#EA4335;">B</div>
                        <div>
                            <div class="dep-name" data-eid="dep-2-nome" data-elabel="Nome Depoimento 2">Beatriz dos Santos Andrade</div>
                            <div class="dep-dest" data-eid="dep-2-dest" data-elabel="Data Depoimento 2">5 meses atrás</div>
                        </div>
                    </div>
                    <div class="dep-g-logo"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/24px-Google_%22G%22_Logo.svg.png" alt="Google"></div>
                </div>
                <div class="dep-stars">
                    <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                </div>
                <p class="dep-text" data-eid="dep-2-text" data-elabel="Depoimento 2">"Viagem impecável, com tudo organizado pela Lovisa. Desde as passagens, check in, transfer, hotel e passeios. Tudo perfeito!"</p>
                <a href="https://www.google.com/maps/place/Lovisa+Destinos" target="_blank" class="dep-link"><i class="fa-brands fa-google" style="font-size:11px;"></i> Ver no Google</a>
            </div>

            <div class="dep-card rv" data-dep-id="2">
                <div class="dep-header">
                    <div class="dep-user">
                        <div class="dep-av" style="background:#34A853;">M</div>
                        <div>
                            <div class="dep-name" data-eid="dep-3-nome" data-elabel="Nome Depoimento 3">Marina Fernandes</div>
                            <div class="dep-dest" data-eid="dep-3-dest" data-elabel="Data Depoimento 3">2 meses atrás</div>
                        </div>
                    </div>
                    <div class="dep-g-logo"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/24px-Google_%22G%22_Logo.svg.png" alt="Google"></div>
                </div>
                <div class="dep-stars">
                    <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                </div>
                <p class="dep-text" data-eid="dep-3-text" data-elabel="Depoimento 3">"Minha primeira viagem de avião: Piracicaba SP/Porto Seguro BA. Tive uma guia perfeita com a Lovisa — foi super atenciosa, prestativa e me orientou em tudo, explicando em detalhes com clareza."</p>
                <a href="https://www.google.com/maps/place/Lovisa+Destinos" target="_blank" class="dep-link"><i class="fa-brands fa-google" style="font-size:11px;"></i> Ver no Google</a>
            </div>

            <div class="dep-card rv" data-dep-id="3">
                <div class="dep-header">
                    <div class="dep-user">
                        <div class="dep-av" style="background:#FBBC04;color:#202124;">M</div>
                        <div>
                            <div class="dep-name" data-eid="dep-4-nome" data-elabel="Nome Depoimento 4">Marisa Weber</div>
                            <div class="dep-dest" data-eid="dep-4-dest" data-elabel="Data Depoimento 4">6 meses atrás</div>
                        </div>
                    </div>
                    <div class="dep-g-logo"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/24px-Google_%22G%22_Logo.svg.png" alt="Google"></div>
                </div>
                <div class="dep-stars">
                    <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                </div>
                <p class="dep-text" data-eid="dep-4-text" data-elabel="Depoimento 4">"Fui muito bem atendida, me auxiliaram todo tempo da viagem. Com certeza recomendo e minhas próximas viagens serão programadas com a Lovisa e minha atendente maravilhosa Vânia."</p>
                <a href="https://www.google.com/maps/place/Lovisa+Destinos" target="_blank" class="dep-link"><i class="fa-brands fa-google" style="font-size:11px;"></i> Ver no Google</a>
            </div>

            <div class="dep-card rv" data-dep-id="4">
                <div class="dep-header">
                    <div class="dep-user">
                        <div class="dep-av" style="background:#1565C0;">S</div>
                        <div>
                            <div class="dep-name" data-eid="dep-5-nome" data-elabel="Nome Depoimento 5">Sebastião da Silva</div>
                            <div class="dep-dest" data-eid="dep-5-dest" data-elabel="Data Depoimento 5">6 meses atrás</div>
                        </div>
                    </div>
                    <div class="dep-g-logo"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/24px-Google_%22G%22_Logo.svg.png" alt="Google"></div>
                </div>
                <div class="dep-stars">
                    <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                </div>
                <p class="dep-text" data-eid="dep-5-text" data-elabel="Depoimento 5">"Viagem maravilhosa. Foi top demais, hospedagem top. Recomendo a todos que querem viajar com segurança e conforto!"</p>
                <a href="https://www.google.com/maps/place/Lovisa+Destinos" target="_blank" class="dep-link"><i class="fa-brands fa-google" style="font-size:11px;"></i> Ver no Google</a>
            </div>

            <div class="dep-card rv" data-dep-id="5">
                <div class="dep-header">
                    <div class="dep-user">
                        <div class="dep-av" style="background:#EA4335;">E</div>
                        <div>
                            <div class="dep-name" data-eid="dep-6-nome" data-elabel="Nome Depoimento 6">Elias Paixao</div>
                            <div class="dep-dest" data-eid="dep-6-dest" data-elabel="Data Depoimento 6">11 meses atrás</div>
                        </div>
                    </div>
                    <div class="dep-g-logo"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/24px-Google_%22G%22_Logo.svg.png" alt="Google"></div>
                </div>
                <div class="dep-stars">
                    <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                </div>
                <p class="dep-text" data-eid="dep-6-text" data-elabel="Depoimento 6">"Bom dia. Gostei muito, deu suporte durante toda a viagem. Super indico a Lovisa Destinos para quem quer viajar tranquilo e bem assistido."</p>
                <a href="https://www.google.com/maps/place/Lovisa+Destinos" target="_blank" class="dep-link"><i class="fa-brands fa-google" style="font-size:11px;"></i> Ver no Google</a>
            </div>

        </div>
        <div id="dep-add-btn" style="display:none;text-align:center;margin-top:28px;">
            <button onclick="addDepoimento()" style="padding:12px 28px;background:#1A73E8;color:#fff;border:none;border-radius:50px;font-size:14px;font-weight:700;cursor:pointer;">+ Adicionar Avaliação</button>
        </div>
    </div>
</section>'''

# Find the old section
old_dep_start_idx = html.find(OLD_DEP_START)
if old_dep_start_idx < 0:
    print("ERROR: Could not find old depoimentos section!")
else:
    # Find the closing tag after this section
    # The section ends with </section> followed by <!-- CONTATO
    contato_comment = '<!-- ════════════ CONTATO ════════════ -->'
    old_dep_end_idx = html.find(contato_comment, old_dep_start_idx)
    if old_dep_end_idx < 0:
        print("ERROR: Could not find CONTATO comment!")
    else:
        old_dep_block = html[old_dep_start_idx:old_dep_end_idx]
        print(f"Old dep block length: {len(old_dep_block)}")
        html = html[:old_dep_start_idx] + NEW_DEP_SECTION + '\n\n' + html[old_dep_end_idx:]
        print("✅ Testimonials section replaced")

# ── CHANGE 3: Update testimonials CSS ─────────────────────────────────────────
OLD_DEP_CSS_START = '        /* ══════════════════════════════════════\n           DEPOIMENTOS\n        ══════════════════════════════════════ */\n        .dep-bg { background: var(--navy-dark); }'
NEW_DEP_CSS_START = '''        /* ══════════════════════════════════════
           DEPOIMENTOS — GOOGLE STYLE
        ══════════════════════════════════════ */
        .dep-bg { background: #F1F3F4; }'''

if OLD_DEP_CSS_START in html:
    html = html.replace(OLD_DEP_CSS_START, NEW_DEP_CSS_START, 1)
    print("✅ Dep CSS background replaced")

# Replace old dep-grid (dark nav)
OLD_DEP_GRID_CSS = '        .dep-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }'
NEW_DEP_GRID_CSS = '        .dep-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }'
if OLD_DEP_GRID_CSS in html:
    html = html.replace(OLD_DEP_GRID_CSS, NEW_DEP_GRID_CSS, 1)
    print("✅ Grid gap replaced")

# Replace h2 color
OLD_HDR_H2 = '        .dep-hdr .h2 { color: #fff; }'
NEW_HDR_H2 = '        .dep-hdr .h2 { color: var(--navy); }'
if OLD_HDR_H2 in html:
    html = html.replace(OLD_HDR_H2, NEW_HDR_H2, 1)
    print("✅ H2 color replaced")

# Replace lead color
OLD_LEAD = '        .dep-hdr .lead { color: rgba(255,255,255,.56); max-width: 480px; margin: 0 auto; }'
NEW_LEAD = '        .dep-hdr .lead { color: var(--muted); max-width: 520px; margin: 0 auto; }'
if OLD_LEAD in html:
    html = html.replace(OLD_LEAD, NEW_LEAD, 1)
    print("✅ Lead color replaced")

# Replace old card styles with Google card styles
OLD_CARD_CSS = '''        .dep-card {
            background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
            border-radius: var(--r); padding: 32px; transition: all .3s;
        }
        .dep-card:hover { background: rgba(255,255,255,.1); border-color: var(--accent); }
        .dep-stars { color: var(--gold); font-size: 13px; margin-bottom: 16px; }
        .dep-text  { font-size: 14px; color: rgba(255,255,255,.78); line-height: 1.75; margin-bottom: 24px; font-style: italic; }
        .dep-author { display: flex; align-items: center; gap: 12px; }
        .dep-av { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 2px solid var(--accent); flex-shrink: 0; }
        .dep-av img { width: 100%; height: 100%; object-fit: cover; aspect-ratio: 1; }
        .dep-name { font-size: 13px; font-weight: 700; color: #fff; }
        .dep-dest { font-size: 12px; color: rgba(255,255,255,.45); margin-top: 2px; }'''

NEW_CARD_CSS = '''        /* Google Review Card */
        .dep-card {
            background: #fff;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 1px 4px rgba(0,0,0,.12), 0 2px 8px rgba(0,0,0,.06);
            transition: box-shadow .25s, transform .25s;
            display: flex; flex-direction: column; gap: 12px;
        }
        .dep-card:hover { box-shadow: 0 4px 18px rgba(0,0,0,.16); transform: translateY(-3px); }
        .dep-header { display: flex; align-items: center; justify-content: space-between; }
        .dep-user { display: flex; align-items: center; gap: 10px; }
        .dep-av {
            width: 40px; height: 40px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 16px; font-weight: 700; color: #fff;
            flex-shrink: 0; overflow: hidden;
        }
        .dep-av img { width: 100%; height: 100%; object-fit: cover; }
        .dep-name { font-size: 14px; font-weight: 600; color: #202124; }
        .dep-dest { font-size: 12px; color: #70757A; margin-top: 1px; }
        .dep-g-logo { flex-shrink: 0; }
        .dep-g-logo img { width: 20px; height: 20px; display: block; }
        .dep-stars { display: flex; align-items: center; gap: 2px; }
        .dep-stars i { color: #FBBC04; font-size: 14px; }
        .dep-text { font-size: 13.5px; color: #3C4043; line-height: 1.65; flex: 1; }
        .dep-link { font-size: 12px; color: #1A73E8; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; text-decoration: none; }
        .dep-link:hover { text-decoration: underline; }
        /* editor: remover card */
        .ld-remove-card { display:none; position:absolute; top:8px; right:8px; width:26px; height:26px; border-radius:50%; background:#ef4444; border:none; color:#fff; font-size:13px; cursor:pointer; align-items:center; justify-content:center; z-index:10; }
        .ld-remove-card:hover { background:#dc2626; }
        body.ld-on .dep-card { position:relative; }
        body.ld-on .ld-remove-card { display:flex; }
        body.ld-on .card-link-wrap { position:relative; }
        body.ld-on .ld-remove-pkg { display:flex; }
        .ld-remove-pkg { display:none; position:absolute; top:10px; right:10px; background:#ef4444; color:#fff; border:none; border-radius:50px; padding:5px 12px; font-size:11px; font-weight:700; cursor:pointer; z-index:20; align-items:center; gap:5px; }
        .ld-remove-pkg:hover { background:#dc2626; }'''

if OLD_CARD_CSS in html:
    html = html.replace(OLD_CARD_CSS, NEW_CARD_CSS, 1)
    print("✅ Card CSS replaced with Google style")
else:
    print("WARNING: Could not find old card CSS exactly")

# ── VERIFY & SAVE ─────────────────────────────────────────────────────────────
print(f"\nFinal checks:")
print(f"  Has GIF: {'giphy' in html}")
print(f"  Has Início: {'Início' in html}")
print(f"  Has dep-card Google style: {'dep-header' in html}")
print(f"  Has dep-g-logo: {'dep-g-logo' in html}")
print(f"  Has static photo hero: {'unsplash.com/photo-1469854523086' in html}")
print(f"  Total chars: {len(html)}")

with open(REPO + r'\index.html', 'w', encoding='utf-8', newline='\n') as f:
    f.write(html)
print("\n✅ index.html saved cleanly!")
