# Skill: Adicionar Novo Pacote/Destino

## O que esta skill faz
Adiciona um novo destino ao site, criando o card na página inicial e os dados completos na página de detalhes.

---

## Informações necessárias antes de começar

Colete estas informações do cliente:

```
ID único (sem espaços, minúsculas): ex: cancun, gramado, roma
Título: ex: "Cancún All Inclusive"
Subtítulo: ex: "O Caribe mais vibrante"
Localização: ex: "Cancún, México"
Duração: ex: "7 dias / 6 noites"
Preço: ex: "4.990,00"
Parcelas: ex: "10x de R$ 499"
País/Região (badge): ex: "México"
3 URLs de imagens (Unsplash recomendado)
Descrição do destino (2-3 parágrafos)
O que inclui (6-8 itens)
O que NÃO inclui (2-4 itens)
Itinerário dia a dia (título + descrição de cada dia)
```

---

## Passo 1 — Adicionar card no index.html

Abrir `index.html`, localizar a seção `<section id="destinos">` e adicionar dentro do grid de cards:

```html
<article class="dest-card rv" data-id="SEU_ID">
    <div class="dest-img">
        <img src="URL_IMAGEM_CARD" alt="Nome do Destino" loading="lazy">
        <div class="dest-badge">País</div>
    </div>
    <div class="dest-body">
        <h3>Título do Pacote</h3>
        <p class="dest-loc"><i class="fa-solid fa-location-dot"></i> Cidade, País</p>
        <div class="dest-meta">
            <span><i class="fa-solid fa-moon"></i> X dias / Y noites</span>
            <span class="dest-price">R$ X.XXX / pessoa</span>
        </div>
        <a href="pacote.html?id=SEU_ID" class="btn btn-accent" style="width:100%;text-align:center;margin-top:16px">
            Ver Roteiro <i class="fa-solid fa-arrow-right"></i>
        </a>
    </div>
</article>
```

---

## Passo 2 — Adicionar dados no pacote.html

Abrir `pacote.html`, localizar o objeto `const DB = {` no `<script>` do início, e adicionar uma nova entrada **antes do fechamento `};`**:

```javascript
SEU_ID: {
    title:    'Título do Pacote',
    subtitle: 'Subtítulo',
    location: 'Cidade, País',
    duration: 'X dias / Y noites',
    price:    'X.XXX,00',
    parcelas: 'Xx de R$ XXX',
    flag:     'País',
    images: [
        'https://URL_IMAGEM_1',
        'https://URL_IMAGEM_2',
        'https://URL_IMAGEM_3'
    ],
    desc: 'Descrição completa do destino. Pode ter 2-3 parágrafos separados por espaço.',
    inc: [
        'Item incluído 1',
        'Item incluído 2',
        'Item incluído 3',
        'Item incluído 4',
        'Item incluído 5',
        'Item incluído 6',
        'Seguro viagem completo'
    ],
    ninc: [
        'Item não incluído 1',
        'Item não incluído 2',
        'Item não incluído 3'
    ],
    days: [
        { t: 'Dia 1 — Título', d: 'Descrição do que acontece no dia 1.' },
        { t: 'Dia 2 — Título', d: 'Descrição do dia 2.' },
        { t: 'Dia 3 — Título', d: 'Descrição do dia 3.' },
        { t: 'Dia 4 — Título', d: 'Descrição do dia 4.' },
        { t: 'Dia 5 — Título', d: 'Descrição do dia 5.' },
        { t: 'Dia 6 — Título', d: 'Descrição do dia 6.' },
        { t: 'Dia 7 — Retorno', d: 'Transfer ao aeroporto e retorno com memórias incríveis.' }
    ]
},
```

---

## Passo 3 — Adicionar link no footer

No `index.html` e `pacote.html`, localizar a seção de links "Destinos" no footer e adicionar:

```html
<a href="pacote.html?id=SEU_ID">Nome do Destino</a>
```

---

## Passo 4 — Deploy

Após salvar os arquivos, rodar no terminal:
```bash
cd "C:/Users/win 10/Desktop/lovisa-destinos-site"
git add .
git commit -m "Adiciona pacote: Nome do Destino"
git push
```

O Vercel faz deploy automático após o push.

---

## Como encontrar imagens no Unsplash

1. Acesse https://unsplash.com
2. Pesquise pelo destino (ex: "Cancun beach")
3. Clique na foto desejada
4. Clique com botão direito → "Copiar endereço da imagem"
5. Adicione `?auto=format&fit=crop&w=1200&q=80` ao final da URL para cards de pacote
6. Use `w=700` para cards menores no index
