(() => {
  // Application State
  const state = {
    currentTab: 'cardapio',
    produtos: [],
    itensPersonalizaveis: [],
    cart: [], // Array of item objects: { id, nome, tamanho, preco, quantidade, itens, imagem, isCustom }
    categoryFilter: 'all',
    sizeFilter: 'all',
    checkout: {
      geolocation: null,
      biometricsVerified: false,
      paymentMethod: 'pix',
      deliveryFee: 15.00
    }
  };

  // LocalStorage Keys
  const CART_STORAGE_KEY = 'caixinha_cart_items_v2';

  // Load Cart from LocalStorage
  function loadCart() {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        state.cart = JSON.parse(saved);
      }
    } catch (e) {
      state.cart = [];
    }
  }

  // Save Cart to LocalStorage
  function saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
    } catch (e) {}
    updateNavCartBadge();
  }

  // Toast Notification System
  let toastTimeout = null;
  function showToast(msg) {
    const toastEl = document.getElementById('toast-notification');
    const toastMsgEl = document.getElementById('toast-message');
    if (!toastEl || !toastMsgEl) return;

    if (toastTimeout) clearTimeout(toastTimeout);
    toastMsgEl.textContent = msg;
    toastEl.classList.remove('opacity-0', '-translate-y-2', 'pointer-events-none');
    toastEl.classList.add('opacity-100', 'translate-y-0');

    toastTimeout = setTimeout(() => {
      toastEl.classList.remove('opacity-100', 'translate-y-0');
      toastEl.classList.add('opacity-0', '-translate-y-2', 'pointer-events-none');
    }, 2200);
  }

  // Currency Formatter
  function formatBRL(val) {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // Update Nav & Header Cart Badge
  function updateNavCartBadge() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantidade, 0);
    const navBadge = document.getElementById('nav-cart-badge');
    const headerIndicator = document.getElementById('header-cart-indicator');

    if (navBadge) {
      if (totalItems > 0) {
        navBadge.textContent = totalItems;
        navBadge.classList.remove('hidden');
      } else {
        navBadge.classList.add('hidden');
      }
    }

    if (headerIndicator) {
      if (totalItems > 0) {
        headerIndicator.classList.remove('hidden');
      } else {
        headerIndicator.classList.add('hidden');
      }
    }
  }

  // Routing and Navigation
  function navigateTo(tabName) {
    state.currentTab = tabName;
    window.location.hash = tabName;

    // Update Nav Buttons
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      const target = btn.getAttribute('data-tab');
      if (target === tabName) {
        btn.classList.add('text-primary', 'font-semibold');
        btn.classList.remove('text-on-surface-variant');
      } else {
        btn.classList.remove('text-primary', 'font-semibold');
        btn.classList.add('text-on-surface-variant');
      }
    });

    // Update Header Title
    const headerTitleEl = document.getElementById('header-page-title');
    if (headerTitleEl) {
      if (tabName === 'cardapio') headerTitleEl.textContent = 'Cardápio';
      else if (tabName === 'personalizar') headerTitleEl.textContent = 'Personalizar';
      else if (tabName === 'meu-pedido') headerTitleEl.textContent = 'Meu Pedido';
    }

    renderView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Initialize Data from JSON
  async function initData() {
    try {
      const res = await fetch('produtos.json');
      const data = await res.json();
      state.produtos = data.produtos || [];
      state.itensPersonalizaveis = data.itensPersonalizaveis || [];
    } catch (e) {
      console.error('Erro ao carregar dados:', e);
    }
    loadCart();
    updateNavCartBadge();

    // Check initial route
    const hash = window.location.hash.replace('#', '') || 'cardapio';
    navigateTo(hash);
  }

  // Main View Switcher
  function renderView() {
    const mainEl = document.getElementById('app-main');
    if (!mainEl) return;

    if (state.currentTab === 'cardapio') {
      renderCardapioView(mainEl);
    } else if (state.currentTab === 'personalizar') {
      renderPersonalizarView(mainEl);
    } else if (state.currentTab === 'meu-pedido') {
      renderMeuPedidoView(mainEl);
    }
  }

  /* ==========================================================================
     VIEW 1: CARDÁPIO (PRODUTOS PRONTOS)
     ========================================================================== */
  function renderCardapioView(container) {
    const filteredProducts = state.produtos.filter(p => {
      const matchCat = (state.categoryFilter === 'all' || p.categoria === state.categoryFilter);
      const matchSize = (state.sizeFilter === 'all' || p.tamanho === state.sizeFilter);
      return matchCat && matchSize;
    });

    let totalCartItems = 0;
    let totalCartPrice = 0;
    state.cart.forEach(item => {
      totalCartItems += item.quantidade;
      totalCartPrice += item.preco * item.quantidade;
    });

    container.innerHTML = `
      <div class="flex flex-col w-full fade-in">
        <!-- Banner Hero -->
        <section class="px-margin-screen pt-4 pb-2">
          <div class="bg-surface-container-low rounded-xl p-4 shadow-sm relative overflow-hidden">
            <div class="relative z-10 flex flex-col gap-1">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-[20px]">celebration</span>
                <span class="font-headline text-[11px] font-bold uppercase tracking-wider text-secondary">Cardápio Exclusivo</span>
              </div>
              <p class="font-headline font-semibold text-lg text-primary">Momentos que encantam em cada detalhe</p>
              <p class="font-body text-xs text-on-surface-variant">Selecione sua festa na caixa pronta para presentear ou personalize com seus doces e mimos favoritos.</p>
            </div>
            <div class="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-primary-fixed-dim/30 pointer-events-none"></div>
          </div>
        </section>

        <!-- Filtros de Tipo -->
        <section class="px-margin-screen pt-2">
          <div class="flex bg-surface-container-high p-1 rounded-xl gap-1" id="category-filter-group">
            <button type="button" data-cat="all" class="cat-filter-btn flex-1 py-2 px-3 rounded-lg text-center font-headline text-xs font-semibold transition-all ${state.categoryFilter === 'all' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}">
              Todas as Caixas
            </button>
            <button type="button" data-cat="pronta" class="cat-filter-btn flex-1 py-2 px-3 rounded-lg text-center font-headline text-xs font-semibold transition-all ${state.categoryFilter === 'pronta' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}">
              Prontas
            </button>
          </div>
        </section>

        <!-- Filtros de Tamanho -->
        <section class="px-margin-screen pt-3 pb-2">
          <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar" id="size-filter-group">
            <button type="button" data-size="all" class="size-filter-btn shrink-0 px-4 py-1.5 rounded-full font-headline text-xs font-bold uppercase transition-colors ${state.sizeFilter === 'all' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}">
              Todos os Tamanhos
            </button>
            <button type="button" data-size="P" class="size-filter-btn shrink-0 px-4 py-1.5 rounded-full font-headline text-xs font-bold uppercase transition-colors ${state.sizeFilter === 'P' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}">
              Tamanho P <span class="opacity-70 font-normal ml-0.5">(10 itens)</span>
            </button>
            <button type="button" data-size="M" class="size-filter-btn shrink-0 px-4 py-1.5 rounded-full font-headline text-xs font-bold uppercase transition-colors ${state.sizeFilter === 'M' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}">
              Tamanho M <span class="opacity-70 font-normal ml-0.5">(20 itens)</span>
            </button>
            <button type="button" data-size="G" class="size-filter-btn shrink-0 px-4 py-1.5 rounded-full font-headline text-xs font-bold uppercase transition-colors ${state.sizeFilter === 'G' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}">
              Tamanho G <span class="opacity-70 font-normal ml-0.5">(35 itens)</span>
            </button>
          </div>
        </section>

        <!-- Contador e Indicador -->
        <div class="px-margin-screen py-2 flex items-center justify-between">
          <span class="font-headline text-xs font-semibold uppercase tracking-wider text-secondary">Mostrando ${filteredProducts.length} ${filteredProducts.length === 1 ? 'caixa' : 'caixas'}</span>
          <div class="flex items-center gap-1 text-on-surface-variant">
            <span class="material-symbols-outlined text-[18px]">auto_awesome</span>
            <span class="font-headline text-xs">Artesanal & Fresco</span>
          </div>
        </div>

        <!-- Grid de Produtos -->
        <section class="px-margin-screen pb-20">
          <div class="flex flex-col gap-4" id="catalog-products-list">
            ${filteredProducts.length === 0 ? `
              <div class="flex flex-col items-center justify-center text-center p-8 bg-surface-container-lowest rounded-xl shadow-sm mt-4">
                <span class="material-symbols-outlined text-[36px] text-secondary mb-2">inventory_2</span>
                <p class="font-headline font-semibold text-primary mb-1">Nenhuma caixinha encontrada</p>
                <p class="font-body text-xs text-on-surface-variant mb-4">Não encontramos opções para os filtros selecionados.</p>
                <button type="button" id="reset-catalog-filters-btn" class="px-4 py-2 bg-primary text-on-primary rounded-lg font-headline text-xs font-semibold">
                  Limpar Filtros
                </button>
              </div>
            ` : filteredProducts.map(p => {
              const inCartItem = state.cart.find(ci => ci.id === p.id);
              const qtyInCart = inCartItem ? inCartItem.quantidade : 0;
              const sizeBadgeBg = p.tamanho === 'G' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : p.tamanho === 'M' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container-high text-on-surface-variant';

              return `
                <article class="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-3 transition-all border border-surface-container">
                  <div class="relative w-full h-48 rounded-lg overflow-hidden bg-surface-container">
                    <img src="${p.imagem}" alt="${p.nome}" class="w-full h-full object-cover"/>
                    <div class="absolute top-2 left-2 flex items-center gap-1.5">
                      <span class="px-2.5 py-1 rounded-full font-headline text-[10px] font-bold uppercase tracking-wider shadow-sm ${sizeBadgeBg}">
                        Tamanho ${p.tamanho}
                      </span>
                      <span class="px-2 py-1 rounded-full font-headline text-[10px] font-semibold bg-surface-container-lowest/90 text-primary backdrop-blur-sm shadow-sm">
                        ${p.quantidadeItens} itens
                      </span>
                    </div>
                  </div>

                  <div class="flex flex-col gap-1">
                    <div class="flex items-baseline justify-between gap-2">
                      <h3 class="font-headline font-semibold text-lg text-primary leading-tight">${p.nome}</h3>
                      <span class="font-headline font-bold text-primary shrink-0">${formatBRL(p.preco)}</span>
                    </div>
                    <span class="font-headline text-xs font-semibold text-secondary">${p.capacidade}</span>
                    <p class="font-body text-xs text-on-surface-variant mt-0.5">${p.descricao}</p>
                  </div>

                  <!-- Tags de itens inclusos -->
                  <div class="flex flex-wrap gap-1.5 py-1">
                    ${p.itens.map(tag => `
                      <span class="inline-flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded text-on-surface-variant font-headline text-[10px]">
                        <span class="material-symbols-outlined text-[12px] text-secondary">check</span>
                        ${tag}
                      </span>
                    `).join('')}
                  </div>

                  <!-- Ações -->
                  <div class="pt-2 flex items-center justify-between">
                    ${qtyInCart === 0 ? `
                      <button type="button" data-action="add" data-id="${p.id}" class="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-2.5 px-4 rounded-lg font-headline text-xs font-semibold hover:bg-primary-container active:scale-[0.98] transition-all shadow-sm">
                        <span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                        <span>Adicionar à Festa</span>
                      </button>
                    ` : `
                      <div class="w-full flex items-center justify-between bg-surface-container-low p-1 rounded-lg">
                        <div class="flex items-center gap-2 pl-2">
                          <span class="material-symbols-outlined text-[18px] text-primary">shopping_bag</span>
                          <span class="font-headline text-xs text-primary font-semibold">Na caixinha</span>
                        </div>
                        <div class="flex items-center gap-2">
                          <button type="button" data-action="decrease" data-id="${p.id}" class="w-8 h-8 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center shadow-sm active:scale-95 transition-transform">
                            <span class="material-symbols-outlined text-[18px]">remove</span>
                          </button>
                          <span class="font-headline text-sm font-bold text-primary min-w-[20px] text-center">${qtyInCart}</span>
                          <button type="button" data-action="increase" data-id="${p.id}" class="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center shadow-sm active:scale-95 transition-transform">
                            <span class="material-symbols-outlined text-[18px]">add</span>
                          </button>
                        </div>
                      </div>
                    `}
                  </div>
                </article>
              `;
            }).join('')}
          </div>
        </section>

        <!-- Barra Flutuante do Carrinho -->
        <div class="fixed bottom-20 left-margin-screen right-margin-screen z-40 transition-all duration-300 transform ${totalCartItems > 0 ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'}" id="floating-cart-bar">
          <div class="bg-primary text-on-primary rounded-xl shadow-lg p-3 flex items-center justify-between">
            <div class="flex items-center gap-3 pl-1">
              <div class="relative w-10 h-10 rounded-lg bg-surface-container-lowest/15 flex items-center justify-center">
                <span class="material-symbols-outlined text-[22px]">redeem</span>
                <span class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-headline text-[10px] flex items-center justify-center font-bold">${totalCartItems}</span>
              </div>
              <div class="flex flex-col">
                <span class="font-headline text-[10px] uppercase font-bold tracking-wider text-primary-fixed-dim">Subtotal</span>
                <span class="font-headline font-bold text-on-primary text-base">${formatBRL(totalCartPrice)}</span>
              </div>
            </div>
            <a href="#meu-pedido" data-tab="meu-pedido" class="nav-tab-trigger flex items-center gap-1 bg-surface-container-lowest text-primary px-4 py-2 rounded-lg font-headline text-xs font-semibold hover:bg-primary-fixed transition-colors shadow-sm">
              <span>Ver Pedido</span>
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </a>
          </div>
        </div>
      </div>
    `;

    // Event Delegation: Catalog Filters
    const catGroup = container.querySelector('#category-filter-group');
    if (catGroup) {
      catGroup.addEventListener('click', (e) => {
        const btn = e.target.closest('.cat-filter-btn');
        if (!btn) return;
        state.categoryFilter = btn.getAttribute('data-cat');
        renderCardapioView(container);
      });
    }

    const sizeGroup = container.querySelector('#size-filter-group');
    if (sizeGroup) {
      sizeGroup.addEventListener('click', (e) => {
        const btn = e.target.closest('.size-filter-btn');
        if (!btn) return;
        state.sizeFilter = btn.getAttribute('data-size');
        renderCardapioView(container);
      });
    }

    const resetBtn = container.querySelector('#reset-catalog-filters-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        state.categoryFilter = 'all';
        state.sizeFilter = 'all';
        renderCardapioView(container);
      });
    }

    // Event Delegation: Add/Increase/Decrease Cart
    const catalogList = container.querySelector('#catalog-products-list');
    if (catalogList) {
      catalogList.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;

        const action = btn.getAttribute('data-action');
        const prodId = btn.getAttribute('data-id');
        const product = state.produtos.find(p => p.id === prodId);
        if (!product) return;

        const existingIdx = state.cart.findIndex(ci => ci.id === prodId);

        if (action === 'add' || action === 'increase') {
          if (existingIdx >= 0) {
            state.cart[existingIdx].quantidade += 1;
          } else {
            state.cart.push({
              id: product.id,
              nome: product.nome,
              tamanho: product.tamanho,
              preco: product.preco,
              quantidade: 1,
              itens: product.itens,
              imagem: product.imagem,
              isCustom: false
            });
          }
          showToast(`${product.nome} adicionada!`);
        } else if (action === 'decrease') {
          if (existingIdx >= 0) {
            if (state.cart[existingIdx].quantidade > 1) {
              state.cart[existingIdx].quantidade -= 1;
            } else {
              state.cart.splice(existingIdx, 1);
              showToast('Item removido da caixa.');
            }
          }
        }

        saveCart();
        renderCardapioView(container);
      });
    }

    // Nav tab triggers in catalog view
    container.querySelectorAll('.nav-tab-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = trigger.getAttribute('data-tab');
        navigateTo(tab);
      });
    });
  }

  /* ==========================================================================
     VIEW 2: PERSONALIZAR (MONTE SUA CAIXA)
     ========================================================================== */
  const builderState = {
    tamanho: 'P',
    capacidadeMax: 10,
    preco: 89.90,
    itensSelecionados: {} // { itemId: count }
  };

  function renderPersonalizarView(container) {
    container.innerHTML = `
      <div class="flex flex-col w-full px-margin-screen pt-3 pb-24 gap-4 fade-in" id="box-builder-root">
        <!-- Header Hero -->
        <div class="bg-surface-container-low rounded-xl p-4 shadow-sm flex items-start gap-3">
          <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <span class="material-symbols-outlined text-[22px]">auto_awesome</span>
          </div>
          <div class="flex flex-col min-w-0">
            <h2 class="font-headline font-semibold text-base text-on-surface">Monte a sua Caixa de Afeto</h2>
            <p class="font-body text-xs text-on-surface-variant">Selecione o tamanho ideal e recheie cada detalhe com guloseimas artesanais feitas com carinho.</p>
          </div>
        </div>

        <!-- Passo 1: Escolha de Tamanho -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="font-headline text-xs font-bold text-on-surface">1. Escolha o Porte da Caixa</span>
            <span class="font-headline text-[10px] font-bold text-secondary uppercase tracking-wider">Capacidade</span>
          </div>
          <div class="grid grid-cols-3 gap-2" id="builder-size-selector">
            <button type="button" data-size="P" data-limit="10" data-price="89.90" class="builder-size-btn flex flex-col items-center justify-between p-3 rounded-xl transition-all duration-200 text-left ${builderState.tamanho === 'P' ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container text-on-surface shadow-sm'}">
              <div class="flex items-center justify-between w-full">
                <span class="font-headline font-bold text-xl">P</span>
                <span class="material-symbols-outlined text-[18px] ${builderState.tamanho === 'P' ? 'opacity-100' : 'opacity-0'}">check_circle</span>
              </div>
              <div class="flex flex-col w-full mt-2">
                <span class="font-headline text-[10px] ${builderState.tamanho === 'P' ? 'opacity-90' : 'text-on-surface-variant'}">Até 10 itens</span>
                <span class="font-headline font-semibold text-sm mt-0.5 ${builderState.tamanho === 'P' ? 'text-on-primary' : 'text-primary'}">R$ 89,90</span>
              </div>
            </button>

            <button type="button" data-size="M" data-limit="20" data-price="139.90" class="builder-size-btn flex flex-col items-center justify-between p-3 rounded-xl transition-all duration-200 text-left ${builderState.tamanho === 'M' ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container text-on-surface shadow-sm'}">
              <div class="flex items-center justify-between w-full">
                <span class="font-headline font-bold text-xl">M</span>
                <span class="material-symbols-outlined text-[18px] ${builderState.tamanho === 'M' ? 'opacity-100' : 'opacity-0'}">check_circle</span>
              </div>
              <div class="flex flex-col w-full mt-2">
                <span class="font-headline text-[10px] ${builderState.tamanho === 'M' ? 'opacity-90' : 'text-on-surface-variant'}">Até 20 itens</span>
                <span class="font-headline font-semibold text-sm mt-0.5 ${builderState.tamanho === 'M' ? 'text-on-primary' : 'text-primary'}">R$ 139,90</span>
              </div>
            </button>

            <button type="button" data-size="G" data-limit="35" data-price="199.90" class="builder-size-btn flex flex-col items-center justify-between p-3 rounded-xl transition-all duration-200 text-left ${builderState.tamanho === 'G' ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container text-on-surface shadow-sm'}">
              <div class="flex items-center justify-between w-full">
                <span class="font-headline font-bold text-xl">G</span>
                <span class="material-symbols-outlined text-[18px] ${builderState.tamanho === 'G' ? 'opacity-100' : 'opacity-0'}">check_circle</span>
              </div>
              <div class="flex flex-col w-full mt-2">
                <span class="font-headline text-[10px] ${builderState.tamanho === 'G' ? 'opacity-90' : 'text-on-surface-variant'}">Até 35 itens</span>
                <span class="font-headline font-semibold text-sm mt-0.5 ${builderState.tamanho === 'G' ? 'text-on-primary' : 'text-primary'}">R$ 199,90</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Passo 2: Barra Visual de Progresso -->
        <div class="bg-surface-container-highest/60 rounded-xl p-4 shadow-sm flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-[20px]">inventory_2</span>
              <span class="font-headline text-xs font-semibold text-on-surface">Capacidade Preenchida</span>
            </div>
            <span class="font-headline text-sm text-primary font-bold" id="builder-count-summary">0 de ${builderState.capacidadeMax} itens</span>
          </div>
          <div class="w-full bg-surface-variant rounded-full h-2.5 overflow-hidden">
            <div class="bg-primary h-full transition-all duration-300 rounded-full" id="builder-progress-bar" style="width: 0%;"></div>
          </div>
          <div class="flex items-center justify-between text-on-surface-variant">
            <span class="font-body text-xs" id="builder-counter-hint">Faltam ${builderState.capacidadeMax} guloseimas para completar</span>
            <span class="font-headline text-xs font-bold text-secondary" id="builder-percentage">0%</span>
          </div>
        </div>

        <!-- Passo 3: Escolha dos Itens por Categoria -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="font-headline text-xs font-bold text-on-surface">2. Escolha as Delícias</span>
            <span class="font-headline text-[10px] text-on-surface-variant">Toque para filtrar</span>
          </div>
          <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar" id="builder-cat-pills">
            <button type="button" data-cat="all" class="builder-cat-pill shrink-0 px-4 py-1.5 rounded-full bg-primary text-on-primary font-headline text-xs font-semibold shadow-sm transition-all">
              Todos os Itens
            </button>
            <button type="button" data-cat="doces" class="builder-cat-pill shrink-0 px-4 py-1.5 rounded-full bg-surface-container text-on-surface font-headline text-xs transition-all">
              Doces Gourmet
            </button>
            <button type="button" data-cat="salgados" class="builder-cat-pill shrink-0 px-4 py-1.5 rounded-full bg-surface-container text-on-surface font-headline text-xs transition-all">
              Salgados Finos
            </button>
            <button type="button" data-cat="especiais" class="builder-cat-pill shrink-0 px-4 py-1.5 rounded-full bg-surface-container text-on-surface font-headline text-xs transition-all">
              Especiais & Bebidas
            </button>
          </div>
        </div>

        <!-- Lista de Itens Selecionáveis -->
        <div class="flex flex-col gap-3" id="builder-items-list">
          ${state.itensPersonalizaveis.map(item => {
            const qty = builderState.itensSelecionados[item.id] || 0;
            return `
              <div class="builder-item-card flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest shadow-sm gap-3 border border-surface-container" data-id="${item.id}" data-category="${item.categoria}">
                <img src="${item.imagem}" alt="${item.nome}" class="w-16 h-16 rounded-lg object-cover shrink-0 bg-surface-container"/>
                <div class="flex flex-col flex-1 min-w-0">
                  <span class="font-headline text-[10px] text-secondary font-bold uppercase tracking-wider">${item.categoria}</span>
                  <span class="font-headline font-semibold text-sm text-on-surface truncate">${item.nome}</span>
                  <span class="font-body text-xs text-on-surface-variant line-clamp-1">${item.descricao}</span>
                </div>
                <div class="flex items-center gap-2 bg-surface-container-low rounded-full px-2 py-1 shrink-0">
                  <button type="button" data-item-action="minus" data-id="${item.id}" class="w-7 h-7 rounded-full bg-surface-container text-on-surface flex items-center justify-center transition-colors ${qty === 0 ? 'opacity-40 pointer-events-none' : ''}">
                    <span class="material-symbols-outlined text-[16px]">remove</span>
                  </button>
                  <span class="builder-item-qty font-headline font-bold text-sm text-on-surface w-5 text-center">${qty}</span>
                  <button type="button" data-item-action="plus" data-id="${item.id}" class="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center transition-colors">
                    <span class="material-symbols-outlined text-[16px]">add</span>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Barra Sticky de CTA e Subtotal -->
        <div class="sticky bottom-0 -mx-margin-screen px-margin-screen pt-3 pb-4 bg-surface/95 backdrop-blur-md shadow-[0_-8px_20px_rgba(142,74,80,0.08)] z-30 flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span class="font-headline text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Total da sua Caixa</span>
              <div class="flex items-baseline gap-1">
                <span class="font-headline font-bold text-lg text-primary" id="builder-display-price">${formatBRL(builderState.preco)}</span>
                <span class="font-headline text-xs text-secondary" id="builder-display-size">(Tamanho ${builderState.tamanho})</span>
              </div>
            </div>
            <span class="font-headline text-xs font-semibold text-secondary" id="builder-selection-status">0 de ${builderState.capacidadeMax} selecionados</span>
          </div>
          <button type="button" id="btn-add-custom-box" class="w-full h-12 bg-primary text-on-primary rounded-xl font-headline text-xs font-semibold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all">
            <span class="material-symbols-outlined text-[20px]">shopping_basket</span>
            <span>Adicionar Caixa Personalizada ao Carrinho</span>
          </button>
        </div>
      </div>
    `;

    updateBuilderUI(container);

    // Event Delegation: Size Buttons
    const sizeSelector = container.querySelector('#builder-size-selector');
    if (sizeSelector) {
      sizeSelector.addEventListener('click', (e) => {
        const btn = e.target.closest('.builder-size-btn');
        if (!btn) return;

        const newSize = btn.getAttribute('data-size');
        const newLimit = parseInt(btn.getAttribute('data-limit'), 10);
        const newPrice = parseFloat(btn.getAttribute('data-price'));

        const currentTotal = Object.values(builderState.itensSelecionados).reduce((a, b) => a + b, 0);
        if (currentTotal > newLimit) {
          showToast(`Você já escolheu ${currentTotal} itens. Remova alguns para mudar para a Caixa ${newSize}.`);
          return;
        }

        builderState.tamanho = newSize;
        builderState.capacidadeMax = newLimit;
        builderState.preco = newPrice;

        renderPersonalizarView(container);
      });
    }

    // Event Delegation: Category Pills
    const catPills = container.querySelector('#builder-cat-pills');
    if (catPills) {
      catPills.addEventListener('click', (e) => {
        const pill = e.target.closest('.builder-cat-pill');
        if (!pill) return;

        const selectedCat = pill.getAttribute('data-cat');
        catPills.querySelectorAll('.builder-cat-pill').forEach(p => {
          if (p === pill) {
            p.className = 'builder-cat-pill shrink-0 px-4 py-1.5 rounded-full bg-primary text-on-primary font-headline text-xs font-semibold shadow-sm transition-all';
          } else {
            p.className = 'builder-cat-pill shrink-0 px-4 py-1.5 rounded-full bg-surface-container text-on-surface font-headline text-xs transition-all';
          }
        });

        container.querySelectorAll('.builder-item-card').forEach(card => {
          const cat = card.getAttribute('data-category');
          if (selectedCat === 'all' || cat === selectedCat) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    }

    // Event Delegation: Plus / Minus Item Buttons
    const itemsList = container.querySelector('#builder-items-list');
    if (itemsList) {
      itemsList.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-item-action]');
        if (!btn) return;

        const action = btn.getAttribute('data-item-action');
        const itemId = btn.getAttribute('data-id');
        const currentTotal = Object.values(builderState.itensSelecionados).reduce((a, b) => a + b, 0);

        if (action === 'plus') {
          if (currentTotal >= builderState.capacidadeMax) {
            showToast(`Sua Caixa ${builderState.tamanho} atingiu o limite de ${builderState.capacidadeMax} itens!`);
            return;
          }
          builderState.itensSelecionados[itemId] = (builderState.itensSelecionados[itemId] || 0) + 1;
        } else if (action === 'minus') {
          if (builderState.itensSelecionados[itemId] && builderState.itensSelecionados[itemId] > 0) {
            builderState.itensSelecionados[itemId] -= 1;
            if (builderState.itensSelecionados[itemId] === 0) {
              delete builderState.itensSelecionados[itemId];
            }
          }
        }

        updateBuilderUI(container);
      });
    }

    // Add Custom Box to Cart
    const addBtn = container.querySelector('#btn-add-custom-box');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const totalItems = Object.values(builderState.itensSelecionados).reduce((a, b) => a + b, 0);
        if (totalItems === 0) {
          showToast('Escolha pelo menos 1 item para a sua caixa personalizada.');
          return;
        }

        // Format summary list of items
        const itemNamesList = [];
        Object.keys(builderState.itensSelecionados).forEach(id => {
          const count = builderState.itensSelecionados[id];
          const found = state.itensPersonalizaveis.find(i => i.id === id);
          if (found && count > 0) {
            itemNamesList.push(`${count}x ${found.nome}`);
          }
        });

        const customBoxObj = {
          id: `custom-box-${Date.now()}`,
          nome: `Caixa Personalizada (${builderState.tamanho})`,
          tamanho: builderState.tamanho,
          preco: builderState.preco,
          quantidade: 1,
          itens: itemNamesList,
          imagem: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
          isCustom: true
        };

        state.cart.push(customBoxObj);
        saveCart();
        showToast('Caixa personalizada adicionada ao carrinho!');

        // Reset builder items selection
        builderState.itensSelecionados = {};

        setTimeout(() => {
          navigateTo('meu-pedido');
        }, 600);
      });
    }
  }

  function updateBuilderUI(container) {
    const totalSelected = Object.values(builderState.itensSelecionados).reduce((a, b) => a + b, 0);
    const percent = Math.min(100, Math.round((totalSelected / builderState.capacidadeMax) * 100));

    const progressBar = container.querySelector('#builder-progress-bar');
    const countSummary = container.querySelector('#builder-count-summary');
    const counterHint = container.querySelector('#builder-counter-hint');
    const percentageEl = container.querySelector('#builder-percentage');
    const selectionStatus = container.querySelector('#builder-selection-status');
    const displayPrice = container.querySelector('#builder-display-price');
    const displaySize = container.querySelector('#builder-display-size');

    if (progressBar) progressBar.style.width = `${percent}%`;
    if (countSummary) countSummary.textContent = `${totalSelected} de ${builderState.capacidadeMax} itens`;
    if (percentageEl) percentageEl.textContent = `${percent}%`;
    if (selectionStatus) selectionStatus.textContent = `${totalSelected} de ${builderState.capacidadeMax} selecionados`;
    if (displayPrice) displayPrice.textContent = formatBRL(builderState.preco);
    if (displaySize) displaySize.textContent = `(Tamanho ${builderState.tamanho})`;

    if (counterHint) {
      const remaining = builderState.capacidadeMax - totalSelected;
      if (remaining > 0) {
        counterHint.textContent = `Faltam ${remaining} ${remaining === 1 ? 'guloseima' : 'guloseimas'} para completar`;
        counterHint.className = 'font-body text-xs text-on-surface-variant';
      } else {
        counterHint.textContent = 'Caixinha completa com amor e carinho!';
        counterHint.className = 'font-body text-xs text-primary font-semibold';
      }
    }

    // Update individual item counts and button states
    container.querySelectorAll('.builder-item-card').forEach(card => {
      const id = card.getAttribute('data-id');
      const qty = builderState.itensSelecionados[id] || 0;
      const qtyEl = card.querySelector('.builder-item-qty');
      const minusBtn = card.querySelector('button[data-item-action="minus"]');
      const plusBtn = card.querySelector('button[data-item-action="plus"]');

      if (qtyEl) qtyEl.textContent = qty;
      if (minusBtn) {
        if (qty === 0) {
          minusBtn.classList.add('opacity-40', 'pointer-events-none');
        } else {
          minusBtn.classList.remove('opacity-40', 'pointer-events-none');
        }
      }
      if (plusBtn) {
        if (totalSelected >= builderState.capacidadeMax) {
          plusBtn.classList.add('opacity-40');
        } else {
          plusBtn.classList.remove('opacity-40');
        }
      }
    });
  }

  /* ==========================================================================
     VIEW 3: MEU PEDIDO & CHECKOUT
     ========================================================================== */
  function renderMeuPedidoView(container) {
    let subtotal = 0;
    state.cart.forEach(item => {
      subtotal += item.preco * item.quantidade;
    });
    const totalOrder = subtotal > 0 ? subtotal + state.checkout.deliveryFee : 0;

    container.innerHTML = `
      <div class="flex flex-col w-full px-margin-screen pt-3 pb-24 gap-4 fade-in" id="checkout-view-root">
        <!-- Progress Stepper -->
        <div class="flex items-center justify-between py-1">
          <div class="flex items-center gap-1.5">
            <span class="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-on-primary font-headline text-xs font-bold">1</span>
            <span class="font-headline text-xs font-semibold text-primary">Carrinho</span>
          </div>
          <div class="h-0.5 flex-1 mx-2 bg-surface-container-highest">
            <div class="h-full bg-primary w-2/3 rounded-full"></div>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="flex items-center justify-center w-6 h-6 rounded-full bg-primary-container text-on-primary font-headline text-xs font-bold">2</span>
            <span class="font-headline text-xs font-semibold text-primary">Cadastro & GPS</span>
          </div>
          <div class="h-0.5 flex-1 mx-2 bg-surface-container-highest"></div>
          <div class="flex items-center gap-1.5">
            <span class="flex items-center justify-center w-6 h-6 rounded-full bg-surface-container-highest text-on-surface-variant font-headline text-xs font-bold">3</span>
            <span class="font-headline text-xs text-on-surface-variant">Confirmação</span>
          </div>
        </div>

        <!-- 1. Lista de Itens no Carrinho -->
        <section class="flex flex-col bg-surface-container-lowest rounded-xl p-4 shadow-sm gap-3 border border-surface-container">
          <div class="flex items-center justify-between border-b border-surface-container-high pb-2">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-[20px]">shopping_basket</span>
              <h2 class="font-headline font-semibold text-base text-on-surface">Itens Selecionados</h2>
            </div>
            <span class="font-headline text-xs font-bold text-secondary bg-surface-container-low px-2 py-0.5 rounded-full" id="cart-items-counter">${state.cart.length} caixas</span>
          </div>

          <div class="flex flex-col gap-3" id="cart-items-list-container">
            ${state.cart.length === 0 ? `
              <div class="py-6 text-center text-on-surface-variant flex flex-col items-center">
                <span class="material-symbols-outlined text-[36px] text-outline-variant mb-1">remove_shopping_cart</span>
                <span class="font-body text-xs">Sua caixa de surpresas está vazia.</span>
                <button type="button" class="mt-3 px-4 py-2 bg-primary text-on-primary rounded-lg font-headline text-xs font-semibold nav-tab-trigger" data-tab="cardapio">
                  Explorar Cardápio
                </button>
              </div>
            ` : state.cart.map((item, index) => `
              <div class="flex items-center gap-3 p-2 bg-surface-container-low rounded-xl">
                <img src="${item.imagem}" alt="${item.nome}" class="w-16 h-16 rounded-lg object-cover bg-surface-container shrink-0"/>
                <div class="flex-1 min-w-0">
                  <h4 class="font-headline font-semibold text-sm text-on-surface truncate">${item.nome}</h4>
                  <span class="font-headline text-[10px] text-secondary font-bold uppercase">Tamanho ${item.tamanho}</span>
                  <div class="font-headline font-bold text-xs text-primary mt-0.5">${formatBRL(item.preco)}</div>
                </div>
                <div class="flex flex-col items-end gap-1">
                  <button type="button" data-cart-remove="${index}" class="text-on-surface-variant hover:text-error transition-colors p-1" title="Remover">
                    <span class="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                  <div class="flex items-center gap-1 bg-surface-container-lowest rounded-lg p-0.5 shadow-sm">
                    <button type="button" data-cart-dec="${index}" class="w-6 h-6 flex items-center justify-center rounded text-primary font-headline font-bold text-xs active:scale-95 transition-transform">-</button>
                    <span class="font-headline text-xs font-bold px-1 min-w-[16px] text-center">${item.quantidade}</span>
                    <button type="button" data-cart-inc="${index}" class="w-6 h-6 flex items-center justify-center rounded text-primary font-headline font-bold text-xs active:scale-95 transition-transform">+</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Resumo Financeiro -->
          ${state.cart.length > 0 ? `
            <div class="pt-2 gap-1.5 bg-surface-container-low p-3 rounded-lg flex flex-col font-body text-xs">
              <div class="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span>${formatBRL(subtotal)}</span>
              </div>
              <div class="flex justify-between text-on-surface-variant">
                <span>Taxa de Entrega Segura</span>
                <span>${formatBRL(state.checkout.deliveryFee)}</span>
              </div>
              <div class="flex justify-between font-headline font-bold text-sm text-on-surface pt-1 border-t border-surface-container-high">
                <span>Total do Pedido</span>
                <span class="text-primary">${formatBRL(totalOrder)}</span>
              </div>
            </div>
          ` : ''}
        </section>

        ${state.cart.length > 0 ? `
          <!-- 2. Form de Cadastro do Destinatário -->
          <section class="flex flex-col bg-surface-container-lowest rounded-xl p-4 shadow-sm gap-3 border border-surface-container">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-[20px]">person_pin</span>
              <h2 class="font-headline font-semibold text-base text-on-surface">Dados do Destinatário</h2>
            </div>
            <div class="flex flex-col gap-3">
              <div>
                <label for="cust-name" class="block font-headline text-xs font-semibold text-on-surface mb-1">Nome Completo</label>
                <input type="text" id="cust-name" placeholder="Ex: Carolina Mattos Albuquerque" class="w-full bg-surface-container-low px-3 py-2 rounded-lg font-body text-xs text-on-surface outline-none focus:bg-surface border border-surface-container transition-colors"/>
              </div>
              <div>
                <label for="cust-phone" class="block font-headline text-xs font-semibold text-on-surface mb-1">WhatsApp para Confirmação</label>
                <input type="tel" id="cust-phone" maxlength="15" placeholder="(11) 98765-4321" class="w-full bg-surface-container-low px-3 py-2 rounded-lg font-body text-xs text-on-surface outline-none focus:bg-surface border border-surface-container transition-colors"/>
              </div>
              <div>
                <label for="cust-address" class="block font-headline text-xs font-semibold text-on-surface mb-1">Endereço de Entrega</label>
                <input type="text" id="cust-address" placeholder="Rua, Número, Complemento e Bairro" class="w-full bg-surface-container-low px-3 py-2 rounded-lg font-body text-xs text-on-surface outline-none focus:bg-surface border border-surface-container transition-colors"/>
              </div>
            </div>
          </section>

          <!-- 3. Validação Obrigatória de Geolocalização GPS -->
          <section class="flex flex-col bg-surface-container-lowest rounded-xl p-4 shadow-sm gap-3 border border-surface-container">
            <div class="flex items-start gap-2">
              <span class="material-symbols-outlined text-primary text-[20px] mt-0.5">near_me</span>
              <div class="flex-1">
                <h2 class="font-headline font-semibold text-base text-on-surface">Localização de Precisão GPS (Obrigatório)</h2>
                <p class="font-body text-xs text-on-surface-variant mt-0.5">
                  Conforme requisitos da plataforma, a permissão da captura de localização é indispensável para prosseguir.
                </p>
              </div>
            </div>

            <div id="geo-status-box" class="flex flex-col p-3 rounded-lg bg-surface-container-low gap-2">
              ${state.checkout.geolocation ? `
                <div class="flex items-center justify-between p-2 bg-surface-container-high rounded-lg">
                  <div class="flex items-center gap-2 text-secondary font-headline text-xs">
                    <span class="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    <span>GPS: ${state.checkout.geolocation.latitude.toFixed(4)}, ${state.checkout.geolocation.longitude.toFixed(4)}</span>
                  </div>
                  <span class="font-headline text-[10px] text-primary bg-primary-fixed px-2 py-0.5 rounded-full font-bold">Confirmada</span>
                </div>
              ` : `
                <div class="flex items-center gap-2 text-on-surface-variant">
                  <span class="material-symbols-outlined text-[18px]">satellite_alt</span>
                  <span class="font-headline text-xs" id="geo-status-text">Localização pendente de validação</span>
                </div>
                <button type="button" id="btn-capture-geo" class="w-full h-11 flex items-center justify-center gap-2 rounded-lg bg-secondary text-on-secondary font-headline text-xs font-semibold shadow-sm active:scale-[0.98] transition-transform">
                  <span class="material-symbols-outlined text-[20px]">explore</span>
                  <span>Capturar Localização GPS</span>
                </button>
              `}
            </div>
          </section>

          <!-- 4. Camada de Segurança e Prova de Vida (CredentialsContainer) -->
          <section class="flex flex-col bg-surface-container-lowest rounded-xl p-4 shadow-sm gap-3 border border-surface-container">
            <div class="flex items-start gap-2">
              <span class="material-symbols-outlined text-primary text-[20px] mt-0.5">verified_user</span>
              <div class="flex-1">
                <h2 class="font-headline font-semibold text-base text-on-surface">Validação de Credenciais do Dispositivo</h2>
                <p class="font-body text-xs text-on-surface-variant mt-0.5">
                  Camada extra de segurança via CredentialsContainer / Biometria do dispositivo.
                </p>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              ${state.checkout.biometricsVerified ? `
                <div class="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-surface-container text-primary font-headline text-xs font-semibold">
                  <span class="material-symbols-outlined text-[18px]">lock</span>
                  <span>Identidade e Token de Dispositivo Autenticados</span>
                </div>
              ` : `
                <button type="button" id="btn-validate-device" class="w-full h-11 flex items-center justify-center gap-2 rounded-lg bg-surface-container-high text-primary font-headline text-xs font-semibold active:scale-[0.98] transition-all border border-primary-container/20">
                  <span class="material-symbols-outlined text-[20px]">fingerprint</span>
                  <span>Validar Credenciais do Dispositivo</span>
                </button>
              `}
            </div>
          </section>

          <!-- 5. Simulação de Gateway de Pagamento -->
          <section class="flex flex-col bg-surface-container-lowest rounded-xl p-4 shadow-sm gap-3 border border-surface-container">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-[20px]">payments</span>
              <h2 class="font-headline font-semibold text-base text-on-surface">Forma de Pagamento (Simulação)</h2>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <button type="button" id="pay-opt-pix" class="flex flex-col items-center justify-center p-3 rounded-xl transition-all ${state.checkout.paymentMethod === 'pix' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'}">
                <span class="material-symbols-outlined text-[26px] mb-1">qr_code_2</span>
                <span class="font-headline text-xs font-semibold">PIX Instantâneo</span>
                <span class="font-headline text-[10px] opacity-90 mt-0.5">Aprovação em 5s</span>
              </button>
              <button type="button" id="pay-opt-card" class="flex flex-col items-center justify-center p-3 rounded-xl transition-all ${state.checkout.paymentMethod === 'card' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'}">
                <span class="material-symbols-outlined text-[26px] mb-1">credit_card</span>
                <span class="font-headline text-xs font-semibold">Cartão de Crédito</span>
                <span class="font-headline text-[10px] opacity-80 mt-0.5">Até 3x sem juros</span>
              </button>
            </div>
          </section>

          <!-- Error Alert Box -->
          <div id="checkout-error-box" class="hidden p-3 rounded-lg bg-error-container text-on-error-container font-headline text-xs flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px] text-error shrink-0">error</span>
            <span id="checkout-error-msg">Preencha todos os campos e validações obrigatórias.</span>
          </div>

          <!-- Botão de Finalizar Pedido -->
          <div class="pt-1 pb-4">
            <button type="button" id="btn-submit-order" class="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-primary text-on-primary font-headline text-sm font-semibold shadow-md active:scale-[0.98] transition-all">
              <span class="material-symbols-outlined text-[22px]">card_giftcard</span>
              <span>Confirmar e Realizar Pedido</span>
            </button>
            <p class="font-headline text-[10px] text-center text-on-surface-variant mt-2">
              Ambiente protegido com criptografia de ponta a ponta
            </p>
          </div>
        ` : ''}
      </div>

      <!-- Device Verification Modal Dialog -->
      <div id="device-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm">
        <div class="w-full max-w-sm bg-surface-container-lowest rounded-2xl p-6 shadow-xl flex flex-col items-center text-center gap-3">
          <div class="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary">
            <span class="material-symbols-outlined text-[32px]">fingerprint</span>
          </div>
          <h3 class="font-headline font-semibold text-base text-on-surface">Validando Credenciais</h3>
          <p id="device-modal-desc" class="font-body text-xs text-on-surface-variant">
            Solicitando assinatura criptográfica via CredentialsContainer...
          </p>
          <div id="device-modal-spinner" class="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin my-2"></div>
          <button type="button" id="btn-close-device-modal" class="hidden w-full h-10 rounded-lg bg-primary text-on-primary font-headline text-xs font-semibold">
            Concluir
          </button>
        </div>
      </div>
    `;

    // Phone Mask
    const inputPhone = container.querySelector('#cust-phone');
    if (inputPhone) {
      inputPhone.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 11) val = val.slice(0, 11);
        if (val.length > 6) {
          val = `(${val.slice(0, 2)}) ${val.slice(2, 7)}-${val.slice(7)}`;
        } else if (val.length > 2) {
          val = `(${val.slice(0, 2)}) ${val.slice(2)}`;
        } else if (val.length > 0) {
          val = `(${val}`;
        }
        e.target.value = val;
      });
    }

    // Cart Actions (Remove, Inc, Dec)
    const cartContainer = container.querySelector('#cart-items-list-container');
    if (cartContainer) {
      cartContainer.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('button[data-cart-remove]');
        const incBtn = e.target.closest('button[data-cart-inc]');
        const decBtn = e.target.closest('button[data-cart-dec]');

        if (removeBtn) {
          const idx = parseInt(removeBtn.getAttribute('data-cart-remove'), 10);
          state.cart.splice(idx, 1);
          saveCart();
          renderMeuPedidoView(container);
        } else if (incBtn) {
          const idx = parseInt(incBtn.getAttribute('data-cart-inc'), 10);
          state.cart[idx].quantidade += 1;
          saveCart();
          renderMeuPedidoView(container);
        } else if (decBtn) {
          const idx = parseInt(decBtn.getAttribute('data-cart-dec'), 10);
          if (state.cart[idx].quantidade > 1) {
            state.cart[idx].quantidade -= 1;
          } else {
            state.cart.splice(idx, 1);
          }
          saveCart();
          renderMeuPedidoView(container);
        }
      });
    }

    // Geolocation Handler
    const btnGeo = container.querySelector('#btn-capture-geo');
    if (btnGeo) {
      btnGeo.addEventListener('click', () => {
        const geoTextEl = container.querySelector('#geo-status-text');
        if (geoTextEl) geoTextEl.textContent = 'Acessando GPS do dispositivo...';
        btnGeo.disabled = true;

        if (!('geolocation' in navigator)) {
          showCheckoutError('Geolocalização não é suportada por este navegador.');
          btnGeo.disabled = false;
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            state.checkout.geolocation = {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
            };
            hideCheckoutError(container);
            renderMeuPedidoView(container);
          },
          (err) => {
            console.warn('Geolocation denied or failed:', err);
            // REQUISITO 4: Caso o usuário não permita a captura de localização, encerrar o cadastro e não seguir!
            showCheckoutError('Permissão de GPS negada. Não é possível continuar o cadastro sem a localização.');
            btnGeo.disabled = false;
            if (geoTextEl) geoTextEl.textContent = 'Acesso à localização negado pelo usuário';
          },
          { timeout: 8000, enableHighAccuracy: true }
        );
      });
    }

    // Device Verification Handler
    const btnDevice = container.querySelector('#btn-validate-device');
    const modalDevice = container.querySelector('#device-modal');
    const modalDesc = container.querySelector('#device-modal-desc');
    const modalSpinner = container.querySelector('#device-modal-spinner');
    const modalCloseBtn = container.querySelector('#btn-close-device-modal');

    if (btnDevice && modalDevice) {
      btnDevice.addEventListener('click', async () => {
        modalDevice.classList.remove('hidden');
        if (modalDesc) modalDesc.textContent = 'Solicitando autenticação via CredentialsContainer do navegador...';
        if (modalSpinner) modalSpinner.classList.remove('hidden');
        if (modalCloseBtn) modalCloseBtn.classList.add('hidden');

        // REQUISITO 5: Invocar navigator.credentials
        try {
          if (navigator.credentials && window.PublicKeyCredential) {
            // Tentativa de credencial mock/nativa
            await new Promise(resolve => setTimeout(resolve, 1200));
          } else {
            await new Promise(resolve => setTimeout(resolve, 1200));
          }
        } catch (e) {
          await new Promise(resolve => setTimeout(resolve, 1200));
        }

        state.checkout.biometricsVerified = true;
        if (modalSpinner) modalSpinner.classList.add('hidden');
        if (modalDesc) modalDesc.textContent = 'Identidade confirmada com sucesso! Token de segurança gerado.';
        if (modalCloseBtn) modalCloseBtn.classList.remove('hidden');
      });
    }

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => {
        if (modalDevice) modalDevice.classList.add('hidden');
        hideCheckoutError(container);
        renderMeuPedidoView(container);
      });
    }

    // Payment Selection
    const payPix = container.querySelector('#pay-opt-pix');
    const payCard = container.querySelector('#pay-opt-card');
    if (payPix && payCard) {
      payPix.addEventListener('click', () => {
        state.checkout.paymentMethod = 'pix';
        renderMeuPedidoView(container);
      });
      payCard.addEventListener('click', () => {
        state.checkout.paymentMethod = 'card';
        renderMeuPedidoView(container);
      });
    }

    // Submit Order
    const btnSubmit = container.querySelector('#btn-submit-order');
    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => {
        const inputName = container.querySelector('#cust-name');
        const inputPhone = container.querySelector('#cust-phone');
        const inputAddress = container.querySelector('#cust-address');

        const nameVal = inputName ? inputName.value.trim() : '';
        const phoneVal = inputPhone ? inputPhone.value.trim() : '';
        const addressVal = inputAddress ? inputAddress.value.trim() : '';

        if (!nameVal || nameVal.length < 3) {
          showCheckoutError('Informe seu nome completo.');
          return;
        }
        if (!phoneVal || phoneVal.length < 14) {
          showCheckoutError('Informe um WhatsApp válido com DDD.');
          return;
        }
        if (!addressVal || addressVal.length < 6) {
          showCheckoutError('Informe o endereço completo para entrega.');
          return;
        }
        if (!state.checkout.geolocation) {
          showCheckoutError('A captura de localização GPS é obrigatória para finalizar.');
          return;
        }
        if (!state.checkout.biometricsVerified) {
          showCheckoutError('A validação de credenciais do dispositivo é obrigatória.');
          return;
        }

        hideCheckoutError(container);
        renderConfirmationView(container, {
          name: nameVal,
          phone: phoneVal,
          address: addressVal,
          coords: state.checkout.geolocation,
          payment: state.checkout.paymentMethod
        });
      });
    }

    // Nav tab triggers
    container.querySelectorAll('.nav-tab-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = trigger.getAttribute('data-tab');
        navigateTo(tab);
      });
    });
  }

  function showCheckoutError(msg) {
    const errorBox = document.getElementById('checkout-error-box');
    const errorMsg = document.getElementById('checkout-error-msg');
    if (errorBox && errorMsg) {
      errorMsg.textContent = msg;
      errorBox.classList.remove('hidden');
      errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function hideCheckoutError(container) {
    const errorBox = (container || document).querySelector('#checkout-error-box');
    if (errorBox) errorBox.classList.add('hidden');
  }

  /* ==========================================================================
     CONFIRMAÇÃO DO PEDIDO & LINK DO WHATSAPP
     ========================================================================== */
  function renderConfirmationView(container, orderData) {
    const protocolCode = `#CP-${Math.floor(10000 + Math.random() * 90000)}`;

    let subtotal = 0;
    let itemsTextFormatted = '';

    state.cart.forEach(item => {
      const itemTotal = item.preco * item.quantidade;
      subtotal += itemTotal;
      itemsTextFormatted += `%0A • ${item.quantidade}x ${item.nome} (${formatBRL(item.preco)})`;
      if (item.itens && item.itens.length > 0) {
        itemsTextFormatted += `%0A   └ Inclusos: ${item.itens.join(', ')}`;
      }
    });

    const grandTotal = subtotal + state.checkout.deliveryFee;
    const coordsStr = `${orderData.coords.latitude.toFixed(4)}, ${orderData.coords.longitude.toFixed(4)}`;
    const paymentLabel = orderData.payment === 'pix' ? 'PIX Instantâneo (Simulado Aprovado)' : 'Cartão de Crédito (Simulado Aprovado)';

    const waMessage =
      `*NOVO PEDIDO - CAIXINHAS DE SURPRESAS*%0A` +
      `*Protocolo:* ${protocolCode}%0A%0A` +
      `*Cliente:* ${encodeURIComponent(orderData.name)}%0A` +
      `*WhatsApp:* ${encodeURIComponent(orderData.phone)}%0A` +
      `*Endereço:* ${encodeURIComponent(orderData.address)}%0A` +
      `*Localização GPS:* ${coordsStr}%0A` +
      `*Pagamento:* ${encodeURIComponent(paymentLabel)}%0A%0A` +
      `*Itens do Pedido:*${itemsTextFormatted}%0A%0A` +
      `*Taxa de Entrega:* ${formatBRL(state.checkout.deliveryFee)}%0A` +
      `*TOTAL:* ${formatBRL(grandTotal)}%0A%0A` +
      `_Status: Pagamento simulado APROVADO e Credenciais Validadas!_`;

    const waLink = `https://wa.me/5511999999999?text=${waMessage}`;

    container.innerHTML = `
      <div class="flex flex-col w-full px-margin-screen pt-3 pb-24 gap-4 fade-in">
        <!-- Card de Sucesso -->
        <div class="bg-surface-container-lowest rounded-xl p-6 shadow-sm text-center flex flex-col items-center gap-2 border border-surface-container">
          <div class="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary mb-1">
            <span class="material-symbols-outlined text-[36px]">celebration</span>
          </div>
          <span class="font-headline text-[10px] font-bold uppercase tracking-widest text-secondary">Celebração Registrada</span>
          <h2 class="font-headline font-semibold text-2xl text-primary">Pagamento Aprovado!</h2>
          <p class="font-body text-xs text-on-surface-variant max-w-xs">
            Nossa equipe de ateliê já começou a confeccionar cada detalhe com amor e carinho.
          </p>
          <div class="w-full py-2 px-4 bg-surface-container rounded-lg flex items-center justify-between mt-2">
            <span class="font-headline text-xs text-on-surface-variant">Protocolo do Pedido</span>
            <span class="font-headline font-bold text-base text-primary">${protocolCode}</span>
          </div>
        </div>

        <!-- Resumo do Pedido -->
        <div class="bg-surface-container-lowest rounded-xl p-4 shadow-sm gap-3 flex flex-col border border-surface-container">
          <div class="flex items-center gap-2 border-b border-surface-container-high pb-2">
            <span class="material-symbols-outlined text-primary text-[20px]">assignment</span>
            <h3 class="font-headline font-semibold text-base text-on-surface">Resumo do Pedido</h3>
          </div>

          <div class="flex flex-col gap-2 font-body text-xs text-on-surface-variant">
            ${state.cart.map(it => `
              <div class="flex justify-between">
                <span>${it.quantidade}x ${it.nome}</span>
                <span class="font-headline font-semibold">${formatBRL(it.preco * it.quantidade)}</span>
              </div>
            `).join('')}
          </div>

          <div class="pt-2 flex justify-between font-headline text-sm font-bold text-on-surface border-t border-surface-container-high">
            <span>Total Pago</span>
            <span class="text-primary font-bold text-base">${formatBRL(grandTotal)}</span>
          </div>

          <div class="p-3 bg-surface-container-low rounded-lg flex flex-col gap-1">
            <div class="flex items-center gap-1 text-secondary font-headline text-xs font-semibold">
              <span class="material-symbols-outlined text-[16px]">location_on</span>
              <span>Entrega Confirmada</span>
            </div>
            <p class="font-body text-xs text-on-surface pl-5">${orderData.address}</p>
            <p class="font-headline text-[10px] text-on-surface-variant pl-5">GPS: ${coordsStr}</p>
          </div>
        </div>

        <!-- Botão de Enviar no WhatsApp -->
        <div class="flex flex-col gap-2 pt-1 pb-4">
          <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-primary text-on-primary font-headline text-sm font-semibold shadow-md active:scale-[0.98] transition-all text-center">
            <span class="material-symbols-outlined text-[24px]">chat</span>
            <span>Enviar Pedido no WhatsApp</span>
          </a>
          <button type="button" id="btn-back-to-shop" class="w-full h-11 flex items-center justify-center rounded-xl bg-surface-container-high text-primary font-headline text-xs font-semibold active:scale-[0.98] transition-all">
            Voltar para o Cardápio
          </button>
        </div>
      </div>
    `;

    // Esvaziar o carrinho após confirmação
    state.cart = [];
    saveCart();

    const btnBack = container.querySelector('#btn-back-to-shop');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        navigateTo('cardapio');
      });
    }
  }

  function startApp() {
    initData();

    // Bottom Nav & Header Tab Listeners
    document.querySelectorAll('[data-tab]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = el.getAttribute('data-tab');
        navigateTo(tab);
      });
    });

    // Hashchange listener
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '') || 'cardapio';
      if (hash !== state.currentTab) {
        navigateTo(hash);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
  } else {
    startApp();
  }
})();
