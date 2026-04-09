# Lovisa Destinos — Site de Vendas

Site de página de vendas para a agência de viagens **Lovisa Destinos**.
Construído em HTML puro, sem frameworks — fácil de editar manualmente ou via IA.

---

## Estrutura do Projeto

```
lovisa-destinos-site/
├── index.html          → Página principal (home)
├── sobre.html          → Página Sobre Nós
├── pacote.html         → Página de detalhes de pacote (dinâmica por URL)
├── logo.png            → Logo oficial da empresa
│
├── README.md           → Este arquivo (visão geral)
├── EMPRESA.md          → Todas as informações da empresa
├── DESIGN-SYSTEM.md    → Cores, fontes e estilos do site
├── COMO-EDITAR.md      → Guia completo para edições manuais ou por IA
│
└── skills/
    ├── adicionar-pacote.md     → Como adicionar um novo destino/pacote
    ├── mudar-cores.md          → Como trocar as cores do site
    ├── atualizar-contato.md    → Como atualizar telefone, email, links
    ├── adicionar-pagina.md     → Como criar uma nova página
    └── fazer-deploy.md         → Como publicar atualizações (Vercel/GitHub)
```

---

## Deploy Atual

| Plataforma | URL |
|------------|-----|
| Vercel (produção) | https://lovisa-destinos.vercel.app |
| GitHub (código-fonte) | https://github.com/lucasferraripro/lovisa-destinos-site |

---

## Tecnologias Usadas

- **HTML5** puro — sem React, Vue ou qualquer framework
- **CSS3** com variáveis (`:root`) — fácil de personalizar cores
- **JavaScript** vanilla — formulário WhatsApp + galeria de imagens + menu mobile
- **Font Awesome 6.4** — ícones (via CDN)
- **Google Fonts** — Playfair Display (títulos) + sistema (corpo)
- **Unsplash** — imagens de destinos (via URL, sem download necessário)

---

## Como o Site Funciona

### Página de Pacotes (pacote.html)
A página `pacote.html` é **dinâmica**: ela lê o parâmetro `?id=` da URL e carrega o pacote correspondente do banco de dados JavaScript no início do arquivo.

Exemplo:
- `pacote.html?id=noronha` → mostra Fernando de Noronha
- `pacote.html?id=maldivas` → mostra Maldivas
- `pacote.html?id=paris` → mostra Paris

Para adicionar um novo destino, basta adicionar uma entrada no objeto `DB` dentro de `pacote.html` e um card na seção `#destinos` do `index.html`.

### Formulário de Orçamento
O formulário monta uma mensagem formatada e abre o WhatsApp com a mensagem pré-preenchida. O número está configurado como `5519995396281`.

---

## Contato do Desenvolvedor

Projeto criado com assistência de Claude (Anthropic).
Repositório: https://github.com/lucasferraripro/lovisa-destinos-site
