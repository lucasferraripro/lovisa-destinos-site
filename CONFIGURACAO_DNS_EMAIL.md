# Configuração DNS e E-mail - Lovisa Destinos

## Data: 05/05/2026

## Situação resolvida
Após migrar o site para o Vercel, os e-mails ficaram sem apontamento (estavam no Terra antes).
A configuração foi refeita para manter o e-mail no Terra e o site no Vercel.

---

## Configuração atual da Zona DNS (Registro.br)

| Tipo  | Nome                        | Dados                    |
|-------|-----------------------------|--------------------------|
| A     | lovisadestinos.com.br       | 76.76.21.21 (Vercel)     |
| CNAME | www.lovisadestinos.com.br   | lovisadestinos.com.br    |
| MX    | lovisadestinos.com.br       | 10 smtpin.terra.com.br   |

---

## Resumo
- **Site** hospedado no **Vercel** → IP `76.76.21.21` ✅
- **E-mail** hospedado no **Terra** → `smtpin.terra.com.br` ✅
- **Domínio** registrado no **Registro.br** ✅
- Plano de e-mail do Terra: **ativo e sendo pago** (5 caixas de e-mail)

---

## Como acessar para editar
1. Acesse: https://registro.br
2. Login: usuário VJSMO8 (Vania Moreira)
3. Painel → Domínios → lovisadestinos.com.br
4. DNS → Configurar zona DNS → Modo Avançado

---

## Observações
- O Registro.br exige que o domínio não esteja "em transição" para editar a zona DNS
- Após mudanças no DNS, aguardar entre 30 min a 2 horas para propagar
- Não usar a opção "Provedor de Serviços" para configurar e-mail — usar sempre a Zona DNS
