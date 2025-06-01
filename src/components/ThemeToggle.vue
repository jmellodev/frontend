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

// Função para aplicar o tema (adiciona/remove classe 'dark' e salva no localStorage)
// Esta função agora é chamada APÓS o ripple cobrir a tela.
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

// Função para iniciar o efeito de ripple e, em seguida, alterar o tema
const toggleThemeWithRipple = (event) => {
  const targetIsDark = !isDark.value; // Calcula o estado do tema de destino

  const ripple = document.createElement('div');
  ripple.classList.add('theme-ripple-effect');

  // Calcula a posição do clique ou do centro do toggle
  let clientX, clientY;
  if (event && event.clientX && event.clientY) {
    clientX = event.clientX;
    clientY = event.clientY;
  } else {
    // Fallback para o centro do toggle se o evento não estiver disponível
    const toggleElement = document.getElementById('theme-switch');
    if (toggleElement) {
      const rect = toggleElement.getBoundingClientRect();
      clientX = rect.left + rect.width / 2;
      clientY = rect.top + rect.height / 2;
    } else {
      // Fallback para o centro da tela
      clientX = window.innerWidth / 2;
      clientY = window.innerHeight / 2;
    }
  }

  // Calcula o tamanho do círculo para cobrir toda a tela
  const maxDim = Math.max(window.innerWidth, window.innerHeight);
  // Tamanho extra grande para garantir cobertura total em qualquer resolução
  const size = Math.sqrt(window.innerWidth * window.innerWidth + window.innerHeight * window.innerHeight) * 2;


  // Define os estilos iniciais do círculo
  ripple.style.position = 'fixed';
  ripple.style.borderRadius = '50%';
  ripple.style.left = `${clientX - size / 2}px`;
  ripple.style.top = `${clientY - size / 2}px`;
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.transform = 'scale(0)'; // Começa pequeno
  ripple.style.opacity = '1'; // Totalmente opaco no início
  ripple.style.zIndex = '9999'; // Acima de tudo
  ripple.style.pointerEvents = 'none'; // Não bloqueia cliques

  // Define a cor de fundo do círculo com base no TEMA DE DESTINO
  // Se o tema atual é claro (isDark=false), o próximo será escuro, então o ripple é cinza escuro.
  // Se o tema atual é escuro (isDark=true), o próximo será claro, então o ripple é branco.
  ripple.style.backgroundColor = targetIsDark ? '#1a202c' : '#ffffff'; // Cores Tailwind: gray-900 ou white

  document.body.appendChild(ripple);

  // Força o reflow para garantir que o estado inicial (scale(0)) seja renderizado
  // antes de aplicar a transição.
  void ripple.offsetWidth;

  // Aplica a transição para animar o círculo
  ripple.style.transition = 'transform 0.7s ease-out'; // Apenas transform, a opacidade permanece 1
  ripple.style.transform = 'scale(1)'; // Expande para cobrir a tela

  // Após a transição de expansão do ripple, altere o tema e remova o elemento ripple.
  // Usamos { once: true } para garantir que o listener seja executado apenas uma vez.
  ripple.addEventListener('transitionend', () => {
    setTheme(targetIsDark); // Altera o tema real do documento
    ripple.remove(); // Remove o elemento ripple
  }, { once: true });
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
