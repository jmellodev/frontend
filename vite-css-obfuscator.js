// vite-css-obfuscator.js
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export default function cssObfuscator() {
  const classMap = {};

  // Gera um hash curto para cada classe
  function getHash(className) {
    if (!classMap[className]) {
      const hash = crypto.createHash('md5').update(className).digest('hex');
      classMap[className] = '_' + hash.substring(0, 4);
    }
    return classMap[className];
  }

  return {
    name: 'css-obfuscator',
    enforce: 'post',
    apply: 'build',

    generateBundle(_, bundle) {
      // Só executar em produção
      if (process.env.NODE_ENV !== 'production') return;

      // Percorre todos os arquivos do bundle
      Object.keys(bundle).forEach(fileName => {
        const asset = bundle[fileName];

        // Processa arquivos CSS
        if (fileName.endsWith('.css') && asset.type === 'asset') {
          let content = asset.source;

          // Extrai todas as classes CSS
          const classRegex = /\.([a-zA-Z0-9_-]+)/g;
          let match;
          const classes = new Set();

          while ((match = classRegex.exec(content)) !== null) {
            classes.add(match[1]);
          }

          // Substitui as classes pelo hash
          classes.forEach(className => {
            // Ignora classes que começam com tw- ou outras que você queira preservar
            if (className.startsWith('tw-')) return;

            const hash = getHash(className);
            const regex = new RegExp(`\\.${className}([\\s:{,.]|$)`, 'g');
            content = content.replace(regex, `.${hash}$1`);
          });

          asset.source = content;
        }

        // Processa arquivos JS/HTML para substituir referências às classes
        if ((fileName.endsWith('.js') || fileName.endsWith('.html')) && asset.type === 'asset' || asset.type === 'chunk') {
          let content = asset.type === 'asset' ? asset.source : asset.code;

          // Substitui referências às classes em strings e templates literais
          Object.keys(classMap).forEach(className => {
            // Padrões comuns de classes no JS/HTML
            const patterns = [
              `class="${className}"`,
              `class='${className}'`,
              `className="${className}"`,
              `className='${className}'`,
              `class: "${className}"`,
              `class: '${className}'`,
              `"${className}"`,
              `'${className}'`
            ];

            patterns.forEach(pattern => {
              const replacement = pattern.replace(className, classMap[className]);
              content = content.replace(new RegExp(pattern, 'g'), replacement);
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