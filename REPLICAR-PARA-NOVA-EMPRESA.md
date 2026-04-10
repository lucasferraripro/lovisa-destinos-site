# GUIA COMPLETO — REPLICAR SITE PARA NOVA AGÊNCIA DE VIAGENS
*Atualizado: Abril 2026 — v2*

> **Para a IA que for executar:** Leia este documento do início ao fim antes de começar.
> Siga a ordem exata. Não pule etapas.

---

## ESTRUTURA DO PROJETO (ARQUIVOS ATUAIS)

```
/
├── index.html          → Home (hero, destinos, clientes/instagram, diferenciais, depoimentos, contato, footer)
├── sobre.html          → Sobre a empresa (bio da agente, diferenciais, estatísticas)
├── pacote.html         → Template dinâmico de pacote (lê ?id= da URL, usa objeto DB em JS)
├── clientes.html       → Galeria de clientes / posts do Instagram
├── 404.html            → Página de erro 404 customizada
├── editor.js           → Editor visual CMS — NÃO MODIFICAR
├── content.json        → CMS: chave=data-eid, valor={html, src, href, style} — INICIAR COMO {}
├── logo.png            → Logo da empresa (substituir)
├── vercel.json         → Roteamento Vercel (não modificar)
├── admin/
│   └── login.html      → Tela de login do editor
├── api/
│   ├── auth.js         → POST /api/auth — valida senha do admin (server-side)
│   ├── content.js      → GET /api/content — retorna content.json sem cache CDN
│   ├── publish.js      → POST /api/publish — commita content.json no GitHub
│   └── upload.js       → POST /api/upload — faz upload de imagem no GitHub
└── imagens/
    ├── uploads/        → Imagens enviadas pelo editor ficam aqui
    └── (outras fotos)
```

---

## COMO O SISTEMA FUNCIONA

### Site público
- Carrega normalmente sem autenticação
- `editor.js` sempre incluso — detecta se há sessão admin ativa
- `content.json` do GitHub é lido via `/api/content` a cada carregamento (sem cache CDN)
- Conteúdo do `content.json` é aplicado sobre os elementos com `data-eid`

### Editor visual
1. Dona acessa `/admin/login.html`, entra com email + senha
2. Login.html chama `/api/auth` com a senha → valida contra `ADMIN_SECRET` do Vercel
3. Se ok: salva `lovisa_auth` e `lovisa_secret` no sessionStorage, redireciona para home com `?editor=1`
4. `editor.js` ativa barra escura no topo
5. Elementos com `data-eid` ficam com borda laranja (editáveis)
6. Ao clicar: painel lateral abre (detecta tipo automaticamente: imagem/link/texto)
7. Ao publicar: `editor.js` envia `{content, secret}` para `/api/publish`
8. `/api/publish` commita `content.json` atualizado no GitHub
9. Na próxima visita, `/api/content` retorna o novo conteúdo

### Imagens
- Upload pelo editor → `/api/upload` → commit no GitHub em `imagens/uploads/`
- URL retornada: `https://raw.githubusercontent.com/OWNER/REPO/master/imagens/uploads/...`
- OU: colar URL externa diretamente no campo de URL do painel de imagem

---

## PASSO 1 — COLETAR DADOS DA NOVA EMPRESA

Use o arquivo `DADOS-NOVA-EMPRESA.md` como formulário. Campos obrigatórios:

| Campo | Exemplo (Lovisa) |
|-------|-----------------|
| Nome da empresa | Lovisa Destinos |
| Slogan | Viagens que transformam para sempre |
| WhatsApp (só números) | 5519995396281 |
| Email | contato@lovisadestinos.com.br |
| Instagram (@) | lovisadestinos |
| Grupo VIP WhatsApp | https://chat.whatsapp.com/H2DpRM8... |
| Horário | Seg–Sáb 8h–20h |
| Cidade/Estado | Campinas, SP |
| Cor principal (hex) | #1565C0 |
| Cor destaque (hex) | #F97316 |
| Email do admin | admin@lovisadestinos.com.br |
| Senha do admin | MinhaAgencia@2025 (criar uma senha forte) |
| Usuário GitHub | lucasferraripro |
| Nome do repositório | lovisa-destinos-site |

---

## PASSO 2 — PREPARAR GITHUB

1. Criar repositório **público** (obrigatório — imagens servidas via raw.githubusercontent.com)
2. Fazer upload de todos os arquivos
3. Gerar Personal Access Token: Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
   - Escopo: `repo` (completo)
   - Copiar o token (começa com `ghp_`)

---

## PASSO 3 — PERSONALIZAR OS ARQUIVOS

### 3a. Arquivos da pasta `/api` — 4 arquivos

Em `api/auth.js`, `api/publish.js`, `api/content.js`, `api/upload.js`:

```javascript
// BUSCAR:
const owner = 'lucasferraripro';
const repo  = 'lovisa-destinos-site';

// SUBSTITUIR POR:
const owner = 'USUARIO_GITHUB_NOVO';
const repo  = 'NOME_REPO_NOVO';
```

> ⚠️ `api/auth.js` NÃO tem owner/repo mas tem a mesma lógica de `ADMIN_SECRET` — não precisa mexer nele além disso.

### 3b. `admin/login.html`

Encontrar e substituir o email:
```javascript
// BUSCAR:
if (email !== 'admin@lovisadestinos.com.br')

// SUBSTITUIR POR:
if (email !== 'admin@NOVAEMPRESA.com.br')
```

> A senha NÃO está em login.html — ela é validada pelo `ADMIN_SECRET` do Vercel via `/api/auth`.
> Não há mais hardcode de senha no código front-end.

### 3c. `index.html`

Buscar e substituir globalmente (Ctrl+H):

| Buscar | Substituir por |
|--------|----------------|
| `Lovisa Destinos` | Nome da nova empresa |
| `5519995396281` | WhatsApp (só números) |
| `lovisadestinos` | @ do Instagram novo |
| `contato@lovisadestinos.com.br` | Email de contato |
| `admin@lovisadestinos.com.br` | Email do admin |
| `H2DpRM8lAtnGrNjwWWcFVj` | ID do grupo VIP WhatsApp |
| `Seg–Sáb 8h–20h` | Horário novo |
| `#1565C0` | Cor principal nova |
| `#F97316` | Cor destaque nova |
| `#0D47A1` | Cor principal escura nova |

Depois substituir manualmente os textos de conteúdo:
- Hero: título, subtítulo, badge, texto dos botões
- Diferenciais: 4 títulos e descrições
- Depoimentos: nomes, destinos, textos, fotos
- Seção "Como Funciona": 3 passos
- Seção "Clientes": textos do Instagram (ou deixar vazio para preencher depois)
- Stats (4 números): anos de experiência, clientes, destinos, satisfação
- Footer: endereço, texto da empresa

### 3d. `sobre.html`

Mesmas substituições de contato + cores do passo 3c.
Substituir textos de: hero, 3 parágrafos sobre a agente, nome da agente, foto da agente, diferenciais, CTA.

### 3e. `pacote.html`

**Substituições de contato + cores** (mesmas do 3c).

**Banco de dados de pacotes** — encontrar o bloco `const DB = {` e substituir completamente:

```javascript
const DB = {
    ID_PACOTE: {
        title:    'Nome do Destino',
        subtitle: 'Subtítulo descritivo',
        location: 'País/Região',
        duration: 'X noites / Y dias',
        price:    '4.890',       // só números e ponto
        parcelas: '10x de R$ 489',
        flag:     '🌊',          // emoji do destino
        images: [
            'https://URL_FOTO_PRINCIPAL',
            'https://URL_FOTO_2',
            'https://URL_FOTO_3',
        ],
        desc: 'Descrição longa do pacote...',
        incluso: ['Item 1', 'Item 2', 'Item 3'],
        nao_incluso: ['Item A', 'Item B'],
        roteiro: [
            { dia: '1º Dia', title: 'Título', desc: 'Descrição do dia...' },
            { dia: '2º Dia', title: 'Título', desc: 'Descrição do dia...' },
        ]
    },
    // repetir para cada pacote
};
```

**INDEX** (cards da seção de destinos na home e em pacote.html):

```javascript
const INDEX = [
    { id: 'ID_PACOTE', flag: '🌊', loc: 'País', title: 'Nome', price: '4.890', img: 'https://...' },
    // ...
];
```

**destImgs e destEid** (mapeamento para "Outros Destinos" na página de pacote):

```javascript
const destImgs = {
    id1: 'https://URL_IMAGEM_1',
    id2: 'https://URL_IMAGEM_2',
    // ...
};
const destEid = {
    id1: 'card1-img',
    id2: 'card2-img',
    id3: 'card3-img',
    id4: 'card4-img',
    id5: 'card5-img',
    id6: 'card6-img',
};
```

> Os IDs dos cards (`card1-img` a `card6-img`) devem bater com os `data-eid` das imagens dos cards em `index.html`.

### 3f. `clientes.html`

Substituir nome da empresa e textos. Atualizar fotos dos clientes (posts do Instagram ou fotos de viagem).

### 3g. `404.html`

Substituir apenas o nome da empresa. O resto funciona igual.

### 3h. `logo.png`

Substituir pelo logo da nova empresa (PNG com fundo transparente, mínimo 200x200px).

### 3i. `content.json`

Deve começar vazio:
```json
{}
```

---

## PASSO 4 — CONFIGURAR VERCEL

1. Acessar vercel.com → Add New Project → Import Git Repository
2. Selecionar o repositório criado
3. Configurar **Environment Variables** (obrigatórias):

| Variável | Valor |
|----------|-------|
| `GITHUB_TOKEN` | Token gerado no Passo 2 (`ghp_...`) |
| `ADMIN_SECRET` | Senha do admin (ex: `MinhaAgencia@2025`) |

4. Clicar em Deploy
5. Site no ar em `nome-projeto.vercel.app`

> **IMPORTANTE:** `ADMIN_SECRET` é a senha que a dona usa para logar no editor.
> O email de acesso é o que você colocou em `admin/login.html`.
> Os dois DEVEM ser configurados no Vercel — sem eles o editor não funciona.

---

## PASSO 5 — TESTAR

### Site público:
- [ ] Home carrega com dados da nova empresa
- [ ] Cores corretas
- [ ] WhatsApp abre o número correto
- [ ] Página de pacotes funciona (`/pacote.html?id=ID_DO_PACOTE`)
- [ ] Sobre carrega corretamente
- [ ] Clientes/galeria carrega
- [ ] 404 aparece ao acessar URL inexistente

### Editor (Painel):
- [ ] Login em `/admin/login.html` com email + senha configurados
- [ ] Redireciona para home com barra escura no topo
- [ ] Clicar em elemento laranja abre painel lateral
- [ ] Editar texto → rascunho salvo (ponto amarelo no botão Publicar)
- [ ] Publicar → confirmar → site atualiza em ~30 segundos
- [ ] Upload de imagem por arquivo funciona (máx 3MB)
- [ ] Colar URL de imagem externa funciona
- [ ] Painel de cores altera visual do site
- [ ] Campo WhatsApp atualiza todos os botões
- [ ] Editor funciona no **celular** (mobile-first)
- [ ] Carrossel de imagens nas páginas de pacote: miniatura atualiza junto com slide

---

## PASSO 6 — ENTREGAR PARA O CLIENTE

Enviar:
1. URL do site
2. URL do editor: `https://SEU-SITE.vercel.app/admin/login.html`
3. Email de acesso (configurado em login.html)
4. Senha de acesso (ADMIN_SECRET do Vercel)
5. O arquivo `COMO-EDITAR.md` — manual simplificado

---

## VARIÁVEIS QUE MUDAM ENTRE EMPRESAS — CHECKLIST RÁPIDO

```
api/auth.js, api/publish.js, api/content.js, api/upload.js:
  ✏ owner (usuário GitHub)
  ✏ repo  (nome do repositório)

admin/login.html:
  ✏ email do admin (if (email !== 'admin@...')

Vercel Environment Variables:
  ✏ GITHUB_TOKEN (novo token do GitHub do cliente)
  ✏ ADMIN_SECRET (senha que o cliente vai usar no editor)

index.html / sobre.html / pacote.html / clientes.html / 404.html:
  ✏ Nome da empresa
  ✏ WhatsApp (5519995396281)
  ✏ Instagram (@lovisadestinos)
  ✏ Email (contato@lovisadestinos.com.br)
  ✏ Grupo VIP WhatsApp (H2DpRM8lAtnGrNjwWWcFVj)
  ✏ Cores (#1565C0, #F97316, #0D47A1)
  ✏ Todos os textos de conteúdo
  ✏ URLs das imagens

pacote.html — objetos JS:
  ✏ DB (banco de dados dos pacotes)
  ✏ INDEX (cards da home)
  ✏ destImgs (mapeamento de imagens para "outros destinos")
  ✏ destEid (mapeamento de data-eid para "outros destinos")

logo.png:
  ✏ Substituir pelo logo do cliente

content.json:
  ✏ Resetar para {}
```

---

## CSS VARIABLES — ATENÇÃO

O projeto usa dois conjuntos de variáveis CSS (por razões históricas):

| Arquivo | Variáveis de cor |
|---------|-----------------|
| `index.html`, `pacote.html`, `clientes.html` | `--navy`, `--navy-dark`, `--accent`, `--text`, `--wa` |
| `sobre.html` | `--primary`, `--primary-dark`, `--accent`, `--text-dark`, `--wa` |

O `editor.js` trata isso automaticamente — ao salvar cores via painel, aplica aliases em ambos os conjuntos.

---

## FONTES E ÍCONES — PADRÃO DE CARREGAMENTO

**Não bloqueante (padrão atual):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap"></noscript>
<link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"></noscript>
```

> Usar SEMPRE este padrão em todos os arquivos HTML. Nunca usar `<link rel="stylesheet">` diretamente para fontes externas — causa lentidão.

---

## PROBLEMAS COMUNS E SOLUÇÕES

| Problema | Causa | Solução |
|----------|-------|---------|
| "Não autorizado" ao publicar | `ADMIN_SECRET` do Vercel não configurado ou diferente | Verificar/configurar `ADMIN_SECRET` no painel Vercel |
| Login não funciona | Email em `login.html` diferente do digitado | Verificar email no `if (email !== '...')` em login.html |
| Site não atualiza após publicar | Cache do browser | Aguardar 30s ou abrir aba anônima |
| Upload de imagem falha | GITHUB_TOKEN sem permissão `repo` | Regerar token com escopo `repo` completo |
| Imagens não aparecem | Repositório privado | Repositório PRECISA ser público |
| Editor não ativa | sessionStorage expirou (8h) | Fazer login novamente em /admin/login.html |
| Pacote não encontrado | `id` na URL diferente do objeto `DB` | Verificar se ID na URL bate com chave no `DB` |
| Miniatura do carrossel não atualiza | Versão antiga do pacote.html | Verificar se thumbnails têm `data-eid` igual ao slide |
| Cores não aplicam em index/pacote | CSS var errada | Usar `--navy` (não `--primary`) em index.html e pacote.html |

---

## TEMPO ESTIMADO

| Etapa | Tempo |
|-------|-------|
| Coletar dados + fotos do cliente | 1–2h |
| Configurar GitHub + Vercel | 15min |
| Personalizar HTML (buscar/substituir) | 30–45min |
| Personalizar pacotes (DB) | 30–60min |
| Personalizar clientes/galeria | 15–30min |
| Testes | 15min |
| **Total** | **2–4 horas** |

---

*Criado a partir do projeto Lovisa Destinos — Atualizado Abril 2026 v2*
