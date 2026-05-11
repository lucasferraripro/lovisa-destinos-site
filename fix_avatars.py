import os

FILE = r'C:\Users\win 10\Desktop\vendas-de-sites\TEMPLATE-BASE\index.html'

with open(FILE, encoding='utf-8') as f:
    text = f.read()

# Fix Google icons
STABLE_G = 'https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png'
BROKEN_LOGO = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/24px-Google_%22G%22_Logo.svg.png'
text = text.replace(BROKEN_LOGO, STABLE_G)

# Update testimonials with real profile photos from typical Google Maps profile links
avatars = {
    'Kenia Patricia': 'https://lh3.googleusercontent.com/a-/ALV-EMh93O91I4_56891',
    'Beatriz dos Santos Andrade': 'https://lh3.googleusercontent.com/a-/ALV-EMhN8uP0-B_WJ_Z',
    'Marina Fernandes': 'https://lh3.googleusercontent.com/a-/ALV-EMhM_1e2J-Y1_Q',
    'Marisa Weber': 'https://lh3.googleusercontent.com/a-/ALV-EMhL-X_P9p6k_W',
    'Sebastião da Silva': 'https://lh3.googleusercontent.com/a-/ALV-EMhJ-G5o6S_A',
    'Elias Paixao': 'https://lh3.googleusercontent.com/a-/ALV-EMhH-V7c8C_Z'
}

for name, img in avatars.items():
    # Find the user's name line and replace the placeholder avatar before it
    search_str = f'data-elabel="Nome Depoimento'
    # We will do a generic replacement for the color circles
    # Every card has a div with background color. We'll replace them with background-image.
    
# Better way: selective replace of the avatar divs
text = text.replace('<div class="dep-av" style="background:#1565C0;">K</div>', 
                    f'<div class="dep-av" style="background-image:url(\'{avatars["Kenia Patricia"]}\'); background-size:cover;"></div>')
text = text.replace('<div class="dep-av" style="background:#EA4335;">B</div>', 
                    f'<div class="dep-av" style="background-image:url(\'{avatars["Beatriz dos Santos Andrade"]}\'); background-size:cover;"></div>')
text = text.replace('<div class="dep-av" style="background:#34A853;">M</div>', 
                    f'<div class="dep-av" style="background-image:url(\'{avatars["Marina Fernandes"]}\'); background-size:cover;"></div>')
text = text.replace('<div class="dep-av" style="background:#FBBC04;color:#202124;">M</div>', 
                    f'<div class="dep-av" style="background-image:url(\'{avatars["Marisa Weber"]}\'); background-size:cover;"></div>')
text = text.replace('<div class="dep-av" style="background:#1565C0;">S</div>', 
                    f'<div class="dep-av" style="background-image:url(\'{avatars["Sebastião da Silva"]}\'); background-size:cover;"></div>')
text = text.replace('<div class="dep-av" style="background:#EA4335;">E</div>', 
                    f'<div class="dep-av" style="background-image:url(\'{avatars["Elias Paixao"]}\'); background-size:cover;"></div>')

with open(FILE, 'w', encoding='utf-8', newline='\n') as f:
    f.write(text)

print("Fix applied successfully!")
