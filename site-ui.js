/* Lovisa Destinos — melhorias de interface (carrosséis no celular, barra fixa, destinos do formulário) */
(function () {
    'use strict';
    var mq = window.matchMedia('(max-width: 768px)');

    /* ── Carrossel de deslizar (celular): pontinhos que acompanham o dedo ── */
    function setupCarousel(track) {
        if (track.dataset.mcReady) return;
        track.dataset.mcReady = '1';
        var dots = document.createElement('div');
        dots.className = 'mc-dots';
        dots.setAttribute('aria-hidden', 'true');
        track.insertAdjacentElement('afterend', dots);

        function items() {
            return Array.prototype.filter.call(track.children, function (el) {
                return el.offsetParent !== null && getComputedStyle(el).display !== 'none';
            });
        }
        function build() {
            var list = items();
            dots.innerHTML = '';
            if (list.length < 2) return;
            list.forEach(function (el, i) {
                var b = document.createElement('button');
                b.type = 'button';
                b.tabIndex = -1;
                b.addEventListener('click', function () {
                    track.scrollTo({ left: el.offsetLeft - track.offsetLeft - 16, behavior: 'smooth' });
                });
                dots.appendChild(b);
            });
            sync();
        }
        function sync() {
            var list = items();
            if (!list.length) return;
            var w = list[0].getBoundingClientRect().width + 14;
            var idx = Math.round(track.scrollLeft / w);
            Array.prototype.forEach.call(dots.children, function (d, i) { d.classList.toggle('on', i === idx); });
        }
        var t;
        track.addEventListener('scroll', function () { cancelAnimationFrame(t); t = requestAnimationFrame(sync); }, { passive: true });
        new MutationObserver(function () { build(); }).observe(track, { childList: true });
        window.addEventListener('resize', build);
        build();
    }
    document.querySelectorAll('.m-carousel').forEach(setupCarousel);

    /* ── Faixa de números: esconde itens deixados em branco no editor ── */
    var stats = document.querySelector('.stats-grid');
    function tidyStats() {
        if (!stats || document.body.classList.contains('ld-on')) return;
        var shown = 0;
        stats.querySelectorAll('.stat').forEach(function (s) {
            var n = s.querySelector('.stat-n');
            var empty = !n || !n.textContent.replace(/\s| /g, '');
            s.style.display = empty ? 'none' : '';
            if (!empty) shown++;
        });
        stats.style.gridTemplateColumns = (!mq.matches && shown) ? 'repeat(' + shown + ',1fr)' : '';
        stats.classList.toggle('stats-odd', shown % 2 === 1);
    }
    if (stats) {
        tidyStats();
        new MutationObserver(tidyStats).observe(stats, { childList: true, subtree: true, characterData: true });
        mq.addEventListener ? mq.addEventListener('change', tidyStats) : mq.addListener(tidyStats);
    }

    /* ── Barra fixa "Pedir cotação" no celular ── */
    var bar = document.getElementById('m-cta');
    if (bar) {
        var contato = document.getElementById('contato');
        var inContact = false;
        if (contato && 'IntersectionObserver' in window) {
            new IntersectionObserver(function (e) { inContact = e[0].isIntersecting; update(); }, { threshold: 0.15 }).observe(contato);
        }
        function update() { bar.classList.toggle('show', window.scrollY > 420 && !inContact); }
        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    /* ── Formulário: lista de destinos = pacotes publicados no site ── */
    var sel = document.getElementById('f-destino');
    var grid = document.getElementById('dest-grid');
    function fillDestinos() {
        if (!sel || !grid) return;
        var current = sel.value;
        var names = [];
        grid.querySelectorAll('.card-link h3').forEach(function (h) {
            var wrap = h.closest('.card-link-wrap, .card-link');
            if (wrap && getComputedStyle(wrap).display === 'none') return;
            var n = (h.textContent || '').trim();
            if (n && names.indexOf(n) === -1) names.push(n);
        });
        sel.innerHTML = '';
        var first = new Option('Selecione…', '');
        sel.appendChild(first);
        names.forEach(function (n) { sel.appendChild(new Option(n, n)); });
        sel.appendChild(new Option('Outro destino / ainda não sei', 'Outro destino'));
        if (current) sel.value = current;
    }
    if (sel && grid) {
        fillDestinos();
        var ft;
        new MutationObserver(function () { clearTimeout(ft); ft = setTimeout(fillDestinos, 120); }).observe(grid, { childList: true, subtree: true, characterData: true });
        // Clique em "Pedir cotação" dentro de um card pré-seleciona o destino
        var pre = new URLSearchParams(location.search).get('destino');
        if (pre) setTimeout(function () { sel.value = pre; }, 600);
    }
})();

/* Fotos 2 e 3 do topo: só depois que a página terminou de carregar (site mais leve) */
(function () {
    function ready() { var h = document.querySelector('.hero-bg'); if (h) h.classList.add('ready'); }
    if (document.readyState === 'complete') setTimeout(ready, 1200);
    else window.addEventListener('load', function () { setTimeout(ready, 1200); });
})();
