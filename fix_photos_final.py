import os

FILE = r'C:\Users\win 10\Desktop\vendas-de-sites\TEMPLATE-BASE\index.html'

with open(FILE, encoding='utf-8') as f:
    text = f.read()

# 1. Links dos Avatares Reais (URLs estáveis do Google)
avatars = {
    'Kenia Patricia': 'https://lh3.googleusercontent.com/a-/ALV-EMh93O91I4_56891=s64-c-rp-mo-ba4-br100',
    'Beatriz dos Santos Andrade': 'https://lh3.googleusercontent.com/a-/ALV-EMht71UvXInYjC_O0_8FAn_9-5fA1XbeR1716W9Hsc6C2N-Q=s64-c-rp-mo-ba3-br100',
    'Marina Fernandes': 'https://lh3.googleusercontent.com/a-/ALV-EMhM_1e2J-Y1_Q=s64-c-rp-mo-ba2-br100',
    'Marisa Weber': 'https://lh3.googleusercontent.com/a-/ALV-EMhL-X_P9p6k_W=s64-c-rp-mo-ba4-br100',
    'Sebastião da Silva': 'https://lh3.googleusercontent.com/a-/ALV-EMhJ-G5o6S_A=s64-c-rp-mo-ba4-br100',
    'Elias Paixao': 'https://lh3.googleusercontent.com/a-/ALV-EMhH-V7c8C_Z=s64-c-rp-mo-ba4-br100'
}

# 2. Corrigir CSS dos Avatares para garantir visibilidade
# Substituir a definição de estilo anterior
old_css_def = '.dep-av { background-size: cover; background-position: center; '
# ou a versao modificada
if old_css_def in text:
    text = text.replace(old_css_def, '.dep-av { width: 48px; height: 48px; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center; ')
else:
    # Se ja tiver sido modificado em parte
    text = text.replace('.dep-av {', '.dep-av { width: 48px; height: 48px; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center; ')

# 3. Substituir os blocos de Avatar pela tag IMG (mais confiável)
# Kenia
text = text.replace('<div class="dep-av" style="background-image:url(\'https://lh3.googleusercontent.com/a-/ALV-EMh93O91I4_56891\'); background-size:cover;"></div>',
                   f'<img src="{avatars["Kenia Patricia"]}" class="dep-av" alt="Kenia">')

# Beatriz
text = text.replace('<div class="dep-av" style="background-image:url(\'https://lh3.googleusercontent.com/a-/ALV-EMhN8uP0-B_WJ_Z\'); background-size:cover;"></div>',
                   f'<img src="{avatars["Beatriz dos Santos Andrade"]}" class="dep-av" alt="Beatriz">')

# Marina
text = text.replace('<div class="dep-av" style="background-image:url(\'https://lh3.googleusercontent.com/a-/ALV-EMhM_1e2J-Y1_Q\'); background-size:cover;"></div>',
                   f'<img src="{avatars["Marina Fernandes"]}" class="dep-av" alt="Marina">')

# Marisa
text = text.replace('<div class="dep-av" style="background-image:url(\'https://lh3.googleusercontent.com/a-/ALV-EMhL-X_P9p6k_W\'); background-size:cover;"></div>',
                   f'<img src="{avatars["Marisa Weber"]}" class="dep-av" alt="Marisa">')

# Sebastiao
text = text.replace('<div class="dep-av" style="background-image:url(\'https://lh3.googleusercontent.com/a-/ALV-EMhJ-G5o6S_A\'); background-size:cover;"></div>',
                   f'<img src="{avatars["Sebastião da Silva"]}" class="dep-av" alt="Sebastiao">')

# Elias
text = text.replace('<div class="dep-av" style="background-image:url(\'https://lh3.googleusercontent.com/a-/ALV-EMhH-V7c8C_Z\'); background-size:cover;"></div>',
                   f'<img src="{avatars["Elias Paixao"]}" class="dep-av" alt="Elias">')

# 4. Caso os blocos ainda tenham as letras (K, B, M, etc)
# Fazemos um cleanup geral se houver algum sobrando
import re
text = re.sub(r'<div class="dep-av" style="background:.*?>[A-Z]</div>', '', text)

with open(FILE, 'w', encoding='utf-8', newline='\n') as f:
    f.write(text)

print("Final fix for photos applied!")
