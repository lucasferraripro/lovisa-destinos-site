import subprocess
import re

REPO = r'C:\Users\win 10\Desktop\vendas-de-sites\TEMPLATE-BASE'

# Get the LAST GOOD commit before the PowerShell damage
# fa11872 = feat commit (before power shell mess)
# 50a0894 = fix instagram (still before powershell mess)
# c3a743e = fix that used powershell -> CORRUPT

# Read bytes from the last good commit (50a0894)
result = subprocess.run(
    ['git', 'cat-file', 'blob', '50a0894:index.html'],
    capture_output=True,
    cwd=REPO
)
data = result.stdout
print(f"Bytes from 50a0894: {len(data)}")

# Check if this one is clean
sample = data[:600].decode('utf-8', errors='replace')
print(f"Sample: {sample[500:600]}")

# Try to decode
text = data.decode('utf-8')
# Check for double encoding
if 'Ã' in text[:2000]:
    print("Also corrupted at 50a0894!")
    # Try to fix char by char
    try:
        fixed = text.encode('latin-1').decode('utf-8')
        print(f"Fixed OK, len={len(fixed)}, has Início: {'Início' in fixed}")
    except:
        print("Can't fix with simple approach")
        
    # Use ftfy approach: fix known mojibake pairs
    fixes = [
        ('Ã\x83Â\xa3', 'ã'), ('Ã\x83Â\xa0', 'à'), ('Ã\x83Â\xa2', 'â'),
        ('Ã\x83Â±', 'ñ'), ('Ã\x83Â©', 'é'), ('Ã\x83Â\xaa', 'ê'),
        ('Ã\x83Â\xad', 'í'), ('Ã\x83Â³', 'ó'), ('Ã\x83Â\xba', 'ú'),
        ('Ã\x83Â\xa7', 'ç'), ('Ã\x83Â\x95', 'Õ'), ('Ã\x83Â\x87', 'Ç'),
        ('Ã\x83Â\x89', 'É'), ('Ã\x83Â\x8d', 'Í'), ('Ã\x83Â\x93', 'Ó'),
        ('Ã\x83Â\x9a', 'Ú'), ('Ã\x83Â\x80', 'À'),
        # simpler patterns from double UTF-8
        ('Ã³', 'ó'), ('Ã¡', 'á'), ('Ã\xa3', 'ã'), ('Ã©', 'é'),
        ('Ã\xaa', 'ê'), ('Ã­', 'í'), ('Ã\xba', 'ú'), ('Ã§', 'ç'),
        ('Ã\xa0', 'à'), ('Ã\xa2', 'â'), ('Ã\x95', 'Õ'), ('Ã\x87', 'Ç'),
        ('Ã\x89', 'É'), ('Ã\x8d', 'Í'), ('Ã\x93', 'Ó'), ('Ã\x9a', 'Ú'),
        ('Ã\x80', 'À'), ('Â\xb7', '·'), ('â\x80\x94', '—'), 
        ('â\x80\x99', "'"), ('â\x80\x9c', '"'), ('â\x80\x9d', '"'),
        ('â\x98\x85', '★'), ('â\x9b\x85', '⭐'), ('â\x9c\x93', '✓'),
        ('â\x9c\x95', '✕'), ('â\x9e\x95', '➕'), ('â\x9e\x96', '➖'),
        ('â†\x90', '←'), ('â†\x92', '→'), ('â†\x99', '↙'),
        ('đ\x9f\x8d\x96', '🍖'), ('đ\x9f\x92', '💒'),
    ]
    
    # The actual fix for this type of mojibake: encode text as bytes(latin-1), decode as utf-8
    # But we have chars outside latin-1 range that are emoji etc. 
    # Strategy: fix only the known bad patterns
    fixed2 = text
    
    # Fix Ã followed by a combining char - this is the classic pattern
    # Ã (0xC3) + something = UTF-8 2-byte sequence misread as two chars
    
    # Let's do it properly: find all Ã+ sequences and fix
    def fix_mojibake(s):
        result = []
        i = 0
        s_bytes = s.encode('utf-8')
        # Find the actual problem: bytes that form UTF-8 sequences but were double-encoded
        # The file has bytes like: C3 83 C2 A3 which is UTF-8 encoding of Ã£ (which itself decodes as ã)
        # So we need to: decode bytes as utf-8 -> get Ãã type chars -> encode as latin-1 -> decode as utf-8
        try:
            fixed_bytes = s.encode('latin-1')
            return fixed_bytes.decode('utf-8')
        except:
            return s
    
    # Do selective fix: only the accented characters
    import re
    
    def selective_fix(text):
        # Pattern: byte sequences that look like double-encoded UTF-8
        # In python string: Ã followed by a char like £, ©, ±, etc.
        # These are bytes: C3 A3, C3 A9, C3 B3, C3 BA, C3 A7, C3 AD, etc.
        # When UTF-8 decoded, C3 maps to 'Ã' (U+00C3) and each following byte maps to its char
        
        result = list(text)
        i = 0
        out = []
        while i < len(text):
            c = text[i]
            # Check if this is start of double-encoded sequence
            if ord(c) >= 0xC2 and ord(c) <= 0xC3 and i + 1 < len(text):
                next_c = text[i+1]
                if 0x80 <= ord(next_c) <= 0xFF:
                    # This looks like double-encoded: encode both as latin-1, decode as utf-8
                    try:
                        pair_bytes = bytes([ord(c), ord(next_c)])
                        decoded = pair_bytes.decode('utf-8')
                        out.append(decoded)
                        i += 2
                        continue
                    except:
                        pass
            out.append(c)
            i += 1
        return ''.join(out)
    
    fixed3 = selective_fix(text)
    print(f"Fixed3 len: {len(fixed3)}")
    
    # Find 'Início' in fixed3
    idx = fixed3.find('Início')
    if idx >= 0:
        print(f"SUCCESS: Found 'Início' at {idx}")
    else:
        idx = fixed3.find('In')
        if idx >= 0:
            print(f"Near 'In' chars: {repr(fixed3[idx:idx+20])}")
    
    # Find nav
    idx2 = fixed3.find('#home')
    print(f"Near #home: {repr(fixed3[idx2-5:idx2+50])}")
    
    # Save
    with open(REPO + r'\index.html', 'w', encoding='utf-8', newline='\n') as f:
        f.write(fixed3)
    print(f"Saved with selective fix!")

else:
    print("50a0894 is CLEAN!")
    with open(REPO + r'\index.html', 'w', encoding='utf-8', newline='\n') as f:
        f.write(text)
    print(f"Saved clean version, len={len(text)}")
