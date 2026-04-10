# GUIA COMPLETO — REPLICAR SITE PARA NOVA AGÊNCIA DE VIAGENS

> **Para a IA que for executar:** Leia este documento do início ao fim antes de começar.
> Tudo que você precisa está aqui. Siga a ordem exata das etapas.

---

## O QUE É ESTE PROJETO

Site completo para agência de viagens com:
- **Site público** (home, página de pacotes, sobre nós, 404)
- **Editor visual** — a dona da agência clica em qualquer texto/imagem e edita sem saber programar
- **CMS sem banco de dados** — conteúdo salvo em `content.json` no GitHub
- **Upload de imagens** — direto do computador, sem Dropbox ou Google Drive
- **Deploy automático** — Vercel + GitHub, tudo no ar em segundos

**Stack:** HTML puro + CSS + JS vanilla · Vercel (serverless) · GitHub API · Sem frameworks

---

## ARQUIVOS DO PROJETO E O QUE CADA UM FAZ

```
/
├── index.html          → Página principal (home)
├── sobre.html          → Página Sobre Nós
├── pacote.html         → Template de página de pacote (dinâmico via JS)
├── 404.html            → Página de erro 404
├── editor.js           → Editor visual completo (NÃO MODIFICAR — funciona em todas as páginas)
├── content.json        → CMS — todo conteúdo editado pela dona fica aqui
├── logo.png            → Logo da empresa
├── vercel.json         → Roteamento Vercel + 404
├── admin/
│   └── login.html      → Tela de login do editor
├── api/
│   ├── content.js      → GET /api/content — retorna content.json sem cache CDN
│   ├── publish.js      → POST /api/publish — salva content.json no GitHub
│   └── upload.js       → POST /api/upload — faz upload de imagem no GitHub
└── imagens/
    ├── uploads/        → Imagens enviadas pelo editor ficam aqui
    └── (outras fotos)
```

---

## PASSO 1 — COLETAR INFORMAÇÕES DA NOVA EMPRESA

Antes de tocar em código, colete TUDO abaixo. Use o arquivo `DADOS-NOVA-EMPRESA.md` como formulário.

### Dados obrigatórios:
| Campo | Exemplo Lovisa |
|-------|---------------|
| Nome da empresa | Lovisa Destinos |
| Slogan / tagline | Viagens que transformam para sempre |
| WhatsApp (só números) | 5519995396281 |
| Email | contato@lovisadestinos.com.br |
| Instagram (só o @) | lovisadestinos |
| Grupo VIP WhatsApp (link) | https://chat.whatsapp.com/... |
| Horário de atendimento | Seg–Sáb 8h–20h |
| Cidade/Estado | Brasil |
| Cor principal (hex) | #1565C0 (azul) |
| Cor destaque (hex) | #F97316 (laranja) |
| Email do admin | admin@lovisadestinos.com.br |
| Senha do admin | Lovisa@2025 |

### Sobre a agente/dona:
| Campo | Exemplo |
|-------|---------|
| Nome | Vânia |
| Tag / função | Quem cuida de você |
| Mini-bio (3 parágrafos) | Sou a Vânia... |
| Foto (arquivo ou URL) | imagens/empresaria.webp |

### Pacotes de viagem (repetir para cada um):
| Campo | Exemplo |
|-------|---------|
| ID único (sem espaço) | noronha |
| Nome | Fernando de Noronha |
| Subtítulo | Paraíso ecológico no Atlântico |
| Localização | Pernambuco, Brasil |
| Duração | 5 noites / 6 dias |
| Descrição longa | ... |
| Preço | R$ 4.890 |
| Parcelamento | 10x de R$ 489 |
| Foto principal (URL) | https://... |
| Fotos carrossel (URLs) | [...] |
| Inclusos (lista) | Passagem, Hotel, ... |
| Não inclusos (lista) | Seguro viagem, ... |
| Roteiro dia a dia | Dia 1: Chegada... |

### Depoimentos (mínimo 3):
| Campo | Exemplo |
|-------|---------|
| Nome | Ana Paula |
| Destino visitado | Maldivas |
| Texto do depoimento | Melhor viagem da minha vida... |
| Foto (URL ou arquivo) | https://... |

### Estatísticas (4 números):
| Campo | Exemplo |
|-------|---------|
| Stat 1 | 5+ Anos de Experiência |
| Stat 2 | 3k+ Viajantes Felizes |
| Stat 3 | 50+ Destinos Atendidos |
| Stat 4 | 100% Satisfação Garantida |

### Diferenciais (4 itens):
| Campo | Exemplo |
|-------|---------|
| Diferencial 1 | ✈ Parceira Oficial CVC |
| Diferencial 2 | ❤ Atendimento Humanizado |
| Diferencial 3 | 💳 Parcelamento em 10x |
| Diferencial 4 | 🎧 Suporte do Início ao Fim |

---

## PASSO 2 — PREPARAR O GITHUB

1. Acesse github.com e faça login na conta do cliente (ou crie uma)
2. Crie um repositório novo: **Settings → Repositories → New**
   - Nome sugerido: `nome-agencia-site` (ex: `solar-viagens-site`)
   - Visibilidade: **Public** (obrigatório para imagens via raw.githubusercontent.com)
3. Faça upload de todos os arquivos deste projeto para o novo repositório
4. Gere um Personal Access Token com permissão de escrita:
   - Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
   - Escopos: marcar `repo` (completo)
   - Copie o token — você vai precisar dele no Passo 4

---

## PASSO 3 — PERSONALIZAR OS ARQUIVOS

### 3a. Atualizar `api/publish.js` e `api/content.js` e `api/upload.js`

Em TODOS os três arquivos da pasta `/api`, encontre e substitua:
```javascript
const owner = 'lucasferraripro';
const repo  = 'lovisa-destinos-site';
```
Pelo usuário GitHub e nome do repositório da nova empresa:
```javascript
const owner = 'USUARIO_GITHUB_NOVO';
const repo  = 'NOME_REPO_NOVO';
```

### 3b. Atualizar `admin/login.html`

Encontre e substitua as credenciais:
```javascript
const CREDENTIALS = {
    email: 'admin@lovisadestinos.com.br',
    ...
};
```
```javascript
// Linha que valida email:
const emailCorreto = email === 'admin@lovisadestinos.com.br';
// Linha que valida senha:
const senhaCorreta = senha === 'Lovisa@2025';
```
Pelos dados da nova empresa.

### 3c. Atualizar `index.html`

Substituir com `Ctrl+H` (buscar e substituir):

| Buscar | Substituir |
|--------|------------|
| `Lovisa Destinos` | Nome da nova empresa |
| `5519995396281` | WhatsApp da nova empresa (só números) |
| `lovisadestinos` | @ do Instagram novo |
| `contato@lovisadestinos.com.br` | Email novo |
| `admin@lovisadestinos.com.br` | Email admin novo |
| `H2DpRM8lAtnGrNjwWWcFVj` | ID do grupo VIP novo |
| `Seg–Sáb 8h–20h` | Horário novo |
| `#1565C0` | Cor principal nova |
| `#F97316` | Cor destaque nova |

Depois substituir todos os textos de conteúdo (hero title, diferenciais, depoimentos, etc.) pelos dados da nova empresa. Os elementos com `data-eid` podem ser editados depois pelo editor visual — mas o conteúdo inicial deve já refletir a empresa.

### 3d. Atualizar `sobre.html`

Mesmas substituições de WhatsApp, nome, email, cores.
Substituir textos de: hero, quem somos (3 parágrafos), diferenciais, agente (nome, bio), CTA.

### 3e. Atualizar `pacote.html` — banco de dados de pacotes

No início do `pacote.html`, encontre o bloco JavaScript com o objeto `DB`:

```javascript
const DB = {
    noronha: {
        title: 'Fernando de Noronha',
        ...
    },
    maldivas: { ... },
    ...
};
```

Substitua completamente com os pacotes da nova empresa. Estrutura de cada pacote:

```javascript
const DB = {
    ID_PACOTE: {
        title: 'Nome do Destino',
        subtitle: 'Subtítulo descritivo',
        loc: 'País/Região',
        dur: 'X noites / Y dias',
        desc: 'Descrição longa do pacote...',
        price: 'R$ X.XXX',
        parcelas: 'Xox de R$ XXX',
        imgs: [
            'https://URL_FOTO_1',
            'https://URL_FOTO_2',
            'https://URL_FOTO_3',
        ],
        incluso: ['Item 1', 'Item 2', 'Item 3'],
        nao_incluso: ['Item A', 'Item B'],
        roteiro: [
            { dia: '1º Dia', title: 'Título do dia', desc: 'Descrição...' },
            { dia: '2º Dia', title: 'Título do dia', desc: 'Descrição...' },
        ]
    },
    // repetir para cada pacote
};
```

Também atualizar o `INDEX` (lista de cards na home):
```javascript
const INDEX = [
    { id: 'ID_PACOTE', flag: '🌊', loc: 'País', title: 'Nome', price: 'R$ X.XXX', img: 'https://...' },
    // ...
];
```

### 3f. Atualizar `404.html`

Substituir apenas o texto de marca (nome da empresa). O resto funciona igual.

### 3g. Substituir `logo.png`

Colocar o logo da nova empresa no arquivo `logo.png` (ou ajustar o `<img src="">` nas páginas).

### 3h. Zerar `content.json`

O content.json deve começar vazio para a nova empresa:
```json
{}
```

---

## PASSO 4 — CONFIGURAR VERCEL

1. Acesse vercel.com e faça login (crie conta se necessário)
2. Clique em **Add New Project** → **Import Git Repository**
3. Selecione o repositório criado no Passo 2
4. Configure as **Environment Variables** (obrigatórias):

| Variável | Valor |
|----------|-------|
| `GITHUB_TOKEN` | Token gerado no Passo 2 (começa com `ghp_`) |
| `ADMIN_SECRET` | Senha do admin (ex: `MinhaEmpresa@2025`) |

5. Clique em **Deploy**
6. Após o deploy, o site estará no ar em `nome-projeto.vercel.app`

> **Domínio personalizado:** Settings → Domains → adicionar domínio próprio (ex: `solarviagens.com.br`)

---

## PASSO 5 — TESTAR TUDO

Acesse o site e verifique:

- [ ] Home carrega com dados da nova empresa
- [ ] Cores corretas aplicadas
- [ ] WhatsApp abre o número certo
- [ ] Página de pacotes funciona (`/pacote.html?id=ID_PACOTE`)
- [ ] Sobre nós carrega corretamente
- [ ] 404 mostra página de erro ao acessar URL inexistente

Depois testar o editor:
- [ ] Acessar `/admin/login.html`
- [ ] Login com email/senha da nova empresa
- [ ] Redireciona para home com editor ativo (barra escura no topo)
- [ ] Clicar em elemento laranja abre painel de edição
- [ ] Editar texto → Publicar → confirmar → site atualiza
- [ ] Upload de imagem por arquivo funciona
- [ ] Painel de cores altera o visual global
- [ ] Número de WhatsApp global atualiza todos os botões
- [ ] Botão ⚙ no rodapé leva para login

---

## PASSO 6 — ENTREGAR PARA A CLIENTE

Enviar para a dona da agência:

1. **URL do site:** `https://nome.vercel.app` (ou domínio próprio)
2. **URL do editor:** `https://nome.vercel.app/admin/login.html`
3. **Email de acesso:** (o que foi configurado)
4. **Senha de acesso:** (a que foi configurada)
5. **O arquivo `COMO-EDITAR.md`** — manual de uso simplificado

---

## VARIÁVEIS QUE MUDAM ENTRE EMPRESAS (checklist rápido)

```
GitHub:
  owner (usuário GitHub)
  repo  (nome do repositório)

admin/login.html:
  email do admin
  senha do admin

index.html / sobre.html / pacote.html / 404.html:
  Nome da empresa
  WhatsApp (5519995396281)
  Instagram (@)
  Email
  Grupo VIP WhatsApp (link)
  Cores (#1565C0 e #F97316)
  Todos os textos de conteúdo
  URLs das imagens

pacote.html (DB):
  Objeto DB completo com os pacotes
  Objeto INDEX com os cards

Vercel Environment Variables:
  GITHUB_TOKEN
  ADMIN_SECRET

logo.png:
  Arquivo do logo

content.json:
  Resetar para {}
```

---

## COMO O EDITOR FUNCIONA (para entender ao personalizar)

1. A dona acessa `/admin/login.html`, faz login
2. É redirecionada para a home com `?editor=1`
3. `editor.js` detecta o modo editor e ativa a barra escura no topo
4. Todos os elementos com `data-eid="nome-unico"` ficam com borda laranja ao passar o mouse
5. Ao clicar: abre painel lateral automático (texto, imagem ou link — detectado automaticamente)
6. Ao publicar: o `editor.js` envia o conteúdo para `/api/publish`
7. `/api/publish` commita o `content.json` atualizado no GitHub
8. Na próxima visita, `/api/content` busca o `content.json` do GitHub (sem cache) e aplica no site

**O editor funciona em QUALQUER página** que inclua `<script src="editor.js"></script>`.
Para tornar um elemento editável, basta adicionar `data-eid="id-unico" data-elabel="Nome Legível"` na tag HTML.

---

## TEMPO ESTIMADO DE IMPLEMENTAÇÃO

| Etapa | Tempo |
|-------|-------|
| Coletar dados da empresa | 30–60 min (depende do cliente) |
| Configurar GitHub + Vercel | 15 min |
| Personalizar HTML (buscar/substituir) | 30–45 min |
| Personalizar pacotes (DB) | 30–60 min (depende do número de pacotes) |
| Testes | 15 min |
| **Total** | **2–3 horas** |

---

## PROBLEMAS COMUNS E SOLUÇÕES

| Problema | Causa | Solução |
|----------|-------|---------|
| "Não autorizado" ao publicar | ADMIN_SECRET diferente do login.html | Verificar se a variável no Vercel é igual à senha em login.html |
| Site não atualiza após publicar | Cache do browser | Aguardar 30s ou abrir aba anônima |
| Upload de imagem falha | GITHUB_TOKEN sem permissão `repo` | Regerar token com escopo `repo` completo |
| Imagens não aparecem | Repositório privado | Repositório precisa ser **Public** |
| Editor não ativa ao navegar | sessionStorage expirou | Fazer login novamente em /admin/login.html |
| Pacote não encontrado (404) | `id` na URL diferente do `DB` | Verificar se o ID na URL bate com a chave no objeto `DB` |
| Cores não aplicam no site | CSS var diferente | index.html/pacote.html usam `--navy`; editor seta `--primary` E `--navy` automaticamente |

---

*Criado para o projeto Lovisa Destinos — Abril 2026*
*Replicável para qualquer agência de viagens em 2–3 horas*
