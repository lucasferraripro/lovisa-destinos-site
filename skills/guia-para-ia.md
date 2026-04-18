# Guia Completo para IA Assistente — Lovisa Destinos

Este arquivo é o ponto de entrada para qualquer IA que for trabalhar neste projeto.
Leia este arquivo inteiro antes de fazer qualquer alteração.

---

## 1. Visão Geral do Projeto

**O que é:** Site de vendas de uma agência de viagens chamada **Lovisa Destinos**, com um sistema de edição visual completo (CMS) que permite editar textos, imagens, cores e links diretamente no site.

**Tecnologia:** HTML5 + CSS3 + JavaScript vanilla puro. Sem frameworks, sem build, sem node_modules.

**Deploy:** Hospedado no Vercel em https://lovisa-destinos.vercel.app

**Repositório:** https://github.com/lucasferraripro/lovisa-destinos-site

---

## 2. Estrutura de Arquivos e Diretórios

```
lovisa-destinos-site/               ← RAIZ DO PROJETO
│
├── index.html                      ← Página principal (HOME) — tem editor.js
├── sobre.html                      ← Página institucional (SOBRE NÓS)
├── pacote.html                     ← Página de detalhes de pacote (DINÂMICA)
├── clientes.html                   ← Página de clientes
├── logo.png                        ← Logo da empresa (PNG transparente)
├── content.json                    ← CMS: conteúdo editável salvo (chave=data-eid)
├── editor.js                       ← Editor visual completo (incluso nos HTML pages)
├── vercel.json                     ← Configuração de rotas Vercel
│
├── README.md                       ← Visão geral do projeto
├── EMPRESA.md                      ← Dados da empresa (contatos, links, serviços)
├── COMO-EDITAR.md                  ← Guia de edição humana e para IA
│
├── admin/
│   └── login.html                  ← Tela de login do editor (acesso restrito)
│
├── api/
│   ├── auth.js                     ← POST /api/auth — valida senha admin
│   ├── content.js                  ← GET  /api/content — retorna content.json sem cache
│   ├── publish.js                  ← POST /api/publish — commita content.json no GitHub
│   └── upload.js                   ← POST /api/upload — faz upload de imagem no GitHub
│
├── imagens/
│   └── uploads/                    ← Imagens enviadas via editor (auto-criada)
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

## 4. ⚠️ VARIÁVEIS DE AMBIENTE — OBRIGATÓRIO PARA O EDITOR FUNCIONAR

O editor depende de duas variáveis configuradas no Vercel. **Sem elas o login falhará e o conteúdo não será salvo.**

| Variável | Valor | Onde usar |
|----------|-------|-----------|
| `ADMIN_SECRET` | `Lovisa@2025` | Senha do painel de edição |
| `GITHUB_TOKEN` | Token pessoal do GitHub com permissão `repo` | Leitura e escrita do content.json |

**Como configurar no Vercel:**
1. Acesse o projeto em https://vercel.com → Settings → Environment Variables
2. Adicione `ADMIN_SECRET` com o valor `Lovisa@2025`
3. Adicione `GITHUB_TOKEN` com um Personal Access Token do GitHub
4. Faça um redeploy para que as variáveis tenham efeito

**Fallback:** Se `ADMIN_SECRET` não estiver no Vercel, o código usa `'Lovisa@2025'` como padrão (ver `api/auth.js` linha 26 e `api/publish.js` linha 33). O `GITHUB_TOKEN` **não tem fallback** — sem ele, `/api/content` retorna `{}` vazio e `/api/publish` falha.

---

## 5. Sistema do Editor Visual (CMS)

### 5.1 Como funciona (visão geral)

```
[Visitante acessa /admin/login.html]
        ↓
[Digite email: admin@lovisadestinos.com.br + senha]
        ↓
[POST /api/auth — verifica senha contra ADMIN_SECRET]
        ↓ (se correto)
[Salva em sessionStorage: lovisa_auth + lovisa_secret]
[Redireciona para index.html?editor=1]
        ↓
[editor.js detecta ?editor=1 + sessão válida → ativa modo edição]
        ↓
[GET /api/content → busca content.json do GitHub (sem cache)]
[Aplica conteúdo salvo em todos os [data-eid]]
[Injeta barra de edição no topo da página]
        ↓
[Usuário clica em elemento laranja (data-eid) → abre painel de edição]
[Edição salva em localStorage como rascunho (chave: lovisa_cms_v3)]
        ↓
[Usuário clica "Publicar" → POST /api/publish]
[API commita content.json no GitHub → Vercel deploya em ~30s]
```

### 5.2 Arquivos do Editor

| Arquivo | Função |
|---------|--------|
| `editor.js` | Script principal do editor — injetado nas páginas HTML |
| `admin/login.html` | Tela de login (email + senha → valida via /api/auth) |
| `api/auth.js` | Valida senha. Compara `req.body.secret` com `ADMIN_SECRET` |
| `api/content.js` | Retorna content.json do GitHub sempre atualizado (sem cache CDN) |
| `api/publish.js` | Recebe conteúdo editado + senha → commita no GitHub |
| `api/upload.js` | Recebe imagem em base64 + senha → salva em `imagens/uploads/` no GitHub |
| `content.json` | Banco de dados do CMS: `{ "data-eid": { html, src, href, style } }` |

### 5.3 Como incluir o editor em um HTML

Todo arquivo HTML que deve ter edição visual precisa desta linha **antes do `</body>`**:

```html
<script src="editor.js"></script>
```

Em subpastas (ex: uma futura página em `/destinos/page.html`), ajuste o caminho relativo:
```html
<script src="../editor.js"></script>
```

### 5.4 Sistema data-eid — Como marcar elementos editáveis

Qualquer elemento HTML que deve ser editável **pelo editor visual** precisa de dois atributos:

```html
data-eid="chave-unica"       ← identificador único (snake-case, sem espaços)
data-elabel="Nome Legível"   ← nome que aparece no tooltip e no painel de edição
```

**Exemplos reais do projeto:**

```html
<!-- Texto editável -->
<h1 data-eid="hero-title" data-elabel="Título Principal">
    Viagens que <em>transformam</em> para sempre
</h1>

<!-- Imagem editável -->
<img src="https://..." data-eid="card1-img" data-elabel="Foto Lençóis">

<!-- Botão/link editável -->
<a href="https://wa.me/5519995396281" data-eid="btn-whatsapp" data-elabel="Botão WhatsApp">
    Falar no WhatsApp
</a>
```

**Regras:**
- `data-eid` deve ser **único em todo o projeto** — dois elementos com o mesmo `data-eid` recebem o mesmo conteúdo
- Use hífens: `hero-title`, `card1-img`, `footer-phone` (nunca espaços ou underscores)
- O editor detecta o tipo automaticamente: `<img>` abre painel de imagem, `<a>` abre painel de link, qualquer outro abre painel de texto

### 5.5 Estrutura do content.json

O `content.json` armazena as edições feitas pelo CMS. Cada chave é um `data-eid`:

```json
{
  "hero-title": {
    "html": "Viagens que <em>transformam</em> para sempre"
  },
  "card1-img": {
    "src": "https://raw.githubusercontent.com/lucasferraripro/lovisa-destinos-site/master/imagens/uploads/123456_foto.jpg"
  },
  "btn-whatsapp": {
    "html": "Falar no WhatsApp",
    "href": "https://wa.me/5519995396281",
    "target": "_blank"
  },
  "hero-title": {
    "html": "Novo título aqui",
    "style": { "color": "#ff0000", "fontSize": "32px" }
  },
  "colors": {
    "--primary": "#1565C0",
    "--primary-dark": "#0D47A1",
    "--accent": "#F97316",
    "--text-dark": "#1A1F2E",
    "--wa": "#25D366"
  },
  "whatsapp": "5519995396281"
}
```

**Campos possíveis por tipo:**
| Tipo | Campos |
|------|--------|
| Texto | `html` (innerHTML), `style` (objeto CSS) |
| Imagem | `src` (URL da imagem) |
| Link/botão | `html`, `href`, `target`, `style` |
| Cores | objeto em `colors` com variáveis CSS |
| WhatsApp | número em `whatsapp` (string só dígitos) |

### 5.6 Storage do Editor (sessionStorage / localStorage)

| Storage | Chave | Conteúdo |
|---------|-------|---------|
| `sessionStorage` | `lovisa_auth` | JSON: `{email, ts, expires}` — sessão de login (8h) |
| `sessionStorage` | `lovisa_secret` | Senha digitada — usada para publicar |
| `sessionStorage` | `editor_active` | `"1"` quando editor está ativo |
| `localStorage` | `lovisa_cms_v3` | Rascunho das edições não publicadas |
| `localStorage` | `lovisa_last_pub` | Data/hora da última publicação |

### 5.7 Login — Detalhes técnicos

```javascript
// Email aceito (hardcoded no login.html linha 124):
email === 'admin@lovisadestinos.com.br'

// Senha: qualquer valor. Validada via POST /api/auth
// Se ADMIN_SECRET não estiver no Vercel, o fallback é: 'Lovisa@2025'
```

---

## 6. Anatomia do index.html

O arquivo tem ~1090 linhas. Estrutura em ordem:

```
Linhas 1-12:    <head> — meta tags, favicon, fontes, Font Awesome
Linhas 13-498:  <style> — TODO o CSS do site
Linhas 499-527: <header> — logo + navegação desktop + botão WhatsApp
Linhas 528-542: Menu mobile (panel)
Linhas 543-586: <section id="home"> — Hero (fundo com imagem, título, CTAs)
Linhas 587-610: <section class="stats"> — Barra de números (12+ anos, 15k+...)
Linhas 611-650: <section id="como-funciona"> — 3 passos do processo
Linhas 651-750: <section id="destinos"> — Grid de cards de destinos (6 cards)
Linhas 751-800: <section id="diferenciais"> — Foto + 4 diferenciais
Linhas 801-840: <section id="depoimentos"> — 3 depoimentos de clientes
Linhas 841-870: <section id="contato"> — Formulário + info de contato
Linhas 871-915: <footer> — Links, social, copyright, botão grupo VIP
Linhas 915:     <a class="wa"> — Botão flutuante WhatsApp
Linhas 917-956: <script> — Header scroll, menu mobile, formulário WhatsApp
Linhas 1089:    <script src="editor.js"></script>  ← EDITOR (última linha antes de </body>)
```

**Elementos editáveis (data-eid) no index.html:**

| data-eid | data-elabel | Tipo |
|----------|-------------|------|
| `hero-badge` | Badge Hero | texto |
| `hero-title` | Título Principal | texto |
| `hero-sub` | Subtítulo Hero | texto |
| `home-stat1-n` | Stat 1 Número | texto |
| `home-stat1-l` | Stat 1 Texto | texto |
| `home-stat2-n` | Stat 2 Número | texto |
| `home-stat2-l` | Stat 2 Texto | texto |
| `home-stat3-n` | Stat 3 Número | texto |
| `home-stat3-l` | Stat 3 Texto | texto |
| `home-stat4-n` | Stat 4 Número | texto |
| `home-stat4-l` | Stat 4 Texto | texto |
| `steps-title` | Título Processo | texto |
| `step1-title`, `step1-desc` | Passo 1 | texto |
| `step2-title`, `step2-desc` | Passo 2 | texto |
| `step3-title`, `step3-desc` | Passo 3 | texto |
| `dest-title` | Título Destinos | texto |
| `card1-img` … `card6-img` | Foto destino | imagem |
| `card1-flag` … `card6-flag` | País destino | texto |
| `card1-loc` … `card6-loc` | Local destino | texto |
| `card1-title` … `card6-title` | Título card | texto |
| `card1-price` … `card6-price` | Preço card | texto |
| `diff-title` | Título Diferenciais | texto |
| `diff-img` | Foto Diferenciais | imagem |
| `dep-title` | Título Depoimentos | texto |
| `dep1-name`, `dep1-text`, `dep1-loc` | Depoimento 1 | texto |
| `dep2-name`, `dep2-text`, `dep2-loc` | Depoimento 2 | texto |
| `dep3-name`, `dep3-text`, `dep3-loc` | Depoimento 3 | texto |

---

## 7. Anatomia do pacote.html

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

## 8. Anatomia do sobre.html

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

## 9. Sistema de Cores — Onde alterar

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

**Aliases no editor.js:** O editor usa `--primary` / `--primary-dark` internamente e mapeia automaticamente para `--navy` / `--navy-dark` ao aplicar (ver `editor.js` linhas 24-28).

---

## 10. Logo — Como está referenciada

A logo (`logo.png`) está na **raiz do projeto** e é referenciada com caminho relativo:

| Contexto | Código HTML |
|----------|-------------|
| Header (fundo claro/transparente) | `<img src="logo.png" alt="Lovisa Destinos" style="height:46px;width:auto;object-fit:contain;">` |
| Footer (fundo azul escuro) | `<img src="logo.png" ... style="filter:brightness(0) invert(1);">` — o filtro deixa branca |
| Favicon | `<link rel="icon" href="logo.png" type="image/png">` |
| Admin login | `<img src="../logo.png">` — note o `../` pois está em subpasta |

---

## 11. Formulário de WhatsApp — Como funciona

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

**Para mudar o número:** substituir `5519995396281` neste script **e** usar o editor visual (Cores → campo WhatsApp) para sincronizar todos os botões.

---

## 12. Dependências Externas (CDN)

O site depende dessas URLs externas — se ficarem offline, partes do visual quebram:

| Recurso | URL |
|---------|-----|
| Font Awesome (ícones) | `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css` |
| Google Fonts (Playfair Display) | `https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700` |
| Imagens de destinos | URLs do Unsplash (dentro do DB em pacote.html) |

---

## 13. ❌ Erros Comuns e Como Evitá-los

### Erro: Painel abre mas campos aparecem em branco
**Causa:** `GITHUB_TOKEN` não configurado no Vercel. `/api/content` retorna `{}` vazio.
**Solução:** Configurar `GITHUB_TOKEN` nas variáveis de ambiente do Vercel.

### Erro: Login falha com "Email ou senha incorretos"
**Causa 1:** Email digitado diferente de `admin@lovisadestinos.com.br` (verificação hardcoded no login.html).
**Causa 2:** `ADMIN_SECRET` no Vercel tem valor diferente do que está sendo digitado.
**Solução:** Usar exatamente o email `admin@lovisadestinos.com.br`. Verificar valor de `ADMIN_SECRET` no Vercel.

### Erro: Login falha com "Erro de conexão"
**Causa:** Arquivo `api/auth.js` não existe no repositório, ou não foi feito deploy.
**Solução:** Verificar se `api/auth.js` está no GitHub e se o Vercel fez deploy.

### Erro: "Publicar" falha com erro 401
**Causa:** Senha expirou da sessão ou `lovisa_secret` não está no sessionStorage.
**Solução:** Sair e fazer login novamente.

### Erro: "Publicar" falha com erro 500
**Causa:** `GITHUB_TOKEN` inválido, expirado, ou sem permissão `repo` no repositório.
**Solução:** Gerar novo Personal Access Token no GitHub com permissão `Contents: Read and write`.

### Erro: Elementos não aparecem destacados (laranja) para edição
**Causa:** Elemento não tem atributo `data-eid` no HTML.
**Solução:** Adicionar `data-eid="nome-unico"` e `data-elabel="Nome Legível"` no elemento.

### Erro: Upload de imagem falha
**Causa:** Imagem maior que 3MB, ou `GITHUB_TOKEN` sem permissão de escrita.
**Solução:** Comprimir a imagem ou verificar permissões do token.

### Erro: Editor funciona localmente mas não em produção
**Causa:** Variáveis de ambiente só existem localmente. No Vercel, as variáveis precisam ser configuradas separadamente.
**Solução:** Configurar `ADMIN_SECRET` e `GITHUB_TOKEN` no painel do Vercel (Settings → Environment Variables).

### Erro: Edições publicadas somem após atualizar o site
**Causa:** `content.json` no repositório local foi sobrescrito por um `git push` com a versão antiga.
**Solução:** Sempre fazer `git pull` antes de `git push`. O `content.json` é gerenciado pelo editor — não editar manualmente.

---

## 14. Fluxo de Deploy após edições manuais (código)

```bash
cd "C:\Users\win 10\Desktop\lovisa-destinos-site"
git add .
git commit -m "descrição da mudança"
git push
# Vercel atualiza automaticamente em ~30s
```

**ATENÇÃO:** Nunca fazer `git push` com um `content.json` desatualizado. Isso sobrescreve edições feitas pelo CMS. Sempre fazer `git pull` primeiro.

Site ao vivo: https://lovisa-destinos.vercel.app
GitHub: https://github.com/lucasferraripro/lovisa-destinos-site

---

## 15. O que NÃO fazer

- Não mover `logo.png` para uma subpasta sem atualizar todos os `src="logo.png"` nos 3 HTMLs
- Não remover o `<script>` do início de `pacote.html` — é o banco de dados dos pacotes
- Não mudar a cor `--wa: #25D366` — é a cor padrão do WhatsApp
- Não adicionar `node_modules`, `package.json` ou qualquer dependência local — site é HTML puro
- Não renomear `pacote.html` — os links dos cards apontam para esse nome exato
- Não remover `data-eid` de elementos — quebra o CMS para aquele elemento
- Não editar `content.json` manualmente — use o editor visual ou risco de corromper o JSON
- Não fazer `git push` sem `git pull` antes — risco de sobrescrever edições do CMS
- Não remover a linha `<script src="editor.js"></script>` do index.html
