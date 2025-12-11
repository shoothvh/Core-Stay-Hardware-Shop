const cartItemsContainer = document.getElementById('cart-items');
const subtotalEl = document.getElementById('subtotal');
const totalEl = document.getElementById('total');
const discountRow = document.getElementById('discount-row');
const discountEl = document.getElementById('discount');
const couponInput = document.getElementById('coupon-input');
const couponStatus = document.getElementById('coupon-status');

// Cupons válidos
const VALID_COUPONS = {
    'CORESTAY10': 0.10,
    'GAMER20': 0.20,
    'HARDWARE15': 0.15
};

let appliedDiscount = 0;
let appliedCouponCode = '';

// Carregar carrinho do localStorage
function getCarrinho() {
    return JSON.parse(localStorage.getItem('carrinho')) || [];
}

// Salvar carrinho no localStorage
function saveCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Aplicar cupom
function aplicarCupom() {
    const code = couponInput.value.trim().toUpperCase();

    if (!code) {
        showCouponStatus('Digite um cupom', 'error');
        return;
    }

    const discount = VALID_COUPONS[code];

    if (discount) {
        appliedDiscount = discount;
        appliedCouponCode = code;
        showCouponStatus(`✓ Cupom ${code} aplicado! ${discount * 100}% OFF`, 'success');
        couponInput.disabled = true;
        renderCarrinho();
    } else {
        showCouponStatus('✗ Cupom inválido', 'error');
    }
}

function showCouponStatus(message, type) {
    couponStatus.textContent = message;
    couponStatus.className = type;
}

// Renderizar itens do carrinho
function renderCarrinho() {
    const carrinho = getCarrinho();

    if (carrinho.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Seu carrinho está vazio</h3>
                <p>Explore nosso <a href="index.html">catálogo</a> e adicione produtos!</p>
            </div>
        `;
        subtotalEl.textContent = formatarMoeda(0);
        totalEl.textContent = formatarMoeda(0);
        if (discountRow) discountRow.style.display = 'none';
        return;
    }

    let html = '';
    let subtotal = 0;

    carrinho.forEach((item, index) => {
        const preco = parseFloat(item.preco) || 0;
        subtotal += preco;

        html += `
            <div class="cart-item">
                <img src="${item.imagemUrl || 'https://placehold.co/80x80/1e1e1e/ff9900?text=Produto'}" alt="${item.nome}">
                <div class="cart-item-info">
                    <h4>${item.nome}</h4>
                    <p>${item.categoria}</p>
                </div>
                <div class="cart-item-price">${formatarMoeda(preco)}</div>
                <button class="btn-remove" onclick="removerItem(${index})">Remover</button>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = html;
    subtotalEl.textContent = formatarMoeda(subtotal);

    // Calcular desconto
    if (appliedDiscount > 0) {
        const discountAmount = subtotal * appliedDiscount;
        const total = subtotal - discountAmount;

        if (discountRow) {
            discountRow.style.display = 'flex';
            discountEl.textContent = `- ${formatarMoeda(discountAmount)}`;
        }
        totalEl.textContent = formatarMoeda(total);
    } else {
        if (discountRow) discountRow.style.display = 'none';
        totalEl.textContent = formatarMoeda(subtotal);
    }
}

// Remover item do carrinho
function removerItem(index) {
    const carrinho = getCarrinho();
    carrinho.splice(index, 1);
    saveCarrinho(carrinho);
    renderCarrinho();
}

// Formatar moeda BRL
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

// Get selected payment method
function getPaymentMethod() {
    const selected = document.querySelector('input[name="payment"]:checked');
    return selected ? selected.value : 'pix';
}

// Payment method labels
function getPaymentLabel(method) {
    const labels = {
        'pix': 'PIX (5% OFF)',
        'credit': 'Cartão de Crédito',
        'debit': 'Cartão de Débito (3% OFF)',
        'boleto': 'Boleto Bancário'
    };
    return labels[method] || method;
}

// Finalizar compra (simulação)
function finalizarCompra() {
    // 1. Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Você precisa estar logado para finalizar a compra.');
        window.location.href = 'login.html';
        return;
    }

    const carrinho = getCarrinho();

    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    // 2. Get payment method and apply discount
    const paymentMethod = getPaymentMethod();
    let paymentDiscount = 0;
    if (paymentMethod === 'pix') paymentDiscount = 0.05;
    if (paymentMethod === 'debit') paymentDiscount = 0.03;

    const subtotal = carrinho.reduce((sum, item) => sum + parseFloat(item.preco), 0);
    const couponDiscount = subtotal * appliedDiscount;
    const paymentDiscountValue = (subtotal - couponDiscount) * paymentDiscount;
    const total = subtotal - couponDiscount - paymentDiscountValue;


    // Save order to history
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    const newOrder = {
        id: Date.now(),
        date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        items: carrinho,
        subtotal: subtotal,
        discount: couponDiscount + paymentDiscountValue,
        total: total,
        coupon: appliedCouponCode,
        paymentMethod: paymentMethod,
        userId: currentUser.id,
        userEmail: currentUser.email,
        status: 'processing' // processing, shipped, delivered
    };
    orderHistory.unshift(newOrder);
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

    let message = 'Compra finalizada com sucesso!\n\n';
    message += `Pedido #${newOrder.id}\n`;
    message += `Subtotal: ${formatarMoeda(subtotal)}\n`;
    if (appliedDiscount > 0) {
        message += `Desconto Cupom (${appliedCouponCode}): -${formatarMoeda(couponDiscount)}\n`;
    }
    if (paymentDiscountValue > 0) {
        message += `Desconto ${getPaymentLabel(paymentMethod)}: -${formatarMoeda(paymentDiscountValue)}\n`;
    }
    message += `Pagamento: ${getPaymentLabel(paymentMethod)}\n`;
    message += `Total: ${formatarMoeda(total)}\n\n`;
    message += 'Acompanhe seu pedido em "Meus Pedidos"!';

    // Confetti celebration! 🎉
    if (typeof confetti !== 'undefined') {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff6b00', '#ff9500', '#ffcc00', '#34c759', '#007aff']
        });
        setTimeout(() => {
            confetti({
                particleCount: 100,
                angle: 60,
                spread: 55,
                origin: { x: 0 }
            });
        }, 200);
        setTimeout(() => {
            confetti({
                particleCount: 100,
                angle: 120,
                spread: 55,
                origin: { x: 1 }
            });
        }, 400);
    }

    setTimeout(() => alert(message), 600);
    localStorage.removeItem('carrinho');
    appliedDiscount = 0;
    appliedCouponCode = '';
    if (couponInput) {
        couponInput.value = '';
        couponInput.disabled = false;
    }
    if (couponStatus) couponStatus.textContent = '';
    renderCarrinho();
}

// ========== SHIPPING CALCULATOR ==========
function calcularFrete() {
    const cepInput = document.getElementById('cep-input');
    const result = document.getElementById('shipping-result');

    if (!cepInput || !result) return;

    let cep = cepInput.value.replace(/\D/g, '');

    if (cep.length !== 8) {
        result.textContent = '✗ CEP inválido';
        result.style.color = '#ff4444';
        return;
    }

    // Simulate shipping calculation based on region
    const region = cep.substring(0, 1);
    let days, price;

    switch (region) {
        case '0': case '1': // SP region
            days = '1-2 dias úteis';
            price = 'Grátis';
            break;
        case '2': case '3': // RJ/MG region
            days = '3-5 dias úteis';
            price = 'R$ 15,90';
            break;
        case '4': case '5': // Sul region
            days = '5-7 dias úteis';
            price = 'R$ 25,90';
            break;
        default: // Other regions
            days = '7-10 dias úteis';
            price = 'R$ 35,90';
    }

    result.innerHTML = `✓ ${price} - Entrega em ${days}`;
    result.style.color = '#34c759';
}

// Format CEP input
document.addEventListener('DOMContentLoaded', () => {
    const cepInput = document.getElementById('cep-input');
    if (cepInput) {
        cepInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            }
            e.target.value = value;
        });
    }
});

// Inicializar
renderCarrinho();
