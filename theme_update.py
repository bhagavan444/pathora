import sys

file_path = 'frontend/src/Pages/Quiz.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace dark mode GlassCard styles with light mode Apple-like glass styles
old_glass_card = '''const GlassCard = ({ children, style, className, onClick }) => (
  <div
    className={`glass-card ${className || ''}`}
    onClick={onClick}
    style={{
      background: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      borderRadius: '24px',
      ...style
    }}
  >
    {children}
  </div>
);'''

new_glass_card = '''const GlassCard = ({ children, style, className, onClick }) => (
  <div
    className={`glass-card ${className || ''}`}
    onClick={onClick}
    style={{
      background: 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(30px) saturate(150%)',
      WebkitBackdropFilter: 'blur(30px) saturate(150%)',
      border: '1px solid rgba(255, 255, 255, 0.6)',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.05)',
      borderRadius: '24px',
      ...style
    }}
  >
    {children}
  </div>
);'''

content = content.replace(old_glass_card, new_glass_card)

# Update colors for Light Theme
content = content.replace("color: '#f8fafc'", "color: '#0f172a'") # Headings to dark gray
content = content.replace("color: '#94a3b8'", "color: '#475569'") # Subtext to medium gray
content = content.replace("color: '#cbd5e1'", "color: '#334155'") # Secondary text to darker gray
content = content.replace("color: '#c4b5fd'", "color: '#6366f1'") # Purple subtle text to more solid purple

# Backgrounds and borders
content = content.replace("rgba(30, 41, 59, 0.6)", "rgba(255, 255, 255, 0.8)") # Domain hover
content = content.replace("rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.6)") # Hover glow
content = content.replace("rgba(255, 255, 255, 0.2)", "rgba(255, 255, 255, 0.9)") # Hover glow border
content = content.replace("rgba(255, 255, 255, 0.03)", "rgba(255, 255, 255, 0.5)") # Quiz card btnBg
content = content.replace("rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.6)") # Common borders
content = content.replace("rgba(255, 255, 255, 0.05)", "rgba(255, 255, 255, 0.8)") # Quiz card iconBg

# Fix neural spinner text color that might have been changed
content = content.replace("color: '#0f172a', fontSize: '18px'", "color: '#0f172a', fontSize: '18px'")

# Quiz card styling updates specifically
content = content.replace("btnColor = '#334155';", "btnColor = '#1e293b';")
content = content.replace("btnColor = '#475569';", "btnColor = '#64748b';")

# Dashboard matrix gradient backgrounds
content = content.replace(
    "background: 'linear-gradient(135deg, rgba(15,23,42,0.6) 0%, rgba(30,27,75,0.6) 100%)'",
    "background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(240,240,255,0.7) 100%)'"
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Styles successfully updated to light glossy theme.')
