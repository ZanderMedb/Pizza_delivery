// Carrega o carrinho do localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Função para formatar valores em reais
function formatCurrency(value) {
    return 'R$ ' + value.toFixed(2).replace('.', ',');
}

// Mostra informações do usuário
function displayUserInfo() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
        window.location.href = 'register.html';
        return;
    }

    const userInfoDiv = document.getElementById('user-info');
    userInfoDiv.innerHTML = `
        <div class="info-item">
            <strong>Nome:</strong> ${userInfo.nome}
        </div>
        <div class="info-item">
            <strong>Telefone:</strong> ${userInfo.telefone}
        </div>
        <div class="info-item">
            <strong>Endereço:</strong> ${userInfo.endereco}, ${userInfo.numero}
        </div>
        <div class="info-item">
            <strong>Complemento:</strong> ${userInfo.complemento || 'Não informado'}
        </div>
        <div class="info-item">
            <strong>Bairro:</strong> ${userInfo.bairro}
        </div>
        <div class="info-item">
            <strong>CEP:</strong> ${userInfo.cep}
        </div>
        <div class="info-item">
            <strong>Forma de Pagamento:</strong> ${userInfo.pagamento}
        </div>
    `;

    // Animação das informações
    anime({
        targets: '.info-item',
        opacity: [0, 1],
        translateY: [10, 0],
        delay: anime.stagger(100)
    });
}

// Renderiza o carrinho na tela
function renderCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = '';

    if (!cart || cart.length === 0) {
        document.querySelector('.cart-container').style.display = 'none';
        document.querySelector('.empty-cart').style.display = 'block';
        return;
    } else {
        document.querySelector('.cart-container').style.display = 'block';
        document.querySelector('.empty-cart').style.display = 'none';
    }

    let subtotal = 0;
    cart.forEach((item, idx) => {
        const pizza = window.pizzaJson.find(p => p.id == item.id);
        if (!pizza) return;

        const itemTotal = (item.price || pizza.price) * item.qt;
        subtotal += itemTotal;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <img src="${pizza.img}" alt="${pizza.name}">
            <div class="item-details">
                <div><strong>${pizza.name}</strong> ${item.size !== undefined ? `<span>(${pizza.sizes[item.size] || ""})</span>` : ''}</div>
                <div>${pizza.description || ''}</div>
                <div>${formatCurrency(item.price || pizza.price)}</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" data-action="minus" data-index="${idx}">-</button>
                <span>${item.qt}</span>
                <button class="quantity-btn" data-action="plus" data-index="${idx}">+</button>
            </div>
            <div>${formatCurrency(itemTotal)}</div>
        `;
        cartItemsDiv.appendChild(itemDiv);
    });

    // Atualiza totais
    const DELIVERY_FEE = 5.00;
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('delivery').textContent = formatCurrency(DELIVERY_FEE);
    document.getElementById('total').textContent = formatCurrency(subtotal + DELIVERY_FEE);

    // Eventos de + e -
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.getAttribute('data-index'));
            if (this.getAttribute('data-action') === 'plus') {
                cart[idx].qt++;
            } else if (this.getAttribute('data-action') === 'minus') {
                if (cart[idx].qt > 1) {
                    cart[idx].qt--;
                } else {
                    cart.splice(idx, 1);
                }
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        });
    });
}

// Finalizar pedido
document.getElementById('checkout').addEventListener('click', function(e) {
    e.preventDefault();

    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
        alert("Dados de entrega não encontrados. Redirecionando para o cadastro...");
        window.location.href = 'register.html';
        return;
    }

    // Animação do botão
    const checkoutBtn = this;
    checkoutBtn.disabled = true;
    checkoutBtn.innerHTML = '<span class="loading-spinner"></span> Processando...';

    // Enviar pedido para o backend
    fetch('http://127.0.0.1:3000/api/pedidos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...userInfo,
            carrinho: cart
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            anime({
                targets: '.cart-container',
                opacity: [1, 0],
                translateY: [0, -20],
                duration: 800,
                easing: 'easeOutQuad',
                complete: () => {
                    window.location.href = 'entrega.html';
                }
            });
        } else {
            throw new Error(data.message || "Erro ao processar pedido");
        }
    })
    .catch(err => {
        alert("Erro ao processar pedido: " + err.message);
        checkoutBtn.disabled = false;
        checkoutBtn.innerHTML = 'Finalizar Pedido';
    });
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    displayUserInfo();
});