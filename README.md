
# 🍕 Nonna Pizzaria

Bem-vindo à **Nonna Pizzaria**, um aplicativo web moderno e intuitivo para explorar deliciosas pizzas e outros produtos, realizar pedidos e até mesmo avaliar seus pratos favoritos! 

Desenvolvido com **Vue.js 3, Vite, Tailwind CSS** no frontend e **Node.js (Express) com Firestore** no backend, este projeto exemplifica uma aplicação de comércio eletrônico completa, focada em **performance, experiência do usuário e facilidade de manutenção**.

---

## 🚀 Funcionalidades Principais

- ✅ **Listagem de Produtos:** Explore uma seleção de pizzas e outros itens, com preço, descrição e imagem.
- ✅ **Filtragem de Categorias Dinâmica:** Menu inteligente que exibe apenas categorias com produtos disponíveis (ex.: Pizzas Doces, Salgadas, Bebidas).
- ✅ **Barra de Busca Inteligente:** Encontre rapidamente seus produtos favoritos.
- ✅ **Ordenação de Produtos:** Organize por nome (A-Z, Z-A) ou preço (menor, maior).
- ✅ **Sistema de Avaliação (Rating):** Avaliação com estrelas (1 a 5), cálculo de média e controle local para evitar votos duplicados (via LocalStorage).
- ✅ **Carrinho de Compras Interativo:** Adição, remoção e ajuste de quantidades de forma intuitiva.
- ✅ **Toggle de Tema (Claro/Escuro):** Interface adaptável ao seu gosto.
- ✅ **Layout Responsivo:** Ótima experiência tanto em desktop quanto mobile, com Tailwind CSS.
- ✅ **Cache Inteligente:** Categorias e produtos armazenados localmente para reduzir requisições e melhorar performance.
- ✅ **Arquitetura Modular:** Componentes reutilizáveis e Composables para gerenciamento eficiente de lógica e estado.
- ✅ **Gerenciamento de Estado com Pinia:** Controle global eficiente (ex.: carrinho de compras).
- ✅ **Comunicação entre Componentes Distantes:** Uso de provide/inject para compartilhamento de estados entre componentes não relacionados diretamente.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- [Vue.js 3](https://vuejs.org/) — Framework progressivo.
- [Vite](https://vitejs.dev/) — Ferramenta de build ultrarrápida.
- [Tailwind CSS](https://tailwindcss.com/) — Framework CSS utility-first.
- [Pinia](https://pinia.vuejs.org/) — Gerenciamento de estado.
- [Axios](https://axios-http.com/) — Cliente HTTP baseado em Promises.
- [Headless UI](https://headlessui.dev/) — Componentes acessíveis e sem estilo.
- [Font Awesome](https://fontawesome.com/) — Ícones.

### Backend
- [Node.js](https://nodejs.org/) — Ambiente de execução JavaScript.
- [Express.js](https://expressjs.com/) — Framework minimalista para APIs.
- [Firebase Firestore](https://firebase.google.com/docs/firestore) — Banco de dados NoSQL em nuvem.

---

## ⚙️ Configuração e Instalação

### 🔧 Pré-requisitos
- Node.js v18 ou superior
- npm (ou yarn)
- Conta no Firebase com Firestore configurado

---

### 1️⃣ Configuração do Backend

Clone o repositório (se for separado) ou navegue até a pasta backend:

```bash
git clone <URL_DO_SEU_REPOSITORIO_BACKEND>
cd <pasta_do_backend>
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` no diretório raiz do backend:

```env
GOOGLE_APPLICATION_CREDENTIALS=./firebase-credentials.json
PORT=3000
```

⚠️ O arquivo `firebase-credentials.json` você obtém no console do Firebase:  
**Configurações do projeto → Contas de serviço → Gerar nova chave privada.**

Inicie o backend:

```bash
npm start
```

O backend estará rodando em `http://localhost:3000`.

---

### 2️⃣ Configuração do Frontend

Acesse a pasta do frontend:

```bash
cd <pasta_do_frontend>
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` na raiz do frontend com a URL do backend:

```env
VITE_APP_API_URL=http://localhost:3000
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

---

### 3️⃣ População do Firestore (Opcional)

Insira manualmente os dados no Firestore ou crie um script de seed no backend.  

⚙️ As coleções devem ter estrutura semelhante:

- **products:**  
  - id, name, description, price, image, categoryIds (array de IDs)

- **categories:**  
  - id, name, parent_id (se for subcategoria)

---

## 📂 Estrutura do Projeto (Frontend)

```plaintext
src/
├── assets/                  # Imagens e ícones
├── components/              # Componentes Vue
│   ├── icons/
│   ├── skeletons/
│   ├── NewHeader.vue        # Menu com categorias
│   ├── ProductCard.vue      # Card de produto
│   ├── Rating.vue           # Avaliação de produtos
│   └── ...
├── composables/             # Composables Vue (hooks)
│   ├── useCategories.js     # Lógica de categorias
│   ├── useProducts.js       # Lógica de produtos
│   └── ...
├── layouts/                 # Layouts globais
│   └── AppLayout.vue
├── router/                  # Vue Router
│   └── index.js
├── services/                # Serviços externos
│   └── httpClient.js        # Axios configurado
├── stores/                  # Estado global com Pinia
│   └── cartStore.js
├── views/                   # Páginas
│   ├── ProductListPage.vue
│   ├── CartPage.vue
│   └── ...
├── keys.js                  # Provide/inject keys
├── main.js                  # Entry point
└── App.vue                  # Componente raiz
```

---

## 🤝 Contribuição

Contribuições são bem-vindas!  
Sinta-se à vontade para abrir uma **issue** ou enviar um **pull request**.

---

## 📜 Licença

Este projeto está sob a licença **MIT**.  
Consulte o arquivo `LICENSE` para mais detalhes.

---

Feito com ❤️ pela equipe Nonna Pizzaria.
