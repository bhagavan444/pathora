import sys
import re

file_path = 'frontend/src/Pages/Quiz.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace any remaining light gray/white text colors that were missed
content = re.sub(r'(?i)#cbd5e1', '#334155', content)
content = re.sub(r'(?i)#94a3b8', '#475569', content)
content = re.sub(r'(?i)#f8fafc', '#0f172a', content)
# We need to make sure the main button still has white text, but I didn't change #fff.

# Let's also check for #c4b5fd which is light purple
content = re.sub(r'(?i)#c4b5fd', '#6366f1', content)

# Check for #f59e0b (amber)
# Amber is fine on light background.

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Colors comprehensively updated for light theme.')
