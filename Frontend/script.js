const API_URL = 'http://localhost:5000/api/produtos';
const gridInfo = document.getElementById('products-grid');
const cartBtn = document.getElementById('cart-btn');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

// Store all products for filtering
let allProducts = [];
let currentSort = 'default';

// ========== LOCAL STORAGE HELPERS ==========
function getCarrinho() {
    return JSON.parse(localStorage.getItem('carrinho')) || [];
}

function saveCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function getWishlist() {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
}

function saveWishlist(wishlist) {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function getTheme() {
    return localStorage.getItem('theme') || 'dark';
}

function saveTheme(theme) {
    localStorage.setItem('theme', theme);
}

// ========== THEME TOGGLE ==========
function initTheme() {
    const theme = getTheme();
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon();
}

function toggleTheme() {
    const current = getTheme();
    const newTheme = current === 'dark' ? 'light' : 'dark';
    saveTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        const icon = btn.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', getTheme() === 'dark' ? 'sun' : 'moon');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    }
}

// ========== SKELETON LOADING ==========
function showSkeletons(count = 6) {
    gridInfo.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const skeleton = document.createElement('article');
        skeleton.className = 'product-card skeleton-card';
        skeleton.innerHTML = `
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
                <div class="skeleton-line short"></div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line medium"></div>
                <div class="skeleton-line short"></div>
            </div>
        `;
        skeleton.style.animation = `fadeIn 0.3s ease ${i * 0.05}s backwards`;
        gridInfo.appendChild(skeleton);
    }
}

// ========== LOAD PRODUCTS ==========
async function loadProducts() {
    try {
        showSkeletons(6);

        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

        allProducts = await response.json();

        // Simulate network delay for skeleton effect
        await new Promise(r => setTimeout(r, 500));

        renderProducts(allProducts);
        atualizarCarrinhoUI();
        setupFilters();
        setupSearch();
        setupSorting();

    } catch (error) {
        console.error('Falha ao buscar produtos:', error);
        gridInfo.innerHTML = `
            <div class="error">
                <p>⚠️ Não foi possível carregar o catálogo.</p>
                <small>${error.message}</small>
            </div>
        `;
    }
}

// ========== RENDER PRODUCTS ==========
function renderProducts(produtos) {
    gridInfo.innerHTML = '';

    if (produtos.length === 0) {
        gridInfo.innerHTML = '<div class="loading">Nenhum produto encontrado.</div>';
        return;
    }

    const wishlist = getWishlist();

    produtos.forEach((produto, index) => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.style.opacity = '0';
        card.style.animation = `fadeInUp 0.5s ease-out ${index * 0.06}s forwards`;

        const precoFormatado = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(produto.preco);

        const parcela = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(produto.preco / 12);

        const imageUrl = produto.imagemUrl || `https://placehold.co/400x300/1e1e1e/ff9900?text=${encodeURIComponent(produto.nome)}`;

        // Badges logic
        const isNew = produto.id >= 8; // Products 8-10 are "new"
        const inStock = Math.random() > 0.2;

        let badgeHtml = '';
        if (isNew) {
            badgeHtml = '<span class="badge new">Novo!</span>';
        } else if (inStock) {
            badgeHtml = '<span class="badge in-stock">Em estoque</span>';
        } else {
            badgeHtml = '<span class="badge low-stock">Últimas unidades</span>';
        }

        const isWished = wishlist.includes(produto.id);
        const heartClass = isWished ? 'heart-btn active' : 'heart-btn';
        const rating = getProductRating(produto.id);
        const reviewCount = getReviewCount(produto.id);

        card.innerHTML = `
            <button class="${heartClass}" onclick="toggleWishlist(${produto.id})" title="Adicionar aos favoritos">
                ${isWished ? '❤️' : '🤍'}
            </button>
            <a href="produto.html?id=${produto.id}" class="card-link">
                <div class="card-image">
                    ${badgeHtml}
                    <img src="${imageUrl}" alt="${produto.nome}" loading="lazy">
                    <button class="quick-view-btn" onclick="event.preventDefault(); openQuickView(${produto.id})">👁️ Visualização Rápida</button>
                </div>
            </a>
            <div class="card-content">
                <div class="product-category">${produto.categoria}</div>
                <h3 class="product-title">
                    <a href="produto.html?id=${produto.id}">${produto.nome}</a>
                </h3>
                <div class="product-rating">${generateStars(rating)} <span>(${reviewCount})</span></div>
                <p class="product-specs">${produto.descricao || ''}</p>
                <div class="product-price">${precoFormatado}</div>
                <div class="product-installments">ou 12x de ${parcela}</div>
                <button class="btn-buy" onclick="adicionarAoCarrinho(${JSON.stringify(produto).replace(/"/g, '&quot;')})">
                    <span>Adicionar ao Carrinho</span>
                </button>
            </div>
        `;

        gridInfo.appendChild(card);
    });
}

// ========== WISHLIST ==========
function toggleWishlist(productId) {
    let wishlist = getWishlist();

    if (wishlist.includes(productId)) {
        wishlist = wishlist.filter(id => id !== productId);
        showToast('Removido dos favoritos');
    } else {
        wishlist.push(productId);
        showToast('Adicionado aos favoritos! ❤️');
    }

    saveWishlist(wishlist);
    renderProducts(getSortedProducts());
}

// ========== SORTING ==========
function setupSorting() {
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderProducts(getSortedProducts());
        });
    }
}

function getSortedProducts() {
    let filtered = [...allProducts];

    // Apply current filter if any
    const activeFilter = document.querySelector('.filter-btn.active');
    if (activeFilter && activeFilter.dataset.category !== 'all') {
        filtered = filtered.filter(p => p.categoria === activeFilter.dataset.category);
    }

    // Apply search if any
    if (searchInput && searchInput.value.trim()) {
        const query = searchInput.value.toLowerCase().trim();
        filtered = filtered.filter(p =>
            p.nome.toLowerCase().includes(query) ||
            p.categoria.toLowerCase().includes(query)
        );
    }

    // Apply sorting
    switch (currentSort) {
        case 'price-asc':
            filtered.sort((a, b) => a.preco - b.preco);
            break;
        case 'price-desc':
            filtered.sort((a, b) => b.preco - a.preco);
            break;
        case 'name-asc':
            filtered.sort((a, b) => a.nome.localeCompare(b.nome));
            break;
        case 'name-desc':
            filtered.sort((a, b) => b.nome.localeCompare(a.nome));
            break;
    }

    return filtered;
}

// ========== FILTERS ==========
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProducts(getSortedProducts());
        });
    });
}

function filterByCategory(category) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    renderProducts(getSortedProducts());
}

// ========== SEARCH ==========
function setupSearch() {
    if (!searchInput || !searchBtn) return;

    searchBtn.addEventListener('click', () => renderProducts(getSortedProducts()));
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') renderProducts(getSortedProducts());
    });
    searchInput.addEventListener('input', () => {
        if (searchInput.value === '') renderProducts(getSortedProducts());
    });
}

// ========== CART ==========
function adicionarAoCarrinho(produto) {
    const carrinho = getCarrinho();
    carrinho.push(produto);
    saveCarrinho(carrinho);
    atualizarCarrinhoUI();
    showToast(`${produto.nome} adicionado ao carrinho!`);
    animateCartBadge();
    saveRecentlyViewed(produto.id);
}

function atualizarCarrinhoUI() {
    const carrinho = getCarrinho();
    if (cartBtn) {
        // Preserve the icon, only update the text and badge
        cartBtn.innerHTML = `<i data-lucide="shopping-cart"></i> Carrinho <span class="cart-badge">${carrinho.length}</span>`;
        // Re-create the icon
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

function animateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        badge.classList.add('bounce');
        setTimeout(() => badge.classList.remove('bounce'), 500);
    }
}

// ========== TOAST ==========
function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========== COMPARE PRODUCTS ==========
let compareList = [];

function toggleCompare(productId) {
    if (compareList.includes(productId)) {
        compareList = compareList.filter(id => id !== productId);
        showToast('Removido da comparação');
    } else {
        if (compareList.length >= 3) {
            showToast('Máximo 3 produtos para comparar!');
            return;
        }
        compareList.push(productId);
        showToast('Adicionado à comparação');
    }
    updateCompareUI();
    renderProducts(getSortedProducts());
}

function updateCompareUI() {
    const compareBar = document.getElementById('compare-bar');
    if (!compareBar) return;

    if (compareList.length > 0) {
        compareBar.classList.add('show');
        compareBar.querySelector('.compare-count').textContent = compareList.length;
    } else {
        compareBar.classList.remove('show');
    }
}

function openCompareModal() {
    if (compareList.length < 2) {
        showToast('Selecione pelo menos 2 produtos');
        return;
    }

    const products = compareList.map(id => allProducts.find(p => p.id === id));
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal compare-modal">
            <button class="modal-close" onclick="closeModal(this)">&times;</button>
            <h2>Comparar Produtos</h2>
            <div class="compare-grid">
                ${products.map(p => `
                    <div class="compare-item">
                        <img src="${p.imagemUrl}" alt="${p.nome}">
                        <h3>${p.nome}</h3>
                        <div class="compare-price">${formatPrice(p.preco)}</div>
                        <div class="compare-specs">${p.descricao || ''}</div>
                        <button class="btn-buy" onclick="adicionarAoCarrinho(${JSON.stringify(p).replace(/"/g, '&quot;')}); closeModal(this.closest('.modal-overlay'))">
                            Adicionar
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
}

function clearCompare() {
    compareList = [];
    updateCompareUI();
    renderProducts(getSortedProducts());
    showToast('Comparação limpa');
}

// ========== QUICK VIEW MODAL ==========
function openQuickView(productId) {
    const produto = allProducts.find(p => p.id === productId);
    if (!produto) return;

    saveRecentlyViewed(productId);

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal quick-view-modal">
            <button class="modal-close" onclick="closeModal(this)">&times;</button>
            <div class="quick-view-content">
                <div class="quick-view-image">
                    <img src="${produto.imagemUrl}" alt="${produto.nome}">
                </div>
                <div class="quick-view-info">
                    <span class="product-category">${produto.categoria}</span>
                    <h2>${produto.nome}</h2>
                    <div class="quick-view-rating">
                        ${generateStars(getProductRating(productId))}
                        <span>(${getReviewCount(productId)} avaliações)</span>
                    </div>
                    <div class="quick-view-price">${formatPrice(produto.preco)}</div>
                    <div class="quick-view-installments">ou 12x de ${formatPrice(produto.preco / 12)}</div>
                    <p class="quick-view-specs">${produto.descricao || ''}</p>
                    <div class="quick-view-actions">
                        <button class="btn-buy" onclick="adicionarAoCarrinho(${JSON.stringify(produto).replace(/"/g, '&quot;')}); closeModal(this.closest('.modal-overlay'))">
                            Adicionar ao Carrinho
                        </button>
                        <a href="produto.html?id=${produto.id}" class="btn-details">Ver Detalhes</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
}

function closeModal(element) {
    const modal = element.closest('.modal-overlay');
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 300);
}

// ========== REVIEWS/RATINGS ==========
function getProductRating(productId) {
    const ratings = JSON.parse(localStorage.getItem('ratings')) || {};
    return ratings[productId] || (3.5 + Math.random() * 1.5);
}

function getReviewCount(productId) {
    return Math.floor(10 + Math.random() * 90);
}

function generateStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '⯨' : '') + '☆'.repeat(empty);
}

// ========== RECENTLY VIEWED ==========
function getRecentlyViewed() {
    return JSON.parse(localStorage.getItem('recentlyViewed')) || [];
}

function saveRecentlyViewed(productId) {
    let recent = getRecentlyViewed();
    recent = recent.filter(id => id !== productId);
    recent.unshift(productId);
    recent = recent.slice(0, 5);
    localStorage.setItem('recentlyViewed', JSON.stringify(recent));
}

// ========== DISCOUNT COUPONS ==========
const VALID_COUPONS = {
    'CORESTAY10': 0.10,
    'GAMER20': 0.20,
    'HARDWARE15': 0.15
};

function applyCoupon(code) {
    const discount = VALID_COUPONS[code.toUpperCase()];
    if (discount) {
        localStorage.setItem('appliedCoupon', JSON.stringify({ code: code.toUpperCase(), discount }));
        showToast(`Cupom ${code.toUpperCase()} aplicado! ${discount * 100}% OFF`);
        return true;
    }
    showToast('Cupom inválido');
    return false;
}

function getAppliedCoupon() {
    return JSON.parse(localStorage.getItem('appliedCoupon'));
}

function formatPrice(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

// ========== GLOBAL EXPORTS ==========
window.filterByCategory = filterByCategory;
window.toggleWishlist = toggleWishlist;
window.toggleTheme = toggleTheme;
window.toggleCompare = toggleCompare;
window.openQuickView = openQuickView;
window.openCompareModal = openCompareModal;
window.clearCompare = clearCompare;
window.closeModal = closeModal;
window.applyCoupon = applyCoupon;

// ========== NEWSLETTER ==========
function subscribeNewsletter(event) {
    event.preventDefault();
    const emailInput = document.getElementById('newsletter-email');
    const status = document.getElementById('newsletter-status');
    const email = emailInput.value.trim();

    if (!email) {
        status.textContent = '✗ Digite um e-mail válido';
        status.className = 'newsletter-status error';
        return;
    }

    // Simulate subscription (would be API call in production)
    const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers')) || [];

    if (subscribers.includes(email)) {
        status.textContent = '✓ E-mail já cadastrado!';
        status.className = 'newsletter-status success';
        return;
    }

    subscribers.push(email);
    localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));

    status.textContent = '✓ Inscrito com sucesso! Obrigado!';
    status.className = 'newsletter-status success';
    emailInput.value = '';

    showToast('🎉 Inscrito na newsletter!');
}

// ========== NAV VISIBILITY ==========
function updateNavVisibility() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const isLogged = user !== null;
    const isAdmin = user && user.isAdmin === true;

    // Hide all auth-dependent items first
    document.querySelectorAll('[data-auth]').forEach(el => {
        el.style.display = 'none';
    });

    // Show appropriate items
    if (isLogged) {
        // Show items for logged users
        document.querySelectorAll('[data-auth="logged"]').forEach(el => {
            el.style.display = '';
        });

        if (isAdmin) {
            // Show admin-only items
            document.querySelectorAll('[data-auth="admin"]').forEach(el => {
                el.style.display = '';
            });
        }
    } else {
        // Show guest-only items (like "Entrar" button)
        document.querySelectorAll('[data-auth="guest"]').forEach(el => {
            el.style.display = '';
        });
    }
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadProducts();
    updateNavVisibility();
    // Create icons after a short delay to ensure DOM is ready
    setTimeout(() => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, 100);
});
