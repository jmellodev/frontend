// vite-css-obfuscator.js
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export default function cssObfuscator() {
  const classMap = {};
  const ignoredClasses = new Set(); // Adicione um Set para classes ignoradas

  // Funções auxiliares para gerar e obter o hash
  function getHash(className) {
    if (!classMap[className]) {
      const hash = crypto.createHash('md5').update(className).digest('hex');
      classMap[className] = 'jm_' + hash.substring(0, 5);
    }
    return classMap[className];
  }

  // Função para verificar se uma classe deve ser ignorada
  function shouldIgnoreClass(className) {
    // Adicione aqui outros prefixos ou classes específicas que você quer ignorar
    return className.startsWith('tw-') || ignoredClasses.has(className);
  }

  return {
    name: 'css-obfuscator',
    enforce: 'post', // Garante que roda depois de outros plugins
    apply: 'build',

    generateBundle(_, bundle) {
      if (process.env.NODE_ENV !== 'production') return;

      // Primeiro passo: Coletar e mapear classes do CSS
      Object.keys(bundle).forEach(fileName => {
        const asset = bundle[fileName];

        if (fileName.endsWith('.css') && asset.type === 'asset') {
          let content = asset.source;
          const classRegex = /\.([a-zA-Z0-9_-]+)/g;
          let match;

          while ((match = classRegex.exec(content)) !== null) {
            const className = match[1];
            if (!shouldIgnoreClass(className)) {
              getHash(className); // Garante que o hash é gerado para uso posterior
            } else {
              ignoredClasses.add(className); // Adiciona classes ignoradas ao Set
            }
          }
        }
      });

      // Segundo passo: Aplicar substituições em todos os arquivos
      Object.keys(bundle).forEach(fileName => {
        const asset = bundle[fileName];

        // Processa arquivos CSS
        if (fileName.endsWith('.css') && asset.type === 'asset') {
          let content = asset.source;

          Object.keys(classMap).forEach(className => {
            const hash = classMap[className];
            // Regex mais robusta para substituir a classe sem afetar partes de nomes maiores
            const regex = new RegExp(`\\.${className}([\\s:{,>~+.\\[\\\\"']|$)`, 'g'); // Linha corrigida
            content = content.replace(regex, `.${hash}$1`);
          });

          asset.source = content;
        }

        // Processa arquivos JS/HTML/Vue (já compilados para JS ou HTML)
        if (
          (fileName.endsWith('.js') && (asset.type === 'asset' || asset.type === 'chunk')) ||
          (fileName.endsWith('.html') && asset.type === 'asset')
        ) {
          let content = asset.type === 'asset' ? asset.source : asset.code;

          Object.keys(classMap).forEach(className => {
            const hash = classMap[className];

            // Padrões para substituir em JS/HTML.
            // FOQUE APENAS EM ATRIBUTOS HTML/JSX 'class' E 'className',
            // E POSSÍVEIS STRINGS QUE CLARAMENTE REPRESENTAM CLASSE CSS.
            const patterns = [
              // 1. Atributos HTML class="my-class" ou class='my-class'
              //    captura: class="qualquer-coisa my-class outra-coisa"
              new RegExp(`(class=["'])([^"']*)?\\b${className}\\b([^"']*)(["'])`, 'g'),
              // 2. Atributos Vue/React className="my-class" ou className='my-class'
              //    captura: className="qualquer-coisa my-class outra-coisa"
              new RegExp(`(className=["'])([^"']*)?\\b${className}\\b([^"']*)(["'])`, 'g'),
              // 3. Classes em literais de template ou strings JS/TS,
              //    MAS SOMENTE SE FOREM USADAS COMO SELETOR DE CLASSE (ex: '.my-class')
              //    Esta é mais arriscada, use com cautela.
              new RegExp(`(['"\`])\\.${className}(['"\`])`, 'g'), // ex: '.my-class'
              // 4. Ou se for uma classe única em uma string que pode ser passada para classList.add, etc.
              //    Ex: "my-class"
              new RegExp(`(['"\`])(${className})(['"\`])`, 'g'),
            ];

            patterns.forEach(regex => {
              content = content.replace(regex, (match, p1, p2 = '', p3 = '', p4) => {
                // Para padrões 1 e 2 (atributos class/className)
                if (p1.includes('class=') || p1.includes('className=')) {
                  // Reconstruir a string do atributo, substituindo apenas a classe desejada
                  const originalContent = `${p2}${className}${p3}`;
                  const replacedContent = originalContent.replace(new RegExp(`\\b${className}\\b`), hash);
                  return `${p1}${replacedContent}${p4}`;
                }
                // Para padrões 3 e 4 (strings de classe)
                if (p1 === "'" || p1 === '"' || p1 === '`') { // Delimitadores de string
                  return `${p1}${hash}${p3}`;
                }
                return match; // Retorna o original se não for um caso de substituição esperado
              });
            });
          });

          if (asset.type === 'asset') {
            asset.source = content;
          } else {
            asset.code = content;
          }
        }
      });
    }
  };
}