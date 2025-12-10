const API_URL = 'http://localhost:5000/api/produtos';
const gridInfo = document.getElementById('products-grid');
const cartBtn = document.getElementById('cart-btn');

// Estado do Carrinho
let carrinho = [];

async function loadProducts() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const produtos = await response.json();
        renderProducts(produtos);

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

function renderProducts(produtos) {
    gridInfo.innerHTML = ''; // Limpa o loading

    produtos.forEach(produto => {
        const card = document.createElement('article');
        card.className = 'product-card';

        // Formatação de Moeda Brasileira (R$ X.XXX,XX)
        const precoFormatado = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(produto.preco);

        // Uso de imagem real vinda da API
        const imageUrl = produto.imagemUrl || `https://placehold.co/400x300/1e1e1e/ff9900?text=${encodeURIComponent(produto.nome)}`;

        card.innerHTML = `
            <div class="card-image">
                <img src="${imageUrl}" alt="${produto.nome}">
            </div>
            <div class="card-content">
                <div class="product-category">${produto.categoria}</div>
                <h3 class="product-title">${produto.nome}</h3>
                <div class="product-price">${precoFormatado}</div>
                <button class="btn-buy" onclick="adicionarAoCarrinho(${JSON.stringify(produto).replace(/"/g, '&quot;')})">
                    Adicionar ao Carrinho
                </button>
            </div>
        `;

        gridInfo.appendChild(card);
    });
}

function adicionarAoCarrinho(produto) {
    carrinho.push(produto);
    atualizarCarrinhoUI();

    // Feedback ao usuário
    console.log(`Produto adicionado: ${produto.nome}`);
    alert(`${produto.nome} foi adicionado ao carrinho!`);
}

function atualizarCarrinhoUI() {
    if (cartBtn) {
        cartBtn.textContent = `Carrinho (${carrinho.length})`;
    }
}

// Inicia o carregamento ao abrir a página
document.addEventListener('DOMContentLoaded', loadProducts);
