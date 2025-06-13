const { formatCurrency } = require('../utils/cartUtils');

describe('formatCurrency', () => {
    it('formata corretamente inteiros', () => {
        expect(formatCurrency(10)).toBe('R$ 10,00');
    });
    it('formata corretamente floats', () => {
        expect(formatCurrency(7.5)).toBe('R$ 7,50');
    });
    it('formata 0 como R$ 0,00', () => {
        expect(formatCurrency(0)).toBe('R$ 0,00');
    });
});