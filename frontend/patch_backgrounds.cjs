const fs = require('fs');
const path = require('path');

const pagesDir = path.join('c:', 'Users', 'rocky', 'Desktop', 'RAYA', 'Academic projects', 'carrer-path-web-', 'frontend', 'src', 'Pages');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Replace body{background:var(--paper); or body{background:#...;
  const bodyRegex = /body\s*\{\s*background\s*:\s*([^;]+);/g;
  content = content.replace(bodyRegex, (match, bgValue) => {
    if (!bgValue.includes('transparent')) {
      changed = true;
      return 'body{background:transparent;';
    }
    return match;
  });

  // Replace top-level backgrounds like background: '#ffffff', or background: 'var(--paper)'
  // A common pattern is style={{ ... background: 'var(--paper)' ... }}
  const styleRegex = /style=\{\{([^}]*)background:\s*['"](var\(--paper\)|#f[0-9a-fA-F]{2,5}|#fff|#ffffff|white)['"]([^}]*)\}\}/g;
  content = content.replace(styleRegex, (match, before, bgValue, after) => {
    // Only replace if it looks like a full page wrapper (e.g. minHeight 100vh or minHeight: "100vh")
    if (before.includes('100vh') || after.includes('100vh') || before.includes('minHeight') || after.includes('minHeight')) {
      changed = true;
      return `style={{${before}background: 'transparent'${after}}}`;
    }
    return match;
  });

  // Handle Predict.jsx which has injected CSS .predict-container
  if (filePath.endsWith('Predict.jsx')) {
    const rootBgRegex = /(.predict-container\s*\{[^}]*)background:\s*(#ffffff|#fff|#f9fafb|#fafaf8);/g;
    content = content.replace(rootBgRegex, (match, before, bgValue) => {
      changed = true;
      return `${before}background: transparent;`;
    });
  }

  // Handle Quiz.jsx style={{ minHeight: '100vh', background: '#f8fafc', ... }}
  const quizStyleRegex = /style=\{\{([^}]*)background:\s*['"](#f8fafc|#f1f5f9)['"]([^}]*)\}\}/g;
  content = content.replace(quizStyleRegex, (match, before, bgValue, after) => {
    if (before.includes('minHeight') || after.includes('minHeight')) {
      changed = true;
      return `style={{${before}background: 'transparent'${after}}}`;
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', path.basename(filePath));
  }
}

const files = fs.readdirSync(pagesDir);
files.forEach(file => {
  if (file.endsWith('.jsx')) {
    processFile(path.join(pagesDir, file));
  }
});
console.log('Done');
