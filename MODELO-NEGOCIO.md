# MODELO DE NEGÓCIO — SITE PREVIEW → SITE COMPLETO
*Sistema de prospecção e entrega de sites para agências de viagens*

---

## VISÃO GERAL

```
LUCAS faz a abordagem
       ↓
Cliente diz "quero ver"
       ↓
IA cria o PREVIEW em ~5 min (só nome + logo + WhatsApp)
       ↓
Lucas envia o link de preview
       ↓
Cliente gosta → decide comprar
       ↓
IA cria o SITE COMPLETO com painel editor (~2–4h)
       ↓
Lucas entrega site + painel + instrução de uso
```

---

## DOIS MODOS DE OPERAÇÃO

### MODO 1 — PREVIEW RÁPIDO (5–10 minutos)
**Objetivo:** impressionar o cliente sem ele ter pedido nada.

O que inclui:
- Site completo visualmente (home, pacotes, sobre, galeria de clientes)
- Nome e logo da agência do cliente
- WhatsApp e cidade do cliente
- **Todo o restante usa o conteúdo modelo** (pacotes, fotos, depoimentos, cores)
- Sem painel de edição
- URL: `nome-da-agencia-preview.vercel.app`

O que o cliente vê: um site lindo, responsivo, com o nome/logo dele — funcionando de verdade.

### MODO 2 — SITE COMPLETO (2–4 horas)
**Objetivo:** entregar o site definitivo após o cliente decidir comprar.

O que inclui:
- Tudo personalizado: pacotes, fotos, textos, depoimentos, cores, sobre
- Painel editor visual (a dona edita sem saber programar)
- Domínio personalizado (se o cliente tiver)
- URL definitiva

---

## FLUXO COMPLETO — PASSO A PASSO

### ETAPA 1: ABORDAGEM (Lucas → Cliente)
- Lucas envia mensagem de prospecção (ver arquivo ABORDAGEM-CLIENTE.md)
- Não pede nada ainda — só pergunta se quer ver

### ETAPA 2: CLIENTE DIZ "SIM"
- Lucas pede APENAS 3 coisas:
  1. Logo da agência (foto, PNG, ou qualquer imagem)
  2. Número do WhatsApp de contato
  3. Nome da cidade que atende

### ETAPA 3: CRIAR O PREVIEW
- Lucas abre o Claude Code (ou outra IA)
- Cola o PROMPT-PREVIEW-RAPIDO.md + preenche o DADOS-PREVIEW.md
- IA faz tudo em ~5 minutos:
  - Duplica o site
  - Substitui logo, nome, WhatsApp, cidade
  - Faz deploy no Vercel automaticamente
  - Retorna o link pronto

### ETAPA 4: ENVIAR O PREVIEW
- Lucas manda o link para o cliente
- Diz para abrir no celular
- Aguarda a reação

### ETAPA 5A: CLIENTE NÃO GOSTOU
- Agradece, segue em frente
- (Custo: ~5 minutos de trabalho)

### ETAPA 5B: CLIENTE GOSTOU → PITCH DE VENDA
- Lucas explica o que está incluso no site completo
- Apresenta o valor (ver modelo de proposta abaixo)
- Combina os dados necessários para personalização total

### ETAPA 6: CRIAR O SITE COMPLETO
- Lucas usa o PROMPT-PARA-IA.md + DADOS-NOVA-EMPRESA.md preenchido
- IA faz a replicação completa (~2–4h com todos os dados)
- Deploy com domínio personalizado (se tiver)

### ETAPA 7: ENTREGA
- Lucas envia: URL do site + URL do editor + email + senha
- Envia o COMO-EDITAR.md como manual
- Suporte pós-entrega (opcional: cobrar manutenção mensal)

---

## PRECIFICAÇÃO SUGERIDA

| Produto | O que inclui | Valor sugerido |
|---------|-------------|---------------|
| **Preview** | Site modelo com nome/logo | Grátis (isca) |
| **Site Básico** | Site completo personalizado, sem editor | R$ 497 |
| **Site Completo** | Site + editor visual + instrução de uso | R$ 997 |
| **Site Premium** | Tudo + domínio + manutenção 3 meses | R$ 1.497 |
| **Manutenção** | Suporte mensal, atualizações | R$ 97/mês |

---

## PROPOSTA COMERCIAL — MODELO

```
[NOME], que bom que gostou do preview! 🎉

O site completo inclui tudo isso personalizado com sua marca:

✅ Página inicial com seus pacotes e destinos
✅ Página de cada destino (fotos, roteiro, preços, o que inclui)
✅ Página "Sobre Nós" com sua história
✅ Galeria de clientes / viajantes
✅ Formulário de orçamento direto no WhatsApp
✅ Site 100% adaptado para celular (seus clientes compram pelo celular!)
✅ Painel editor — você muda fotos e textos sem saber programar
✅ Funciona como um catálogo digital sempre atualizado

Investimento: R$ 997 (pagamento único)
Prazo de entrega: até 48h após receber todas as informações.

O que preciso da sua parte:
- Logo da agência
- Fotos dos seus destinos (ou autorizo usar fotos do Google)
- Textos sobre sua empresa (ou crio para você)
- Seus pacotes com preços

Topas? 🚀
```

---

## O QUE A IA FAZ VS O QUE LUCAS FAZ

### IA faz (automático):
- Duplicar o site
- Substituir nome, logo, WhatsApp, cores, textos
- Criar banco de dados de pacotes
- Deploy no Vercel
- Configurar painel de edição

### Lucas faz (manual, ~15 min):
- Criar conta GitHub (se necessário)
- Criar repositório no GitHub
- Configurar variáveis no Vercel (GITHUB_TOKEN + ADMIN_SECRET)
- Conectar domínio (se tiver)
- Testar o site antes de entregar

---

## CHECKLIST DE QUALIDADE ANTES DE ENTREGAR

- [ ] Site abre no celular sem erros
- [ ] WhatsApp correto ao clicar nos botões
- [ ] Logo aparece corretamente
- [ ] Páginas de pacotes carregam
- [ ] Formulário de orçamento funciona
- [ ] Editor (se incluso): login funciona e consegue editar e publicar
- [ ] Testar em iPhone E Android

---

*Sistema criado a partir do projeto Lovisa Destinos — Abril 2026*
