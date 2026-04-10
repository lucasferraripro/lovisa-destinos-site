# PROMPT PARA IA — REPLICAR SITE DE AGÊNCIA DE VIAGENS
*Atualizado: Abril 2026 — v2*

> Cole este prompt ao iniciar uma nova conversa com Claude Code ou outra IA.
> Junto com este prompt, anexe o arquivo `DADOS-NOVA-EMPRESA.md` preenchido.

---

## PROMPT PRINCIPAL

```
Você vai replicar um site completo de agência de viagens para uma nova empresa.

Tenho um projeto base já funcionando (Lovisa Destinos) com:
- Site estático em HTML/CSS/JS (mobile-first, sem frameworks)
- Editor visual CMS (editor.js) — a dona edita o site sem saber programar
- 4 APIs Vercel serverless: auth, content, publish, upload
- Deploy automático: Vercel + GitHub

Os arquivos base estão em: [CAMINHO LOCAL ou REPOSITÓRIO GITHUB]

Os dados da nova empresa estão no arquivo DADOS-NOVA-EMPRESA.md (em anexo).

LEIA PRIMEIRO (nesta ordem):
1. REPLICAR-PARA-NOVA-EMPRESA.md — guia técnico completo
2. DADOS-NOVA-EMPRESA.md — dados da nova empresa

TAREFAS (execute nesta ordem):
1. Copie todos os arquivos do projeto para a pasta destino: [PASTA DESTINO]
2. Nos 4 arquivos da pasta /api: substitua owner e repo pelo GitHub do cliente
3. Em admin/login.html: substitua o email do admin
4. Em index.html, sobre.html, pacote.html, clientes.html, 404.html:
   - Substituição global: nome, WhatsApp, Instagram, email, cores
   - Substituição manual: todos os textos de conteúdo
5. Em pacote.html: substitua completamente os objetos DB, INDEX, destImgs e destEid
6. Substitua logo.png pelo logo do cliente
7. Redefina content.json para {}
8. Me entregue o checklist do que ainda faço manualmente (GitHub, Vercel, domínio)

NÃO MODIFICAR:
- editor.js (funciona igual para todas as empresas — não tocar)
- vercel.json (roteamento universal — não tocar)

PRIORIDADE MÁXIMA em tudo que fizer:
- Mobile-first: o site é 100% acessado pelo celular
- Todo código deve funcionar perfeitamente em 375px–430px
- Botões com altura mínima de 44px, fontes ≥16px em inputs
```

---

## CONTEXTO TÉCNICO COMPLETO (cole se a IA não conhecer o projeto)

```
ARQUITETURA — SITE PÚBLICO:
- index.html: home (hero, destinos/cards, clientes/instagram, diferenciais, depoimentos, orçamento, footer)
- sobre.html: sobre a empresa (bio da agente, stats, diferenciais, CTA)
- pacote.html: template dinâmico de pacote (lê ?id= da URL, renderiza objeto do DB)
- clientes.html: galeria de clientes / posts do Instagram
- 404.html: página de erro customizada

ARQUITETURA — EDITOR VISUAL:
- editor.js: editor completo, incluso em todas as páginas HTML
  - Qualquer elemento com data-eid="id-unico" fica editável no modo editor
  - Detecta automaticamente o tipo: IMG → painel de imagem, A → painel de link, else → painel de texto
  - Rascunho salvo em localStorage (lovisa_cms_v3)
  - Publicação via /api/publish commita no GitHub
- admin/login.html: tela de login
  - Valida email localmente (hardcode) + senha via /api/auth (server-side)
  - Salva lovisa_auth e lovisa_secret no sessionStorage (8h de sessão)

ARQUITETURA — APIs (pasta /api):
- auth.js:    POST /api/auth    — valida senha contra ADMIN_SECRET do Vercel → {ok: true/false}
- content.js: GET  /api/content — retorna content.json do GitHub sem cache CDN
- publish.js: POST /api/publish — recebe {content, secret}, commita content.json no GitHub
- upload.js:  POST /api/upload  — recebe {filename, base64, secret}, salva imagem em imagens/uploads/

VARIÁVEIS VERCEL (Environment Variables obrigatórias):
- GITHUB_TOKEN: Personal Access Token com escopo "repo" (leitura + escrita)
- ADMIN_SECRET: senha do admin — DEVE ser a mesma que a dona usa para logar

REPOSITÓRIO GITHUB: deve ser PÚBLICO (imagens servidas via raw.githubusercontent.com)

CSS VARIABLES — dois conjuntos por razões históricas:
- index.html, pacote.html, clientes.html: --navy, --navy-dark, --accent, --text, --wa
- sobre.html: --primary, --primary-dark, --accent, --text-dark, --wa
- editor.js aplica aliases automaticamente ao salvar cores

CARREGAMENTO DE FONTES — padrão não-bloqueante (usar em TODOS os HTML):
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="[URL_FONTE]" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="[URL_FONTE]"></noscript>

PACOTE.HTML — objetos JS que devem ser substituídos:
1. DB: banco de dados completo dos pacotes (title, subtitle, location, duration,
   price, parcelas, flag, images[], desc, incluso[], nao_incluso[], roteiro[])
2. INDEX: array de cards para exibição na home
3. destImgs: mapeamento id-do-pacote → URL da imagem (para seção "outros destinos")
4. destEid: mapeamento id-do-pacote → "card1-img"..."card6-img" (para sincronizar com CMS)

IMAGENS:
- Carrossel de pacotes: cada slide e miniatura compartilham o mesmo data-eid (ex: lencois-pkg-img-0)
- Cards da home: data-eid de "card1-img" a "card6-img"
- Depoimentos: data-eid de "dep-1-foto" a "dep-3-foto"
- Upload pelo editor: salvo em imagens/uploads/ no GitHub, URL permanente via raw.githubusercontent.com
- URLs externas: qualquer URL de imagem pública funciona diretamente no campo de URL do painel
```

---

## CHECKLIST MANUAL (o que a IA NÃO faz — você faz)

Após a IA entregar os arquivos personalizados:

- [ ] Criar repositório **público** no GitHub
- [ ] Fazer push de todos os arquivos
- [ ] Gerar Personal Access Token (escopo: `repo`)
- [ ] Criar projeto no Vercel → Import Git Repository
- [ ] Adicionar variáveis de ambiente: `GITHUB_TOKEN` e `ADMIN_SECRET`
- [ ] Fazer o primeiro deploy
- [ ] Testar login: `/admin/login.html`
- [ ] Testar edição e publicação de um texto
- [ ] Testar upload de imagem
- [ ] Testar no celular (mobile-first!)
- [ ] Configurar domínio personalizado (se o cliente tiver)
- [ ] Entregar URL + credenciais para o cliente

---

## MODELO DE ENTREGA PARA O CLIENTE

```
Olá [NOME]! Seu site está pronto!

🌐 Site: https://DOMINIO.com.br
🔐 Editor: https://DOMINIO.com.br/admin/login.html
📧 Email: admin@EMPRESA.com.br
🔑 Senha: SENHA_CONFIGURADA

Como editar o site pelo celular:
1. Abra o link do editor
2. Faça login com email e senha
3. Toque em qualquer texto ou foto com borda laranja
4. Edite e toque em "Publicar"
5. As mudanças aparecem no site em segundos!

Dúvidas? Só chamar.
```

---

## ESTRUTURA DE DADOS — PACOTE COMPLETO (exemplo)

```javascript
const DB = {
    nomedodestino: {
        title:    'Nome do Destino',
        subtitle: 'Subtítulo descritivo e atrativo',
        location: 'Cidade, Estado/País',
        duration: '5 noites / 6 dias',
        price:    '3.890',          // só números, ponto como decimal
        parcelas: '10x de R$ 389',
        flag:     '🏖️',
        images: [
            'https://URL_IMAGEM_PRINCIPAL',
            'https://URL_IMAGEM_2',
            'https://URL_IMAGEM_3',
        ],
        desc: 'Descrição longa e atrativa do destino. Fale sobre a experiência, o que torna especial, o que o viajante vai sentir.',
        incluso: [
            'Passagem aérea ida e volta',
            'Hospedagem por X noites',
            'Café da manhã incluso',
            'Transfer aeroporto/hotel',
        ],
        nao_incluso: [
            'Seguro viagem',
            'Passeios opcionais',
        ],
        roteiro: [
            { dia: '1º Dia', title: 'Chegada e Descanso', desc: 'Chegada ao destino, check-in no hotel e tarde livre para se acomodar.' },
            { dia: '2º Dia', title: 'Título do Dia', desc: 'Descrição das atividades do dia...' },
            { dia: '3º Dia', title: 'Título do Dia', desc: 'Descrição das atividades do dia...' },
            { dia: '4º Dia', title: 'Título do Dia', desc: 'Descrição das atividades do dia...' },
            { dia: '5º Dia', title: 'Partida', desc: 'Último café da manhã, check-out e traslado para o aeroporto.' },
        ]
    },
    // repetir para cada destino...
};

const INDEX = [
    { id: 'nomedodestino', flag: '🏖️', loc: 'Cidade, Estado', title: 'Nome do Destino', price: '3.890', img: 'https://URL_IMAGEM' },
    // ...
];

const destImgs = {
    nomedodestino: 'https://URL_IMAGEM',
    // ...
};

const destEid = {
    nomedodestino: 'card1-img',  // bate com data-eid do card em index.html
    // ...
};
```

---

*Template criado a partir do projeto Lovisa Destinos — Atualizado Abril 2026 v2*
