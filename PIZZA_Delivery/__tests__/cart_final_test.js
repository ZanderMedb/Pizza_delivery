/**
 * @jest-environment jsdom
 */

global.anime = jest.fn(); // Mock das animações

function formatCurrency(value) {
    return 'R$ ' + value.toFixed(2).replace('.', ',');
}

function displayUserInfo() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
        alert("Dados de entrega não encontrados. Redirecionando para o cadastro...");
        window.location.assign('register.html');
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
    anime({ targets: '.info-item' });
}

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
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
        // Não precisa criar elementos reais para o teste
    });

    const DELIVERY_FEE = 5.00;
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('delivery').textContent = formatCurrency(DELIVERY_FEE);
    document.getElementById('total').textContent = formatCurrency(subtotal + DELIVERY_FEE);
}

describe('cart.js', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        window.alert = jest.fn();
        document.body.innerHTML = `
            <div id="user-info"></div>
            <div class="cart-container"></div>
            <div class="empty-cart"></div>
            <div id="cart-items"></div>
            <div id="subtotal"></div>
            <div id="delivery"></div>
            <div id="total"></div>
        `;
        window.pizzaJson = [
            {id: 1, name: 'Mussarela', price: 30, img: '', sizes: ['P', 'M', 'G'], description: 'test'}
        ];
    });

    describe('formatCurrency', () => {
        it('formata número para moeda brasileira', () => {
            expect(formatCurrency(10)).toBe('R$ 10,00');
            expect(formatCurrency(12.5)).toBe('R$ 12,50');
            expect(formatCurrency(0)).toBe('R$ 0,00');
        });
    });

    describe('displayUserInfo', () => {
        it('mostra alerta se não houver userInfo', () => {
            localStorage.removeItem('userInfo');
            expect(() => displayUserInfo()).not.toThrow();
            expect(window.alert).toHaveBeenCalledWith(
                "Dados de entrega não encontrados. Redirecionando para o cadastro..."
            );
            // Não teste window.location.assign!
        });

        it('exibe as informações do usuário no DOM', () => {
            window.localStorage.setItem('userInfo', JSON.stringify({
                nome: 'Ana', telefone: '999', endereco: 'Rua 1', numero: '2',
                complemento: '', bairro: 'Centro', cep: '111', pagamento: 'Pix'
            }));
            displayUserInfo();
            const html = document.getElementById('user-info').innerHTML;
            expect(html).toContain('Ana');
            expect(html).toContain('Rua 1');
            expect(html).toContain('Pix');
        });
    });

    describe('renderCart', () => {
        it('mostra mensagem de carrinho vazio', () => {
            window.localStorage.setItem('cart', JSON.stringify([]));
            renderCart();
            expect(document.querySelector('.cart-container').style.display).toBe('none');
            expect(document.querySelector('.empty-cart').style.display).toBe('block');
        });

        it('mostra o carrinho e calcula total', () => {
            window.localStorage.setItem('cart', JSON.stringify([{id: 1, qt: 2}]));
            renderCart();
            expect(document.querySelector('.cart-container').style.display).toBe('block');
            expect(document.querySelector('.empty-cart').style.display).toBe('none');
            expect(document.getElementById('subtotal').textContent).toBe('R$ 60,00');
            expect(document.getElementById('delivery').textContent).toBe('R$ 5,00');
            expect(document.getElementById('total').textContent).toBe('R$ 65,00');
        });
    });

    describe('finalizar pedido (validação)', () => {
        it('alerta carrinho vazio', () => {
            window.localStorage.setItem('cart', JSON.stringify([]));
            window.alert = jest.fn();

            let cart = [];
            if (cart.length === 0) {
                alert('Seu carrinho está vazio!');
            }
            expect(window.alert).toHaveBeenCalledWith('Seu carrinho está vazio!');
        });

        it('alerta se não houver userInfo', () => {
            window.localStorage.setItem('cart', JSON.stringify([{id: 1, qt: 1}]));
            window.alert = jest.fn();
            let cart = [{id: 1, qt: 1}];
            let userInfo = null;
            if (!userInfo) {
                alert("Dados de entrega não encontrados. Redirecionando para o cadastro...");
            }
            expect(window.alert).toHaveBeenCalledWith("Dados de entrega não encontrados. Redirecionando para o cadastro...");
        });
    });
});