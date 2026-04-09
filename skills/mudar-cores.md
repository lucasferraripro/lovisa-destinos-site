# Skill: Mudar Cores do Site

## O que esta skill faz
Troca a paleta de cores do site inteiro. As cores são controladas por variáveis CSS centralizadas no `:root` de cada arquivo HTML.

---

## Localização das cores

Em cada arquivo HTML (`index.html`, `sobre.html`, `pacote.html`), procurar por:
```css
:root {
```
As variáveis ficam logo abaixo.

---

## Variáveis e o que controlam

| Variável | Cor Atual | Onde aparece |
|----------|-----------|-------------|
| `--navy` | `#1565C0` | Textos de logo, títulos de seção, backgrounds |
| `--navy-dark` | `#0D47A1` | Footer, hero de fundo, seções escuras |
| `--accent` | `#F97316` | Botões CTA, ícones coloridos, destaques |
| `--accent-d` | `#EA6C0A` | Hover dos botões de destaque |
| `--gold` | `#F97316` | Destaques secundários (mesmo laranja) |
| `--text` | `#1A1F2E` | Texto principal do site |
| `--muted` | `#6B7280` | Textos secundários, descrições |
| `--bg` | `#F8F9FC` | Background geral das páginas |
| `--white` | `#FFFFFF` | Brancos puros |
| `--border` | `#E5E9F2` | Bordas de cards e divisores |
| `--wa` | `#25D366` | Verde WhatsApp — NÃO MUDAR |

---

## Como trocar a cor principal (azul)

Substituir em **todos os 3 arquivos HTML**:
- `#1565C0` → nova cor primária
- `#0D47A1` → versão escura da nova cor (aprox. 20% mais escuro)

Também verificar em `sobre.html` onde as variáveis têm nomes diferentes:
- `--primary` = equivalente ao `--navy`
- `--primary-dark` = equivalente ao `--navy-dark`

---

## Como trocar a cor de destaque (laranja)

Substituir em **todos os 3 arquivos**:
- `#F97316` → nova cor de destaque
- `#EA6C0A` → versão hover (mais escuro)

---

## Exemplos de paletas alternativas

### Verde + Dourado (tema natureza/ecoturismo)
```css
--navy:      #1A6B3C;  /* verde floresta */
--navy-dark: #0F4525;
--accent:    #D4A017;  /* dourado */
--accent-d:  #B8880F;
```

### Roxo + Rosa (tema luxo/romance)
```css
--navy:      #5B2D8E;  /* roxo */
--navy-dark: #3D1A6B;
--accent:    #E91E8C;  /* rosa vibrante */
--accent-d:  #C4167A;
```

### Vermelho + Branco (tema corporativo)
```css
--navy:      #B71C1C;  /* vermelho escuro */
--navy-dark: #7F0000;
--accent:    #FF5252;  /* vermelho claro */
--accent-d:  #E53935;
```

---

## Ferramenta para escolher cores

Use https://coolors.co para gerar paletas harmoniosas.
Use https://www.color-hex.com para encontrar variações de uma cor.
