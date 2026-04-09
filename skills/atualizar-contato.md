# Skill: Atualizar Informações de Contato

## O que esta skill faz
Atualiza número de WhatsApp, e-mail, redes sociais e outros dados de contato da empresa no site inteiro.

---

## Dados de contato atuais

| Campo | Valor atual |
|-------|-------------|
| WhatsApp (wa.me) | `5519995396281` |
| WhatsApp (display) | `(19) 99539-6281` |
| Grupo VIP | `https://chat.whatsapp.com/H2DpRM8lAtnGrNjwWWcFVj` |
| E-mail | `contato@lovisadestinos.com.br` |
| Instagram | `https://www.instagram.com/lovisadestinos` |
| Localização | `Brasil` |
| Horário | `Seg–Sáb 8h–20h` |

---

## Trocar número de WhatsApp

Buscar e substituir em **todos os 3 arquivos HTML**:

```
Buscar:    5519995396281
Substituir: [novo número com DDI 55, sem espaços]

Buscar:    (19) 99539-6281
Substituir: [novo número formatado]
```

**Atenção:** O número aparece em múltiplos contextos:
- Links `href="https://wa.me/NUMERO"`
- JavaScript do formulário: `const url = \`https://wa.me/NUMERO?text=...\``
- Texto exibido na tela

---

## Trocar link do grupo VIP

Buscar e substituir em todos os arquivos:
```
Buscar:    chat.whatsapp.com/H2DpRM8lAtnGrNjwWWcFVj
Substituir: [novo link do grupo sem o https://]
```

---

## Trocar e-mail

Buscar e substituir:
```
Buscar:    contato@lovisadestinos.com.br
Substituir: [novo e-mail]
```

---

## Trocar Instagram

Buscar e substituir:
```
Buscar:    instagram.com/lovisadestinos
Substituir: instagram.com/[novo_usuario]
```

---

## Trocar horário de atendimento

Buscar por: `Seg–Sáb 8h–20h`
Aparece em `index.html` e `sobre.html` na seção de contato.

---

## Adicionar Facebook, YouTube ou TikTok

No footer de cada arquivo, dentro de `<div class="ft-social">`, adicionar:

```html
<!-- Facebook -->
<a href="https://facebook.com/PAGINA" target="_blank" aria-label="Facebook">
    <i class="fab fa-facebook-f"></i>
</a>

<!-- YouTube -->
<a href="https://youtube.com/@CANAL" target="_blank" aria-label="YouTube">
    <i class="fab fa-youtube"></i>
</a>

<!-- TikTok -->
<a href="https://tiktok.com/@USUARIO" target="_blank" aria-label="TikTok">
    <i class="fab fa-tiktok"></i>
</a>
```
