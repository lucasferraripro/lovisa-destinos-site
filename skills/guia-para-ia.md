# Guia Completo para IA Assistente — Lovisa Destinos

Este arquivo é o ponto de entrada para qualquer IA que for trabalhar neste projeto.
Leia este arquivo inteiro antes de fazer qualquer alteração.

---

## 1. Visão Geral do Projeto

**O que é:** Site de vendas de uma agência de viagens chamada **Lovisa Destinos**.

**Tecnologia:** HTML5 + CSS3 + JavaScript vanilla puro. Sem frameworks, sem build, sem node_modules.

**Deploy:** Hospedado no Vercel em https://lovisa-destinos.vercel.app

**Repositório:** https://github.com/lucasferraripro/lovisa-destinos-site

---

## 2. Estrutura de Arquivos e Diretórios

```
lovisa-destinos-site/               ← RAIZ DO PROJETO
│
├── index.html                      ← Página principal (HOME)
├── sobre.html                      ← Página institucional (SOBRE NÓS)
├── pacote.html                     ← Página de detalhes de pacote (DINÂMICA)
├── logo.png                        ← Logo da empresa (PNG transparente)
│
├── README.md                       ← Visão geral do projeto
├── EMPRESA.md                      ← Dados da empresa (contatos, links, serviços)
├── DESIGN-SYSTEM.md                ← Cores, fontes, componentes visuais
├── COMO-EDITAR.md                  ← Guia de edição humana e para IA
│
└── skills/                         ← Instruções de tarefas específicas
    ├── guia-para-ia.md             ← ESTE ARQUIVO
    ├── adicionar-pacote.md         ← Como adicionar novo destino
    ├── mudar-cores.md              ← Como trocar paleta de cores
    ├── atualizar-contato.md        ← Como atualizar dados de contato
    ├── adicionar-pagina.md         ← Como criar nova página
    └── fazer-deploy.md             ← Como publicar atualizações
```

**Caminho local no Windows:**
```
C:\Users\win 10\Desktop\lovisa-destinos-site\
```

---

## 3. Dados da Empresa (resumo rápido)

| Campo | Valor |
|-------|-------|
| Nome | Lovisa Destinos |
| WhatsApp | 5519995396281 |
| WhatsApp display | (19) 99539-6281 |
| Grupo VIP | https://chat.whatsapp.com/H2DpRM8lAtnGrNjwWWcFVj |
| Instagram | https://www.instagram.com/lovisadestinos |
| E-mail | contato@lovisadestinos.com.br |
| Parceria | CVC (parceira oficial) |
| Especialidade | Viagens de lazer & corporativas |

> Dados completos: ver `EMPRESA.md`

---

## 4. Anatomia do index.html

O arquivo tem ~960 linhas. Estrutura em ordem:

```
Linhas 1-12:    <head> — meta tags, favicon, fontes, Font Awesome
Linhas 13-498:  <style> — TODO o CSS do site
Linhas 499-527: <header> — logo + navegação desktop + botão WhatsApp
Linhas 528-542: Menu mobile (panel)
Linhas 543-586: <section id="home"> — Hero (fundo com imagem, título, CTAs)
Linhas 587-610: <section class="stats"> — Barra de números (5+ anos, 3k+ clientes...)
Linhas 611-650: <section id="como-funciona"> — 3 passos do processo
Linhas 651-750: <section id="destinos"> — Grid de cards de destinos (6 cards)
Linhas 751-800: <section id="diferenciais"> — Foto + 4 diferenciais
Linhas 801-840: <section id="depoimentos"> — 3 depoimentos de clientes
Linhas 841-870: <section id="contato"> — Formulário + info de contato
Linhas 871-915: <footer> — Links, social, copyright, botão grupo VIP
Linhas 915:     <a class="wa"> — Botão flutuante WhatsApp
Linhas 917-956: <script> — Header scroll, menu mobile, formulário WhatsApp
```

---

## 5. Anatomia do pacote.html

O arquivo tem ~840 linhas. Estrutura:

```
Linhas 1-12:    <head> — meta tags, favicon, fontes
Linhas 13-230:  <script> — BANCO DE DADOS (SITE + DB) + função render()
Linhas 231-415: <style> — CSS completo da página
Linhas 416-430: <header> — logo + navegação
Linhas 431-540: <main> — conteúdo dinâmico (preenchido pelo JS)
Linhas 541-600: <footer> — links, social, grupo VIP
Linhas 601-840: <script> — galeria de imagens, JS de inicialização
```

### Como o banco de dados funciona (CRÍTICO):

```javascript
const SITE = {
    nome:     'Lovisa Destinos',
    whatsapp: '5519995396281',
    email:    'contato@lovisadestinos.com.br',
    tel:      '(19) 99539-6281'
};

const DB = {
    noronha:  { title, subtitle, location, duration, price, parcelas, flag, images[3], desc, inc[], ninc[], days[] },
    maldivas: { ... },
    paris:    { ... },
    amalfi:   { ... },
    santorini:{ ... },
    dubai:    { ... }
};
```

**IDs de pacotes ativos:** `noronha`, `maldivas`, `paris`, `amalfi`, `santorini`, `dubai`

A função `render(id)` lê `DB[id]` e preenche o HTML da página dinamicamente.
A URL `pacote.html?id=noronha` aciona `render('noronha')` automaticamente.

---

## 6. Anatomia do sobre.html

Arquivo mais simples (~85 linhas). Estrutura:

```
Linhas 1-43:    <head> — meta, favicon, fontes, CSS inline
Linhas 44-48:   <header> — logo + botão WhatsApp
Linhas 49-54:   Hero azul escuro — título "Sobre a Lovisa Destinos"
Linhas 55-67:   Seção content — texto da história + foto
Linhas 68-78:   Seção stats — 4 números (5+, 3k+, 50+, 100%)
Linhas 79-84:   CTAs — botão WhatsApp + botão Grupo VIP
Linhas 80-86:   <footer> — copyright + links
Linhas 87:      <a class="wa-float"> — botão flutuante WhatsApp
```

---

## 7. Sistema de Cores — Onde alterar

Cada arquivo tem seu próprio `:root` com as variáveis. São **idênticas** nos 3 arquivos (index e pacote) e ligeiramente diferentes no sobre.html (nomes diferentes, mesmos valores).

### index.html e pacote.html:
```css
:root {
    --navy:      #1565C0;
    --navy-dark: #0D47A1;
    --accent:    #F97316;
    --accent-d:  #EA6C0A;
    --gold:      #F97316;
    --text:      #1A1F2E;
    --muted:     #6B7280;
    --bg:        #F8F9FC;
    --white:     #FFFFFF;
    --border:    #E5E9F2;
    --wa:        #25D366;
}
```

### sobre.html (variáveis com nomes diferentes):
```css
:root {
    --primary:      #1565C0;   /* = --navy */
    --primary-dark: #0D47A1;   /* = --navy-dark */
    --accent:       #F97316;   /* = --accent */
    --wa:           #25D366;
}
```

---

## 8. Logo — Como está referenciada

A logo (`logo.png`) está na **raiz do projeto** e é referenciada com caminho relativo:

| Contexto | Código HTML |
|----------|-------------|
| Header (fundo claro/transparente) | `<img src="logo.png" alt="Lovisa Destinos" style="height:46px;width:auto;object-fit:contain;">` |
| Footer (fundo azul escuro) | `<img src="logo.png" ... style="filter:brightness(0) invert(1);">` — o filtro deixa branca |
| Favicon | `<link rel="icon" href="logo.png" type="image/png">` |

---

## 9. Formulário de WhatsApp — Como funciona

No `index.html`, o formulário (seção `#contato`) coleta os dados e monta uma mensagem no JavaScript:

```javascript
// Campos: nome, email, whats, origem, destino, ida, volta, adultos, criancas, idades
const linhas = [
    `*Novo Orçamento — Lovisa Destinos*`,
    `• *Nome:* ${nome}`,
    `• *WhatsApp:* ${whats}`,
    // ... etc
];
const url = `https://wa.me/5519995396281?text=${encodeURIComponent(linhas.join('\n'))}`;
window.open(url, '_blank');
```

**Para mudar o número:** substituir `5519995396281` neste script.
**Para adicionar campos:** adicionar `<input>` no HTML + capturar o valor no JS + adicionar na lista `linhas`.

---

## 10. Dependências Externas (CDN)

O site depende dessas URLs externas — se ficarem offline, partes do visual quebram:

| Recurso | URL |
|---------|-----|
| Font Awesome (ícones) | `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css` |
| Google Fonts (Playfair Display) | `https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700` |
| Imagens de destinos | URLs do Unsplash (dentro do DB em pacote.html) |
| Foto da seção diferenciais | URL externa (sonhoreal.tur.br ou Unsplash) |

---

## 11. O que NÃO fazer

- Não mover `logo.png` para uma subpasta sem atualizar todos os `src="logo.png"` nos 3 HTMLs
- Não remover o `<script>` do início de `pacote.html` — é o banco de dados dos pacotes
- Não mudar a cor `--wa: #25D366` — é a cor padrão do WhatsApp
- Não adicionar `node_modules`, `package.json` ou qualquer dependência local — site é HTML puro
- Não renomear `pacote.html` — os links dos cards apontam para esse nome exato

---

## 12. Fluxo de Deploy após edições

```bash
cd "C:\Users\win 10\Desktop\lovisa-destinos-site"
git add .
git commit -m "descrição da mudança"
git push
# Vercel atualiza automaticamente em ~30s
```

Site ao vivo: https://lovisa-destinos.vercel.app
GitHub: https://github.com/lucasferraripro/lovisa-destinos-site
