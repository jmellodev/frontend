<template>
  <div class="relative inline-block w-11 h-5 ml-4">
    <input :checked="isDark" @change="toggleThemeWithRipple" id="theme-switch" type="checkbox" class="peer appearance-none w-11 h-5 rounded-full cursor-pointer transition-colors duration-300
             bg-gray-300 dark:bg-gray-700 checked:bg-blue-600 dark:checked:bg-blue-600" />
    <label for="theme-switch"
      class="absolute top-0 left-0 w-5 h-5 bg-white dark:bg-gray-200 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm transition-transform duration-300
             peer-checked:translate-x-6 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 cursor-pointer flex items-center justify-center">
      <i v-if="isDark" class="fa-solid fa-moon text-yellow-500 text-xs"></i>
      <i v-else class="fa-solid fa-sun text-orange-400 text-xs"></i>
    </label>
    <span class="sr-only">Toggle Theme</span>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const isDark = ref(false);

const setTheme = (dark) => {
  isDark.value = dark;
  if (dark) {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    localStorage.setItem("theme", "light");
  }
};

const toggleThemeWithRipple = (event) => {
  const targetIsDark = !isDark.value; // Calcula o estado do tema de destino

  const rippleElement = document.createElement('div');
  rippleElement.classList.add('theme-ripple-effect'); // Uma classe opcional para identificação

  // Calcula a posição do clique ou do centro do toggle
  let clientX, clientY;
  if (event && event.clientX && event.clientY) {
    clientX = event.clientX;
    clientY = event.clientY;
  } else {
    const toggleElement = document.getElementById('theme-switch');
    if (toggleElement) {
      const rect = toggleElement.getBoundingClientRect();
      clientX = rect.left + rect.width / 2;
      clientY = rect.top + rect.height / 2;
    } else {
      clientX = window.innerWidth / 2;
      clientY = window.innerHeight / 2;
    }
  }

  // Define a cor do tema de destino para o gradiente
  const themeColor = targetIsDark ? '#fff' : '#1a202c'; // Cores Tailwind: gray-900 ou white

  // **Configurações Iniciais do Ripple Element**
  rippleElement.style.position = 'fixed';
  rippleElement.style.top = '0';
  rippleElement.style.left = '0';
  rippleElement.style.width = '100vw';
  rippleElement.style.height = '100vh';
  rippleElement.style.zIndex = '9999';
  rippleElement.style.pointerEvents = 'none'; // Não interfere com cliques

  // Define o `radial-gradient` com o centro no ponto do clique
  rippleElement.style.backgroundImage = `radial-gradient(circle at ${clientX}px ${clientY}px, transparent 25%, ${themeColor} 25.5%)`;

  // Define o `background-size` inicial.
  // IMPORTANTE: Este valor deve ser o mesmo do seu estado inicial no CSS (`100% 100%`).
  rippleElement.style.backgroundSize = '100% 100%';
  rippleElement.style.backgroundRepeat = 'no-repeat'; // Para garantir que o gradiente não se repita

  // A transição será APENAS para `background-size`
  // O tempo da transição pode ser ajustado aqui (ex: '0.7s', '1s')
  rippleElement.style.transition = 'background-size 1s ease-out';

  document.body.appendChild(rippleElement);

  // --- AQUI É A PARTE CRÍTICA PARA GARANTIR A ANIMAÇÃO ---
  // Força o reflow para que o navegador renderize o `background-size: 100%`
  // antes de aplicar a mudança para o estado final.
  void rippleElement.offsetWidth;

  // **Inicia a Animação**
  // Aumenta o `background-size` para expandir o anel
  // O valor '400% 400%' deve ser suficiente para cobrir a tela.
  // Se precisar de mais cobertura, aumente esse valor (ex: '800% 800%').
  requestAnimationFrame(() => {
    rippleElement.style.backgroundSize = '400% 400%';
  });

  setTheme(targetIsDark); // Altera o tema real do documento
  // Remove o elemento e aplica o tema real quando a transição do background-size termina
  rippleElement.addEventListener('transitionend', (e) => {
    // Garante que é a transição da propriedade 'background-size' que terminou
    if (e.propertyName === 'background-size') {
      rippleElement.remove(); // Remove o elemento ripple
    }
  }, { once: true }); // Executa o listener apenas uma vez
};

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme === "dark");
  } else {
    setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }
});
</script>