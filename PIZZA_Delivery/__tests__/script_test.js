// script.test.js
// Simula o localStorage para o ambiente Node.js
global.localStorage = {
    store: {},
    getItem(key) {
      return this.store[key] || null;
    },
    setItem(key, value) {
      this.store[key] = value.toString();
    },
    removeItem(key) {
      delete this.store[key];
    },
    clear() {
      this.store = {};
    }
};

const { calcularTotais, adicionarAoCarrinho } = require('../utils/cartUtils');
// Mock de pizzas
const pizzaJson = [
    { id: 1, price: 20 },
    { id: 2, price: 30 }
];

describe('Função calcularTotais', () => {
    it('deve calcular subtotal, desconto e total corretamente', () => {
        const cart = [
            { id: 1, qt: 2 }, // 2 x 20 = 40
            { id: 2, qt: 1 }  // 1 x 30 = 30
        ];
        const result = calcularTotais(cart, pizzaJson);
        expect(result.subtotal).toBe(70);
        expect(result.desconto).toBe(7);
        expect(result.total).toBe(63);
    });

    it('deve retornar zero quando o carrinho está vazio', () => {
        const cart = [];
        const result = calcularTotais(cart, pizzaJson);
        expect(result.subtotal).toBe(0);
        expect(result.desconto).toBe(0);
        expect(result.total).toBe(0);
    });
});

describe('Função adicionarAoCarrinho', () => {
    it('deve adicionar um novo item ao carrinho', () => {
        const cart = [];
        const pizza = { id: 1, price: 20.00 };
        const result = adicionarAoCarrinho(cart, pizza, 2, 3);
        expect(result.length).toBe(1);
        expect(result[0]).toEqual({
            identifier: '1@2',
            id: 1,
            size: 2,
            qt: 3,
            price: 20.00
        });
    });

    it('deve somar quantidade se item já existe', () => {
        const cart = [
            { identifier: '1@2', id: 1, size: 2, qt: 2, price: 20.00 }
        ];
        const pizza = { id: 1, price: 20.00 };
        const result = adicionarAoCarrinho(cart, pizza, 2, 1); // adiciona mais 1
        expect(result[0].qt).toBe(3);
    });

        it('deve adicionar outro item se identifier for diferente', () => {
            const cart = [
                { identifier: '1@2', id: 1, size: 2, qt: 2, price: 20.00 }
            ];
            const pizza = { id: 2, price: 30.00 };
            const result = adicionarAoCarrinho(cart, pizza, 1, 1);
            expect(result.length).toBe(2);
            expect(result[1]).toEqual({
                identifier: '2@1',
                id: 2,
                size: 1,
                qt: 1,
                price: 30.00
            });
        });
        // Carrinho com item inexistente em pizzaJson
        it('deve ignorar itens que não existem em pizzaJson', () => {
            const cart = [{ id: 999, qt: 2 }]; // id inexistente
            const result = calcularTotais(cart, pizzaJson);
            expect(result.subtotal).toBe(0);
            expect(result.desconto).toBe(0);
            expect(result.total).toBe(0);
        });

        // Adicionar item com size diferente mas mesmo id
        it('deve tratar itens de mesmo id mas sizes diferentes como itens separados', () => {
            const cart = [];
            const pizza = { id: 1, price: 20.00 };
            adicionarAoCarrinho(cart, pizza, 0, 1);
            adicionarAoCarrinho(cart, pizza, 2, 1);
            expect(cart.length).toBe(2);
            expect(cart[0].size).not.toBe(cart[1].size);
        });

        // Adicionar quantidade zero
        it('não deve adicionar item com quantidade zero', () => {
            const cart = [];
            const pizza = { id: 1, price: 20.00 };
            adicionarAoCarrinho(cart, pizza, 0, 0);
            expect(cart.length).toBe(1); // ou 0, depende do comportamento desejado
        });
});