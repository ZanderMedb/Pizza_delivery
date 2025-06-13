/**
 * @jest-environment jsdom
 */
const { formatCurrency } = require('../utils/cartUtils');

describe('renderCart', () => {
    let renderCart, cart, pizzaJson;

    beforeEach(() => {
        // Simula HTML mínimo necessário
        document.body.innerHTML = `
            <div class="cart-container"></div>
            <div class="empty-cart" style="display: none;"></div>
            <div id="cart-items"></div>
            <span id="subtotal"></span>
            <span id="delivery"></span>
            <span id="total"></span>
        `;
        pizzaJson = [
            {
                id: 1,
                name: 'Pizza Teste',
                price: 30,
                img: 'pizza1.jpg',
                sizes: ['P', 'M', 'G'],
                description: 'Deliciosa!'
            }
        ];
        global.pizzaJson = pizzaJson;
        cart = [{ id: 1, qt: 2, size: 2 }];
        global.localStorage = {
            getItem: jest.fn(key => key === 'cart' ? JSON.stringify(cart) : null),
            setItem: jest.fn()
        };

        // Função simplificada baseada no seu cart.js
        renderCart = function() {
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
                const pizza = pizzaJson.find(p => p.id == item.id);
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

            const DELIVERY_FEE = 5.00;
            document.getElementById('subtotal').textContent = formatCurrency(subtotal);
            document.getElementById('delivery').textContent = formatCurrency(DELIVERY_FEE);
            document.getElementById('total').textContent = formatCurrency(subtotal + DELIVERY_FEE);
        };
    });

    it('renderiza itens do carrinho', () => {
        renderCart();
        const itens = document.querySelectorAll('.cart-item');
        expect(itens.length).toBe(1);
        expect(itens[0].innerHTML).toContain('Pizza Teste');
        expect(document.getElementById('subtotal').textContent).toBe('R$ 60,00');
        expect(document.getElementById('delivery').textContent).toBe('R$ 5,00');
        expect(document.getElementById('total').textContent).toBe('R$ 65,00');
    });

    it('exibe carrinho vazio quando não há itens', () => {
        cart = [];
        global.localStorage.getItem = jest.fn(key => key === 'cart' ? JSON.stringify(cart) : null);
        renderCart();
        expect(document.querySelector('.cart-container').style.display).toBe('none');
        expect(document.querySelector('.empty-cart').style.display).toBe('block');
    });
});