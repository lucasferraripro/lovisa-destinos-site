# Como Editar o Site — Guia Completo

Este guia serve para **edição manual** (VS Code, Bloco de Notas) ou para **outra IA** fazer ajustes.

---

## Regras Gerais

1. O site é **HTML puro** — edite diretamente os arquivos `.html`
2. Não há build, compilação ou instalação de dependências
3. Após editar, basta salvar e fazer deploy (ver `skills/fazer-deploy.md`)
4. Sempre edite **todos os 3 arquivos** quando mudar coisas globais (cores, nome, telefone)

---

## Onde fica cada coisa

### Nome da empresa
Buscar por: `Lovisa Destinos`
Aparece em: `index.html`, `sobre.html`, `pacote.html`

### Telefone WhatsApp
Buscar por: `5519995396281`
Aparece em links `wa.me` e no JavaScript do formulário

### Telefone formatado
Buscar por: `(19) 99539-6281`

### E-mail
Buscar por: `contato@lovisadestinos.com.br`

### Cores
Buscar por: `:root {` — as variáveis CSS ficam logo abaixo
Ver detalhes em `DESIGN-SYSTEM.md`

### Logo
Arquivo: `logo.png` na raiz do projeto
Referenciada como `src="logo.png"` (caminho relativo)

---

## Edições Comuns

### Trocar número de WhatsApp
Em cada arquivo HTML, substituir:
- `5519995396281` → novo número (somente dígitos, com DDI 55)
- `(19) 99539-6281` → novo número formatado

### Trocar e-mail
Substituir `contato@lovisadestinos.com.br` pelo novo e-mail em todos os arquivos.

### Trocar link do grupo VIP
Buscar por: `chat.whatsapp.com/H2DpRM8lAtnGrNjwWWcFVj`
Substituir pelo novo link do grupo.

### Mudar cores
Ver `skills/mudar-cores.md` para instruções detalhadas.

### Adicionar/remover pacote
Ver `skills/adicionar-pacote.md` para instruções detalhadas.

### Trocar textos
Abrir o arquivo HTML no editor, localizar o texto visualmente (Ctrl+F) e editar diretamente.

---

## Seções do index.html (em ordem)

| Seção | Identificador HTML | Conteúdo |
|-------|--------------------|----------|
| Header/Nav | `<header id="header">` | Logo, menu, botão WhatsApp |
| Hero | `<section id="home" class="hero">` | Título, subtítulo, CTAs, imagem de fundo |
| Stats | `<section class="stats">` | Números de prova social |
| Como Funciona | `<section id="como-funciona">` | 3 passos do processo |
| Destinos | `<section id="destinos">` | Cards dos pacotes |
| Diferenciais | `<section id="diferenciais">` | Foto + 4 diferenciais |
| Depoimentos | `<section id="depoimentos">` | 3 cards de depoimentos |
| Formulário | `<section id="contato">` | Form + info de contato |
| Footer | `<footer>` | Links, social, copyright |
| Botão flutuante | `<a class="wa">` | WhatsApp fixo no canto |

---

## Como a Galeria de Pacotes funciona (pacote.html)

No início do arquivo `pacote.html` há um bloco `<script>` com:

```javascript
const SITE = { nome, whatsapp, email, tel };
const DB = {
    noronha: { title, subtitle, location, duration, price, parcelas, flag, images, desc, inc, ninc, days },
    maldivas: { ... },
    paris: { ... },
    // etc.
};
```

Quando a URL é `pacote.html?id=noronha`, o JS lê `DB['noronha']` e renderiza o conteúdo automaticamente.

---

## Arquivos que NÃO devem ser apagados

| Arquivo | Motivo |
|---------|--------|
| `logo.png` | Usado como favicon e em todos os headers |
| `index.html` | Página principal |
| `pacote.html` | Página de todos os pacotes (dinâmica) |
| `sobre.html` | Página institucional |

---

## Instrução para IA Assistente

Se você é uma IA auxiliando neste projeto:

1. Leia primeiro: `EMPRESA.md` (dados da empresa), `DESIGN-SYSTEM.md` (visual)
2. Para qualquer mudança estrutural, leia o arquivo HTML completo antes de editar
3. Não altere as dependências externas (Font Awesome, Google Fonts) sem necessidade
4. Mantenha o sistema de URL params (`?id=`) em `pacote.html` funcionando
5. Após edições, o cliente deve rodar `git push` para atualizar o GitHub e re-deploy no Vercel
6. Para deploy: ver `skills/fazer-deploy.md`
