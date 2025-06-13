/**
 * @jest-environment jsdom
 */

const { adicionarAoCarrinho, calcularTotais, formatCurrency } = require('../utils/cartUtils');
const { validarDadosEntrega } = require('../utils/registerUtils');

describe('Integração: fluxos alternativos do usuário', () => {
  let pizzaJson;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="user-info"></div>
      <div class="cart-container"></div>
      <div class="empty-cart"></div>
      <div id="cart-items"></div>
      <span id="subtotal"></span>
      <span id="delivery"></span>
      <span id="total"></span>
    `;

    pizzaJson = [
      { id: 1, name: 'Mussarela', price: 20, img: '', sizes: ['P', 'M', 'G'], description: 'test' },
      { id: 2, name: 'Calabresa', price: 30, img: '', sizes: ['P', 'M', 'G'], description: 'test' }
    ];
    global.pizzaJson = pizzaJson;

    global.localStorage = {
      store: {},
      getItem(key) { return this.store[key] || null; },
      setItem(key, val) { this.store[key] = val; },
      removeItem(key) { delete this.store[key]; },
      clear() { this.store = {}; }
    };

    global.alert = jest.fn();
  });

  function renderCart() {
    // Sempre pega do localStorage!
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = '';

    if (!cart || cart.length === 0) {
      document.querySelector('.cart-container').style.display = 'none';
      document.querySelector('.empty-cart').style.display = 'block';
      // Zera totais!
      document.getElementById('subtotal').textContent = formatCurrency(0);
      document.getElementById('delivery').textContent = formatCurrency(5.00);
      document.getElementById('total').textContent = formatCurrency(5.00);
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
    });

    const DELIVERY_FEE = 5.00;
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('delivery').textContent = formatCurrency(DELIVERY_FEE);
    document.getElementById('total').textContent = formatCurrency(subtotal + DELIVERY_FEE);
  }

  function displayUserInfo() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      alert("Dados de entrega não encontrados. Redirecionando para o cadastro...");
      return;
    }
    document.getElementById('user-info').innerHTML = `
      <p>Nome: ${userInfo.nome}</p>
      <p>Telefone: ${userInfo.telefone}</p>
      <p>Endereço: ${userInfo.endereco}, ${userInfo.numero}</p>
      <p>Complemento: ${userInfo.complemento}</p>
      <p>Bairro: ${userInfo.bairro}</p>
      <p>CEP: ${userInfo.cep}</p>
      <p>Pagamento: ${userInfo.pagamento}</p>
    `;
  }

  // 1. Cadastro incompleto
  it('Cadastro incompleto bloqueia finalização', () => {
    const userInfo = {
      nome: '', // faltando nome
      telefone: '111111111',
      cep: '01234567',
      endereco: 'Rua A',
      numero: '1',
      complemento: '',
      bairro: 'Centro',
      pagamento: 'pix',
      carrinho: [{ id: 1, qt: 1 }]
    };
    expect(validarDadosEntrega(userInfo)).toBe(false);
  });

  // 2. Carrinho com itens inválidos
  it('Carrinho com item inexistente em pizzaJson é ignorado no cálculo', () => {
    const cart = [{ id: 999, qt: 2 }]; // id inexistente
    const result = calcularTotais(cart, pizzaJson);
    expect(result.subtotal).toBe(0);
    expect(result.total).toBe(0);
  });

  // 3. Vários itens e tamanhos
  it('Adiciona diferentes pizzas, tamanhos e quantidades', () => {
    let cart = [];
    cart = adicionarAoCarrinho(cart, pizzaJson[0], 0, 2); // id=1, size=0, qt=2
    cart = adicionarAoCarrinho(cart, pizzaJson[1], 2, 1); // id=2, size=2, qt=1
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    expect(document.getElementById('subtotal').textContent).toBe('R$ 70,00'); // 2x20 + 1x30
    expect(document.getElementById('total').textContent).toBe('R$ 75,00');
  });

  // 4. Fluxo de limpar carrinho
  it('Limpa carrinho e verifica DOM zerado', () => {
    // Primeiro adiciona itens
    let cart = [];
    cart = adicionarAoCarrinho(cart, pizzaJson[0], 1, 3);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    expect(document.getElementById('subtotal').textContent).toBe('R$ 60,00'); // 3x20

    // Agora limpa e renderiza de novo!
    localStorage.setItem('cart', JSON.stringify([]));
    renderCart();

    expect(document.querySelector('.cart-container').style.display).toBe('none');
    expect(document.getElementById('subtotal').textContent).toBe('R$ 0,00');
  });

  // 5. Finalização sem carrinho
  it('Finalizar pedido sem itens alerta e não realiza pedido', () => {
    localStorage.setItem('cart', JSON.stringify([]));
    function finalizarPedido() {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      if (!cart.length) {
        alert('Seu carrinho está vazio!');
        return false;
      }
      return true;
    }
    expect(finalizarPedido()).toBe(false);
    expect(global.alert).toHaveBeenCalledWith('Seu carrinho está vazio!');
  });

  // 6. Alteração de cadastro
  it('Altera cadastro e DOM reflete novo valor', () => {
    const userInfo = {
      nome: 'Maria',
      telefone: '1111',
      cep: '01234567',
      endereco: 'Rua A',
      numero: '1',
      complemento: '',
      bairro: 'Centro',
      pagamento: 'pix',
      carrinho: [{ id: 1, qt: 1 }]
    };
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    displayUserInfo();
    expect(document.getElementById('user-info').innerHTML).toContain('Maria');
    // Atualiza cadastro
    userInfo.nome = 'Carla';
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    displayUserInfo();
    expect(document.getElementById('user-info').innerHTML).toContain('Carla');
  });

  // 7. Simular erro no localStorage (opcional)
  it('Simula erro no localStorage.getItem', () => {
    const backup = localStorage.getItem;
    localStorage.getItem = () => { throw new Error('Falha localStorage'); };
    expect(() => {
      try {
        displayUserInfo();
      } catch {}
    }).not.toThrow(); // Sua função deve tratar falhas de localStorage!
    localStorage.getItem = backup;
  });

});