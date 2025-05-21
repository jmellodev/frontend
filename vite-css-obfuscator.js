// vite-css-obfuscator.js
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export default function cssObfuscator() {
  const classMap = {};
  const ignoredClasses = new Set();

  function getHash(className) {
    if (!classMap[className]) {
      const hash = crypto.createHash('md5').update(className).digest('hex');
      classMap[className] = '_' + hash.substring(0, 4);
    }
    return classMap[className];
  }

  function shouldIgnoreClass(className) {
    return className.startsWith('tw-') || ignoredClasses.has(className);
  }

  return {
    name: 'css-obfuscator',
    enforce: 'post',
    apply: 'build',

    generateBundle(_, bundle) {
      if (process.env.NODE_ENV !== 'production') return;

      console.log('--- CSS Obfuscator: Starting generateBundle ---');

      // Primeiro passo: Coletar e mapear classes do CSS
      Object.keys(bundle).forEach(fileName => {
        const asset = bundle[fileName];
        if (fileName.endsWith('.css') && asset.type === 'asset') {
          console.log(`Collecting classes from CSS: ${fileName}`);
          let content = asset.source;
          const classRegex = /\.([a-zA-Z0-9_-]+)/g;
          let match;
          while ((match = classRegex.exec(content)) !== null) {
            const className = match[1];
            if (!shouldIgnoreClass(className)) {
              getHash(className);
            } else {
              ignoredClasses.add(className);
            }
          }
        }
      });
      console.log('Class Map:', classMap);
      console.log('Ignored Classes:', ignoredClasses);

      // Segundo passo: Aplicar substituições em todos os arquivos
      Object.keys(bundle).forEach(fileName => {
        const asset = bundle[fileName];

        // Processa arquivos CSS
        if (fileName.endsWith('.css') && asset.type === 'asset') {
          console.log(`Processing CSS file: ${fileName}`);
          let content = asset.source;
          Object.keys(classMap).forEach(className => {
            const hash = classMap[className];
            const regex = new RegExp(`\\.${className}([\\s:{,>~+.\\[\\\\"']|$)`, 'g');
            content = content.replace(regex, `.${hash}$1`);
          });
          asset.source = content;
        }

        // Processa arquivos JS/HTML
        if (
          (fileName.endsWith('.js') && (asset.type === 'asset' || asset.type === 'chunk')) ||
          (fileName.endsWith('.html') && asset.type === 'asset')
        ) {
          console.log(`Processing HTML/JS file: ${fileName}`);
          let content = asset.type === 'asset' ? asset.source : asset.code;

          // Guardar o conteúdo original para comparar depois
          const originalContent = content;

          Object.keys(classMap).forEach(className => {
            const hash = classMap[className];

            const patterns = [
              new RegExp(`(class=["'])([^"']*)?\\b${className}\\b([^"']*)(["'])`, 'g'),
              new RegExp(`(className=["'])([^"']*)?\\b${className}\\b([^"']*)(["'])`, 'g'),
              new RegExp(`(['"\`])\\.${className}(['"\`])`, 'g'),
              new RegExp(`(['"\`])(${className})(['"\`])`, 'g'),
            ];

            patterns.forEach(regex => {
              let replaced = false; // Flag para verificar se alguma substituição ocorreu
              content = content.replace(regex, (match, p1, p2 = '', p3 = '', p4) => {
                // console.log(`  Match for ${className} in ${fileName}:`, { match, p1, p2, p3, p4 }); // Debug mais detalhado
                replaced = true;
                if (p1.includes('class=') || p1.includes('className=')) {
                  const originalClassListContent = `${p2}${className}${p3}`;
                  const replacedClassListContent = originalClassListContent.replace(new RegExp(`\\b${className}\\b`), hash);
                  return `${p1}${replacedClassListContent}${p4}`;
                }
                if (p1 === "'" || p1 === '"' || p1 === '`') {
                  if (match.includes(`.${className}`)) { // Pattern 3
                    return `${p1}.${hash}${p3}`;
                  } else { // Pattern 4
                    return `${p1}${hash}${p3}`;
                  }
                }
                return match;
              });
              // if (replaced) { // Log apenas se houve substituição para essa classe
              //     console.log(`  Replaced "${className}" with "${hash}" in ${fileName}`);
              // }
            });
          });

          if (content !== originalContent) {
            console.log(`  Changes made to ${fileName} (HTML/JS).`);
            if (fileName.endsWith('.html')) {
              // Log da diferença para HTML
              // console.log("  Original vs Modified HTML:");
              // console.log("  Original:", originalContent.substring(0, 500));
              // console.log("  Modified:", content.substring(0, 500));
            }
          }


          if (asset.type === 'asset') {
            asset.source = content;
          } else {
            asset.code = content;
          }
        }
      });
      console.log('--- CSS Obfuscator: Finished generateBundle ---');
    }
  };
}