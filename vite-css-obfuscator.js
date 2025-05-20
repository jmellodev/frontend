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
            // A prioridade aqui é ser preciso para não quebrar a aplicação.
            // Considera strings, classes em templates literais, etc.
            const patterns = [
              // Atributos HTML class="my-class" ou class='my-class'
              new RegExp(`class=["']([^"']*)?\\b${className}\\b([^"']*)?["']`, 'g'),
              // Atributos Vue/React className="my-class" ou className='my-class'
              new RegExp(`className=["']([^"']*)?\\b${className}\\b([^"']*)?["']`, 'g'),
              // Classes em literais de template ou strings JS/TS: `.${my-class}` ou `my-class`
              new RegExp(`\\b${className}\\b`, 'g'),
            ];

            patterns.forEach(regex => {
              // A substituição precisa ser mais cuidadosa para manter outras classes
              // e o contexto do atributo ou string.
              // Ex: class="class-a my-class class-b" -> class="class-a _abcd class-b"
              content = content.replace(regex, (match, p1 = '', p2 = '') => {
                // Se for um atributo class/className, reconstruir a string
                if (match.includes('class=') || match.includes('className=')) {
                  const originalClasses = `${p1}${className}${p2}`;
                  const replacedClasses = originalClasses.replace(new RegExp(`\\b${className}\\b`), hash);
                  return match.replace(originalClasses, replacedClasses);
                }
                // Para outras ocorrências genéricas (dentro de strings)
                return match.replace(new RegExp(`\\b${className}\\b`), hash);
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